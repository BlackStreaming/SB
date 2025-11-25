// 1. Importar librerías
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 2. Configuración inicial
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_123';

// Configurar rutas para archivos estáticos (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que exista la carpeta uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 3. Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Servir la carpeta 'uploads' como pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer (Guardar archivos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// RUTA PARA SUBIR IMAGEN
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// 4. CONEXIÓN CONDICIONAL A LA BASE DE DATOS POSTGRESQL
const { Pool } = pg;
let dbConfig = {};

if (process.env.DATABASE_URL) {
    dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };
    console.log("Modo Producción: Usando DATABASE_URL de Render.");
} else {
    dbConfig = {
        user: 'postgres',
        host: 'localhost',
        database: 'blackstreaming_db',
        password: 'oleguer0329*',
        port: 5432,
    };
    console.log("Modo Desarrollo: Usando configuración local.");
}

const pool = new Pool(dbConfig);

// NUEVA FUNCIÓN: Verificar Conexión a la DB
pool.connect()
    .then(client => {
        console.log("✅ Conectado exitosamente a PostgreSQL.");
        client.release();
    })
    .catch(err => {
        console.error("❌ Error FATAL al conectar a la base de datos:", err.message);
    });

// --- FUNCIÓN HELPER PARA CREAR NOTIFICACIONES ---
const createNotification = async (userId, title, message, linkUrl = null) => {
    try {
        const query = `
      INSERT INTO notifications (user_id, title, message, link_url, is_read)
      VALUES ($1, $2, $3, $4, false)
      RETURNING *;
    `;
        await pool.query(query, [userId, title, message, linkUrl]);
        console.log(`Notificación creada para el usuario ${userId}: ${title}`);
    } catch (err) {
        console.error('Error al crear la notificación:', err.stack);
    }
};

// --- GUARDIAS DE SEGURIDAD (Middleware de Autenticación) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ error: 'No autorizado: Token no proporcionado.' });
    }
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'No autorizado: Token inválido.' });
        }
        req.user = payload.user;
        next();
    });
};

const authenticateToken_Permissive = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        req.user = null;
        return next();
    }
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            req.user = null;
        } else {
            req.user = payload.user;
        }
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'administrador') {
        return res.status(403).json({ error: 'Prohibido: No tienes permisos de administrador.' });
    }
    next();
};

const isProvider = (req, res, next) => {
    if (req.user.role !== 'proveedor') {
        return res.status(403).json({ error: 'Prohibido: No tienes permisos de proveedor.' });
    }
    next();
};

const isUser = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(403).json({ error: 'Prohibido: Debes iniciar sesión.' });
    }
    next();
};

// --- RUTAS DE AUTENTICACIÓN ---
app.post('/api/auth/register', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { username, email, password, phone_prefix, phone_number, referral_code } = req.body;
        if (!username || !email || !password) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Usuario, email y contraseña son requeridos.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        let referred_by_id = null;
        if (referral_code) {
            const referralResult = await client.query(
                'SELECT user_id FROM user_profiles WHERE referral_code = $1',
                [referral_code]
            );
            if (referralResult.rows.length > 0) {
                referred_by_id = referralResult.rows[0].user_id;
            }
        }
        const newUserQuery = `
      INSERT INTO users (username, email, password_hash, phone_prefix, phone_number, role, status)
      VALUES ($1, $2, $3, $4, $5, 'usuario', 'inactivo')
      RETURNING id;
    `;
        const userResult = await client.query(newUserQuery, [
            username,
            email,
            password_hash,
            phone_prefix,
            phone_number,
        ]);
        const newUserId = userResult.rows[0].id;
        const profileQuery = `
      INSERT INTO user_profiles (user_id, referred_by_id, balance_usd, points_balance)
      VALUES ($1, $2, 0, 0)
      RETURNING *;
    `;
        await client.query(profileQuery, [newUserId, referred_by_id]);
        await client.query('COMMIT');
        res.status(201).json({
            message: '¡Usuario registrado con éxito! Esperando activación del administrador.',
            userId: newUserId,
        });
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            return res.status(400).json({ error: 'El email o nombre de usuario ya existe.' });
        }
        console.error('Error en el registro:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// Ruta de Login (Actualizada con Puntos)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }
    try {
        const query = `
      SELECT u.*, up.account_tier, up.balance_usd, up.points_balance
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.email = $1;
    `;
        const result = await pool.query(query, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }
        if (user.status !== 'activo') {
            return res.status(403).json({ error: `Tu cuenta está ${user.status}. Contacta al administrador.` });
        }
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                username: user.username,
                tier: user.account_tier,
                balance_usd: user.balance_usd,
                points_balance: user.points_balance || 0,
            },
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: payload.user,
        });
    } catch (err) {
        console.error('Error en el login:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Ruta "Me" (Actualizada con Puntos)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const query = `
      SELECT u.*, up.account_tier, up.balance_usd, up.points_balance
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1;
    `;
        const result = await pool.query(query, [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        const user = result.rows[0];
        res.json({
            user: {
                id: user.id,
                role: user.role,
                username: user.username,
                tier: user.account_tier,
                balance_usd: user.balance_usd,
                points_balance: user.points_balance || 0,
            },
        });
    } catch (err) {
        console.error('Error fetching /auth/me:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- RUTAS DE CONTENIDO (Públicas) ---
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, slug, image_url FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const query = `
      SELECT
        p.id, p.name, p.slug, p.price_usd, p.fictitious_price_usd,
        p.offer_price_usd, p.tags, p.image_url, p.status,
        p.description, p.terms_conditions,
        p.duration_days, p.has_renewal, p.renewal_price_usd,
        c.name AS category_name,
        u.username AS provider_name,
        u.phone_prefix, u.phone_number,
        (SELECT ROUND(AVG(rating), 1) FROM provider_ratings WHERE provider_id = p.provider_id) AS provider_rating,
        CASE
          WHEN p.status = 'a pedido' THEN p.stock_quantity
          WHEN p.status = 'activacion' THEN p.stock_quantity
          ELSE (
            SELECT COUNT(psi.id)
            FROM product_stock_items psi
            WHERE psi.product_id = p.id AND psi.status = 'publicada'
          )
        END AS stock_quantity
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.provider_id = u.id
      WHERE p.is_published = TRUE
        AND p.status != 'inactivo'
      LIMIT 20;
    `;
        const result = await pool.query(query);
        res.json(result.rows.map(product => ({
            ...product,
            // CORRECCIÓN: Asegurar que tags sea un array para evitar .map is not a function
            tags: product.tags || [], 
            provider_phone: product.phone_prefix && product.phone_number
                ? `${product.phone_prefix}${product.phone_number}`
                : 'N/A',
        })));
    } catch (err) {
        console.error('Error fetching products:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Obtener Productos de UNA Categoría
app.get('/api/categories/:slug/products', async (req, res) => {
    const { slug } = req.params;
    try {
        const categoryResult = await pool.query('SELECT id, name FROM categories WHERE slug = $1', [slug]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        const category = categoryResult.rows[0];
        const productsQuery = `
      SELECT
        p.id, p.name, p.slug, p.price_usd, p.fictitious_price_usd,
        p.offer_price_usd, p.tags, p.image_url, p.status,
        p.description, p.terms_conditions,
        p.duration_days, p.has_renewal, p.renewal_price_usd,
        c.name AS category_name,
        u.username AS provider_name,
        u.phone_prefix, u.phone_number,
        (SELECT ROUND(AVG(rating), 1) FROM provider_ratings WHERE provider_id = p.provider_id) AS provider_rating,
        CASE
          WHEN p.status = 'a pedido' THEN p.stock_quantity
          WHEN p.status = 'activacion' THEN p.stock_quantity
          ELSE (SELECT COUNT(psi.id)
                FROM product_stock_items psi
                WHERE psi.product_id = p.id AND psi.status = 'publicada')
        END AS stock_quantity
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.provider_id = u.id
      WHERE
        c.id = $1
        AND p.is_published = TRUE
        AND p.status != 'inactivo';
    `;
        const productsResult = await pool.query(productsQuery, [category.id]);
        res.json({
            categoryName: category.name,
            products: productsResult.rows.map(product => ({
                ...product,
                // CORRECCIÓN: Asegurar que tags sea un array
                tags: product.tags || [],
                provider_phone: product.phone_prefix && product.phone_number
                    ? `${product.phone_prefix}${product.phone_number}`
                    : 'N/A',
            })),
        });
    } catch (err) {
        console.error('Error fetching category products:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Obtener UN Producto
app.get('/api/products/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const query = `
      SELECT
        p.id, p.name, p.slug, p.price_usd, p.fictitious_price_usd,
        p.offer_price_usd, p.tags, p.image_url, p.description,
        p.terms_conditions, p.delivery_time,
        p.status, p.duration_days, p.has_renewal, p.renewal_price_usd,
        c.name AS category_name,
        u.username AS provider_name,
        u.phone_prefix, u.phone_number,
        CASE
          WHEN p.status = 'a pedido' THEN p.stock_quantity
          WHEN p.status = 'activacion' THEN p.stock_quantity
          ELSE (
            SELECT COUNT(psi.id)
            FROM product_stock_items psi
            WHERE psi.product_id = p.id AND psi.status = 'publicada'
          )
        END AS stock_quantity
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.provider_id = u.id
      WHERE p.slug = $1
        AND p.is_published = TRUE
        AND p.status != 'inactivo';
    `;

        const result = await pool.query(query, [slug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const product = result.rows[0];
        
        // CORRECCIÓN: Asegurar que tags sea un array antes de enviarlo.
        if (!product.tags) {
            product.tags = [];
        }

        res.json({
            ...product,
            provider_phone:
                product.phone_prefix && product.phone_number
                    ? `${product.phone_prefix}${product.phone_number}`
                    : 'N/A',
        });

    } catch (err) {
        console.error('Error fetching single product:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// Obtener Slides del Carrusel
app.get('/api/carousel-slides', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, title, subtitle, image_url, link_url FROM carousel_slides WHERE is_active = TRUE ORDER BY sort_order'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching carousel slides:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// OBTENER PÁGINA DE UN PROVEEDOR
app.get('/api/providers/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // 1. Encontrar al proveedor por su username
        const providerQuery = `
      SELECT id, username
      FROM users
      WHERE username = $1 AND role = 'proveedor' AND status = 'activo';
    `;
        const providerResult = await pool.query(providerQuery, [username]);

        if (providerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }

        const provider = providerResult.rows[0];
        const providerId = provider.id;

        // 2. Encontrar todos los productos de ese proveedor
        const productsQuery = `
      SELECT
        p.id, p.name, p.slug, p.price_usd, p.offer_price_usd,
        p.image_url, p.status,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE
        p.provider_id = $1
        AND p.is_published = TRUE
        AND p.status != 'inactivo'
      ORDER BY p.name;
    `;
        const productsResult = await pool.query(productsQuery, [providerId]);

        // 3. Devolver la data en el formato que el frontend espera
        res.json({
            name: provider.username,
            description: `Productos y servicios ofrecidos por ${provider.username}.`,
            image_url: null,
            products: productsResult.rows
        });

    } catch (err) {
        console.error('Error fetching provider page data:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Ruta de Búsqueda
app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json([]);
    }
    try {
        const query = `
      SELECT
        p.id, p.name, p.slug, p.image_url, p.status,
        p.description, p.terms_conditions,
        p.duration_days, p.has_renewal, p.renewal_price_usd,
        u.username AS provider_name,
        CASE
          WHEN p.status = 'a pedido' THEN p.stock_quantity
          WHEN p.status = 'activacion' THEN p.stock_quantity
          ELSE (SELECT COUNT(psi.id)
                FROM product_stock_items psi
                WHERE psi.product_id = p.id AND psi.status = 'publicada')
        END AS stock_quantity
      FROM products p
      LEFT JOIN users u ON p.provider_id = u.id
      WHERE
        (p.name ILIKE $1 OR p.description ILIKE $1)
        AND p.is_published = TRUE
        AND p.status != 'inactivo'
      LIMIT 5;
    `;
        const result = await pool.query(query, [`%${q}%`]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error en la búsqueda:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Ruta de Validación de Cupón
app.post('/api/coupons/validate', authenticateToken_Permissive, async (req, res) => {
    const { couponCode } = req.body;
    const user = req.user;
    if (!couponCode) {
        return res.status(400).json({ error: 'El código del cupón es requerido.' });
    }
    try {
        const result = await pool.query('SELECT * FROM coupons WHERE code = $1', [couponCode]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cupón no encontrado.' });
        }
        const coupon = result.rows[0];
        if (!coupon.is_active) {
            return res.status(400).json({ error: 'Este cupón ha expirado.' });
        }
        if (coupon.current_uses >= coupon.max_uses) {
            return res.status(400).json({ error: 'Este cupón ha alcanzado su límite de usos.' });
        }
        if (coupon.required_tier) {
            if (!user) {
                return res.status(403).json({ error: `Este cupón es solo para usuarios ${coupon.required_tier}. Inicia sesión.` });
            }
            if (user.tier !== coupon.required_tier) {
                return res.status(403).json({ error: `Este cupón es exclusivo para el tier ${coupon.required_tier}.` });
            }
        }
        res.json({
            id: coupon.id,
            code: coupon.code,
            discount_percent: parseFloat(coupon.discount_percent),
        });
    } catch (err) {
        console.error('Error validating coupon:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ---
// 8. RUTAS DE ADMIN (Privadas)
// ---

// CRUD de Categorías
app.get('/api/categories-admin', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching categories (admin):', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/categories', authenticateToken, isAdmin, async (req, res) => {
    const { name, slug, image_url } = req.body;
    const adminId = req.user.id;
    if (!name || !slug) {
        return res.status(400).json({ error: 'Nombre y slug son requeridos.' });
    }
    try {
        const newCategoryQuery = `
      INSERT INTO categories (name, slug, image_url, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const result = await pool.query(newCategoryQuery, [name, slug, image_url, adminId]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'El "slug" (URL amigable) ya existe.' });
        }
        console.error('Error creating category:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.put('/api/categories/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, slug, image_url } = req.body;
    if (!name || !slug) {
        return res.status(400).json({ error: 'Nombre y slug son requeridos.' });
    }
    try {
        const updateQuery = `
      UPDATE categories
      SET name = $1, slug = $2, image_url = $3
      WHERE id = $4
      RETURNING *;
    `;
        const result = await pool.query(updateQuery, [name, slug, image_url, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'El "slug" (URL amigable) ya existe.' });
        }
        console.error('Error updating category:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.delete('/api/categories/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'DELETE FROM categories WHERE id = $1 RETURNING *;';
        const result = await pool.query(deleteQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        res.json({ message: 'Categoría eliminada con éxito.' });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar: Hay productos usando esta categoría.' });
        }
        console.error('Error deleting category:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// CRUD del Carrusel
app.get('/api/carousel-slides-admin', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM carousel_slides ORDER BY sort_order');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching carousel slides (admin):', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/carousel-slides', authenticateToken, isAdmin, async (req, res) => {
    const { title, subtitle, image_url, link_url, is_active } = req.body;
    const adminId = req.user.id;
    if (!image_url) {
        return res.status(400).json({ error: 'La URL de la imagen es requerida.' });
    }
    try {
        const newSlideQuery = `
      INSERT INTO carousel_slides (title, subtitle, image_url, link_url, is_active, added_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const result = await pool.query(newSlideQuery, [title, subtitle, image_url, link_url, is_active, adminId]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating carousel slide:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.put('/api/carousel-slides/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, image_url, link_url, is_active } = req.body;
    if (!image_url) {
        return res.status(400).json({ error: 'La URL de la imagen es requerida.' });
    }
    try {
        const updateQuery = `
      UPDATE carousel_slides
      SET title = $1, subtitle = $2, image_url = $3, link_url = $4, is_active = $5
      WHERE id = $6
      RETURNING *;
    `;
        const result = await pool.query(updateQuery, [title, subtitle, image_url, link_url, is_active, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Slide no encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating slide:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.delete('/api/carousel-slides/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'DELETE FROM carousel_slides WHERE id = $1 RETURNING *;';
        const result = await pool.query(deleteQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Slide no encontrado.' });
        }
        res.json({ message: 'Slide eliminado con éxito.' });
    } catch (err) {
        console.error('Error deleting slide:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// CRUD de Usuarios
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const query = `
      SELECT u.id, u.username, u.email, u.phone_prefix, u.phone_number, u.role, u.status,
             up.balance_usd, up.account_tier, up.tier_expires_at, up.points_balance
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY u.created_at DESC;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.put('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { role, status, balance_usd, account_tier, tier_expires_at, points_balance } = req.body;

        if (!role || !status) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Rol y estado son requeridos.' });
        }
        if (String(req.user.id) === String(id) && (role !== 'administrador' || status !== 'activo')) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'No puedes bloquearte o degradarte a ti mismo.' });
        }

        const userQuery = `
      UPDATE users
      SET role = $1, status = $2
      WHERE id = $3
      RETURNING *;
    `;
        const userResult = await client.query(userQuery, [role, status, id]);
        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const profileQuery = `
      UPDATE user_profiles
      SET balance_usd = $1, account_tier = $2, tier_expires_at = $3, points_balance = $4
      WHERE user_id = $5;
    `;
        await client.query(profileQuery, [
            balance_usd || 0,
            account_tier,
            tier_expires_at || null,
            points_balance || 0,
            id,
        ]);

        await client.query('COMMIT');
        res.json(userResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating user:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

app.delete('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    if (String(req.user.id) === String(id)) {
        return res.status(403).json({ error: 'No puedes eliminarte a ti mismo.' });
    }
    try {
        const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING *;';
        const result = await pool.query(deleteQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json({ message: 'Usuario eliminado con éxito.' });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar: El usuario tiene datos asociados (pedidos, productos, etc.).' });
        }
        console.error('Error deleting user:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// CRUD de Cupones
app.get('/api/coupons', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM coupons ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching coupons:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Crear Cupón
app.post('/api/coupons', authenticateToken, isAdmin, async (req, res) => {
    const { code, discount_percent, required_tier, max_uses, is_active, assigned_user_id } = req.body;

    if (!code || !discount_percent) {
        return res.status(400).json({ error: 'Código y descuento son requeridos.' });
    }

    const final_required_tier = required_tier && required_tier.trim() !== '' ? required_tier : null;
    const final_assigned_user = assigned_user_id && assigned_user_id.trim() !== '' ? assigned_user_id : null;

    try {
        const newCouponQuery = `
      INSERT INTO coupons (code, discount_percent, required_tier, assigned_user_id, max_uses, is_active, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const result = await pool.query(newCouponQuery, [
            code,
            discount_percent,
            final_required_tier,
            final_assigned_user,
            max_uses,
            is_active,
            req.user.id
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: 'Ese código ya existe.' });
        console.error(err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
});

// Editar Cupón
app.put('/api/coupons/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { code, discount_percent, required_tier, max_uses, is_active, assigned_user_id } = req.body;

    const final_required_tier = required_tier && required_tier.trim() !== '' ? required_tier : null;
    const final_assigned_user = assigned_user_id && assigned_user_id.trim() !== '' ? assigned_user_id : null;

    try {
        const updateQuery = `
      UPDATE coupons
      SET code = $1, discount_percent = $2, required_tier = $3, assigned_user_id = $4, max_uses = $5, is_active = $6
      WHERE id = $7
      RETURNING *;
    `;
        const result = await pool.query(updateQuery, [
            code, discount_percent, final_required_tier, final_assigned_user, max_uses, is_active, id
        ]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Cupón no encontrado.' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
});

app.delete('/api/coupons/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'DELETE FROM coupons WHERE id = $1 RETURNING *;';
        const result = await pool.query(deleteQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cupón no encontrado.' });
        }
        res.json({ message: 'Cupón eliminado con éxito.' });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar: El usuario tiene datos asociados (pedidos, productos, etc.).' });
        }
        console.error('Error deleting coupon:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// CRUD de Productos (Admin)
app.get('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
    const { status, search } = req.query;
    try {
        let query = `
      SELECT
        p.*,
        c.name AS category_name,
        u.username AS provider_name,
        CASE
          WHEN p.status = 'a pedido' THEN p.stock_quantity
          WHEN p.status = 'activacion' THEN p.stock_quantity
          ELSE (SELECT COUNT(psi.id)
                FROM product_stock_items psi
                WHERE psi.product_id = p.id AND psi.status = 'publicada')
        END AS stock_quantity
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.provider_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (status) {
            query += ' AND p.status = $' + (params.length + 1);
            params.push(status);
        }
        if (search) {
            query += ' AND (p.name ILIKE $' + (params.length + 1) + ' OR p.description ILIKE $' + (params.length + 1) + ')';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY p.created_at DESC';
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching admin products:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
    const {
        name, description, image_url, category_id,
        price_usd, fictitious_price_usd, offer_price_usd,
        stock_quantity, status, tags,
        is_published, terms_conditions, delivery_time,
        provider_id, duration_days, has_renewal, renewal_price_usd
    } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    if (!name || !price_usd || !category_id) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
    }

    try {
        const newProductQuery = `
      INSERT INTO products (
        name, slug, description, image_url, provider_id, category_id,
        price_usd, fictitious_price_usd, offer_price_usd,
        duration_days, has_renewal, renewal_price_usd,
        stock_quantity, status, tags, is_published, terms_conditions, delivery_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *;
    `;
        const result = await pool.query(newProductQuery, [
            name, slug, description || null, image_url || null,
            provider_id || null, category_id,
            price_usd, fictitious_price_usd || null, offer_price_usd || null,
            duration_days || null, has_renewal || false, renewal_price_usd || null,
            stock_quantity || 0, status || 'inactivo',
            tags || null, is_published || false,
            terms_conditions || null, delivery_time || null,
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Slug duplicado.' });
        }
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Proveedor o categoría inválida.' });
        }
        console.error('Error creating admin product:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.put('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const {
        name, description, image_url, category_id,
        price_usd, fictitious_price_usd, offer_price_usd,
        stock_quantity, status, tags,
        is_published, terms_conditions, delivery_time,
        provider_id, duration_days, has_renewal, renewal_price_usd
    } = req.body;

    if (!name || !price_usd || !category_id) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
    }

    try {
        const updateQuery = `
      UPDATE products
      SET
        name = $1, description = $2, image_url = $3, category_id = $4, provider_id = $5,
        price_usd = $6, fictitious_price_usd = $7, offer_price_usd = $8,
        duration_days = $9, has_renewal = $10, renewal_price_usd = $11,
        stock_quantity = $12, status = $13, tags = $14,
        is_published = $15, terms_conditions = $16, delivery_time = $17
      WHERE id = $18
      RETURNING *;
    `;
        const result = await pool.query(updateQuery, [
            name, description || null, image_url || null, category_id, provider_id || null,
            price_usd, fictitious_price_usd || null, offer_price_usd || null,
            duration_days || null, has_renewal || false, renewal_price_usd || null,
            stock_quantity || 0, status || 'inactivo', tags || null,
            is_published || false, terms_conditions || null, delivery_time || null,
            id,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Slug duplicado.' });
        }
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Proveedor o categoría inválida.' });
        }
        console.error('Error updating admin product:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'DELETE FROM products WHERE id = $1 RETURNING *;';
        const result = await pool.query(deleteQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json({ message: 'Producto eliminado con éxito.' });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar: Este producto tiene pedidos asociados.' });
        }
        console.error('Error deleting admin product:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ---
// 9. RUTAS DE PROVEEDOR (Privadas)
// ---

// Obtener TODOS los productos de UN proveedor
app.get('/api/provider/products', authenticateToken, isProvider, async (req, res) => {
    const providerId = req.user.id;

    try {
        const query = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.provider_id = $1
      ORDER BY p.created_at DESC;
    `;

        const result = await pool.query(query, [providerId]);
        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching provider products:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Crear UN producto
app.post('/api/provider/products', authenticateToken, isProvider, async (req, res) => {
    const providerId = req.user.id;
    const {
        name, description, image_url, category_id,
        price_usd, fictitious_price_usd, offer_price_usd,
        tags, is_published, terms_conditions, delivery_time,
        duration_days, has_renewal, renewal_price_usd,
        status, stock_quantity
    } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    if (!name || !price_usd || !category_id) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
    }

    try {
        // VALIDACIÓN DE PERMISO DE CATEGORÍA
        const permissionCheck = await pool.query(
            'SELECT 1 FROM provider_allowed_categories WHERE provider_id = $1 AND category_id = $2',
            [providerId, category_id]
        );

        if (permissionCheck.rows.length === 0) {
            return res.status(403).json({ error: 'No tienes permiso para publicar productos en esta categoría. Contacta a un administrador.' });
        }

        const newProductQuery = `
      INSERT INTO products (
        name, slug, description, image_url, provider_id, category_id,
        price_usd, fictitious_price_usd, offer_price_usd,
        duration_days, has_renewal, renewal_price_usd,
        tags, is_published, terms_conditions, delivery_time,
        status, stock_quantity
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *;
    `;
        const result = await pool.query(newProductQuery, [
            name, slug, description || null, image_url || null, providerId, category_id,
            price_usd, fictitious_price_usd || null, offer_price_usd || null,
            duration_days || null, has_renewal || false, renewal_price_usd || null,
            tags || null, is_published || false,
            terms_conditions || null, delivery_time || null,
            status || 'agotado',
            stock_quantity || 0
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Ya existe un producto con ese nombre/slug.' });
        }
        if (err.code === '23503') {
            return res.status(400).json({ error: 'Categoría inválida.' });
        }
        console.error('Error creating product:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Actualizar UN producto
app.put('/api/provider/products/:id', authenticateToken, isProvider, async (req, res) => {
    const { id } = req.params;
    const providerId = req.user.id;
    const {
        name, description, image_url, category_id,
        price_usd, fictitious_price_usd, offer_price_usd,
        tags, is_published, terms_conditions, delivery_time,
        duration_days, has_renewal, renewal_price_usd,
        status, stock_quantity
    } = req.body;

    if (!name || !price_usd || !category_id) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
    }

    try {
        const updateQuery = `
      UPDATE products
      SET
        name = $1, description = $2, image_url = $3, category_id = $4,
        price_usd = $5, fictitious_price_usd = $6, offer_price_usd = $7,
        duration_days = $8, has_renewal = $9, renewal_price_usd = $10,
        tags = $11, is_published = $12, terms_conditions = $13, delivery_time = $14,
        status = $15, stock_quantity = $16
      WHERE id = $17 AND provider_id = $18
      RETURNING *;
    `;

        const result = await pool.query(updateQuery, [
            name, description || null, image_url || null, category_id,
            price_usd, fictitious_price_usd || null, offer_price_usd || null,
            duration_days || null, has_renewal || false, renewal_price_usd || null,
            tags || null, is_published || false,
            terms_conditions || null, delivery_time || null,
            status || 'agotado',
            stock_quantity || 0,
            id, providerId,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado o no te pertenece.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: 'Ya existe un producto con ese nombre/slug.' });
        console.error('Error updating product:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Eliminar UN producto
app.delete('/api/provider/products/:id', authenticateToken, isProvider, async (req, res) => {
    const { id } = req.params;
    const providerId = req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Verificar propiedad
        const check = await client.query('SELECT id FROM products WHERE id = $1 AND provider_id = $2', [id, providerId]);
        if (check.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Producto no encontrado o no te pertenece.' });
        }

        // 2. Eliminar items de stock asociados
        await client.query('DELETE FROM product_stock_items WHERE product_id = $1', [id]);

        // 3. Eliminar el producto
        const deleteQuery = 'DELETE FROM products WHERE id = $1 RETURNING *;';
        await client.query(deleteQuery, [id]);

        await client.query('COMMIT');
        res.json({ message: 'Producto eliminado con éxito.' });

    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar: Este producto tiene PEDIDOS (ventas) asociados.' });
        }
        console.error('Error deleting product:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// ---
// 9.5 RUTAS DE GESTIÓN DE PEDIDOS (PROVEEDOR)
// ---

// Obtener todos los items de pedidos para el proveedor logueado
app.get('/api/provider/orders', authenticateToken, isProvider, async (req, res) => {
    const providerId = req.user.id;
    console.log('Buscando pedidos para el Provider ID:', providerId);

    try {
        const query = `
      WITH provider_items AS (
        SELECT DISTINCT ON (oi.id)
          oi.id AS order_item_id,
          oi.status AS order_item_status,
          o.created_at AS order_date,
          o.user_id AS buyer_user_id,

          p.name AS product_name,
          p.status AS product_type,

          psi.id AS stock_item_id,
          psi.email,
          psi.password,
          psi.profile_name,
          psi.pin,

          psi.activation_date,
          oi.duration_days,
          oi.price_per_unit_usd,
          oi.has_renewal,
          oi.renewal_price_usd,

          oi.customer_name AS manual_customer_name,
          oi.customer_phone AS manual_customer_phone,
          u_buyer.username AS buyer_username,
          u_buyer.phone_prefix AS buyer_phone_prefix,
          u_buyer.phone_number AS buyer_phone_number

        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN orders o ON oi.order_id = o.id
        LEFT JOIN product_stock_items psi ON psi.order_item_id = oi.id
        LEFT JOIN users u_buyer ON o.user_id = u_buyer.id

        WHERE oi.provider_id = $1

        ORDER BY oi.id, psi.id ASC
      )
      SELECT * FROM provider_items
      ORDER BY
        CASE WHEN order_item_status = 'pendiente' THEN 1 ELSE 2 END,
        order_date DESC;
    `;

        const result = await pool.query(query, [providerId]);
        console.log(`Encontrados ${result.rows.length} pedidos para ${providerId}`);
        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching provider orders:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// Activar un pedido pendiente
app.post('/api/provider/orders/activate/:orderItemId', authenticateToken, isProvider, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { orderItemId } = req.params;
        const providerId = req.user.id;

        // 1. Obtenemos los datos necesarios
        const itemQuery = `
      SELECT
        oi.id,
        oi.product_id,
        oi.provider_id,
        o.user_id AS buyer_user_id
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.id = $1
        AND oi.provider_id = $2
        AND oi.status = 'pendiente'
    `;

        const itemResult = await client.query(itemQuery, [orderItemId, providerId]);

        if (itemResult.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('El pedido no se encontró, no te pertenece, o ya está activo.');
        }

        const { buyer_user_id, product_id, provider_id } = itemResult.rows[0];

        // 2. Activamos el item del pedido
        await client.query(
            `UPDATE order_items SET status = 'activo' WHERE id = $1`,
            [orderItemId]
        );

        // 3. Buscamos si ya existe un item de stock
        const stockCheckQuery = `
      SELECT id FROM product_stock_items WHERE order_item_id = $1
    `;
        const stockCheckResult = await client.query(stockCheckQuery, [orderItemId]);

        if (stockCheckResult.rows.length > 0) {
            // CASO "Activación": El item existe, solo actualizamos la fecha
            await client.query(
                `UPDATE product_stock_items
           SET activation_date = NOW()
           WHERE order_item_id = $1 AND activation_date IS NULL`,
                [orderItemId]
            );
        } else {
            // CASO "A Pedido": El item no existe, lo creamos
            await client.query(
                `INSERT INTO product_stock_items
           (product_id, provider_id, order_item_id, status, activation_date)
           VALUES
           ($1, $2, $3, 'vendida', NOW())`,
                [product_id, provider_id, orderItemId]
            );
        }

        await client.query('COMMIT');

        // 5. Enviamos la notificación
        if (buyer_user_id) {
            await createNotification(
                buyer_user_id,
                '¡Pedido Activado!',
                '¡Tu pedido ha sido activado! Ya puedes ver los datos de tu cuenta.',
                '/historial-pedidos'
            );
        }

        res.status(200).json({
            message: '¡Pedido activado con éxito! El cliente ha sido notificado.'
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al activar item:', err.stack);
        res.status(400).json({ error: err.message || 'Error interno al activar.' });
    } finally {
        client.release();
    }
});

// ---
// 10. RUTAS DE STOCK (PROVEEDOR)
// ---

// Obtener categorías permitidas
app.get('/api/provider/allowed-categories', authenticateToken, isProvider, async (req, res) => {
    const providerId = req.user.id;
    try {
        const query = `
      SELECT c.id, c.name
      FROM categories c
      JOIN provider_allowed_categories pac ON c.id = pac.category_id
      WHERE pac.provider_id = $1
      ORDER BY c.name;
    `;
        const result = await pool.query(query, [providerId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching allowed categories:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Obtener lista simple de productos
app.get('/api/provider/products-list', authenticateToken, isProvider, async (req, res) => {
    const providerId = req.user.id;

    try {
        const query = `
      SELECT id, name, status
      FROM products
      WHERE provider_id = $1
      ORDER BY name ASC;
    `;

        const result = await pool.query(query, [providerId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching provider products list:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Obtener el estado de un producto
app.get('/api/provider/product-status/:productId', authenticateToken, isProvider, async (req, res) => {
    const { productId } = req.params;
    const providerId = req.user.id;
    try {
        const query = 'SELECT status, name, stock_quantity FROM products WHERE id = $1 AND provider_id = $2';
        const result = await pool.query(query, [productId, providerId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching product status:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Actualizar el estado (tipo de venta) de un producto
app.put('/api/provider/product-status/:productId', authenticateToken, isProvider, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { productId } = req.params;
        const providerId = req.user.id;
        const { status, stock_quantity } = req.body;

        if (!status) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'El estado es requerido.' });
        }

        let finalStatus = status;
        let finalStockQty = stock_quantity || 0;

        if (status === 'stock') {
            const stockCheck = await client.query(
                'SELECT COUNT(*) FROM product_stock_items WHERE product_id = $1 AND status = $2',
                [productId, 'publicada']
            );
            const count = parseInt(stockCheck.rows[0].count, 10);
            finalStatus = count > 0 ? 'en stock' : 'agotado';
            finalStockQty = null;
        } else if (status === 'agotado' || status === 'inactivo') {
            finalStatus = 'agotado';
            finalStockQty = 0;
        }

        const query = `
      UPDATE products
      SET status = $1, stock_quantity = $2
      WHERE id = $3 AND provider_id = $4
      RETURNING *;
    `;
        const result = await client.query(query, [finalStatus, finalStockQty, productId, providerId]);

        await client.query('COMMIT');

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating product status:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// Obtener items de stock para UN producto
app.get('/api/provider/stock-items/:productId', authenticateToken, isProvider, async (req, res) => {
    const providerId = req.user.id;
    const { productId } = req.params;
    try {
        const query = `
      SELECT id, email, password, profile_name, pin, status, activation_date
      FROM product_stock_items
      WHERE provider_id = $1 AND product_id = $2
      ORDER BY created_at DESC;
    `;
        const result = await pool.query(query, [providerId, productId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching stock items:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Añadir NUEVOS items de stock (bulk)
app.post('/api/provider/stock-items', authenticateToken, isProvider, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const providerId = req.user.id;
        const { productId, items } = req.body;

        if (!productId || !items || !Array.isArray(items) || items.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Datos de stock inválidos.' });
        }

        const productResult = await client.query('SELECT id, status FROM products WHERE id = $1 AND provider_id = $2', [productId, providerId]);
        if (productResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Este producto no te pertenece.' });
        }

        const productStatus = productResult.rows[0].status;

        const queryText = `
      INSERT INTO product_stock_items (product_id, provider_id, email, password, profile_name, pin, status, activation_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

        for (const item of items) {
            await client.query(queryText, [
                productId,
                providerId,
                item.email || null,
                item.password || null,
                item.profile_name || null,
                item.pin || null,
                'publicada',
                null,
            ]);
        }

        if (productStatus === 'agotado' || productStatus === 'en stock') {
            await client.query(
                'UPDATE products SET status = $1 WHERE id = $2',
                ['en stock', productId]
            );
        } else if (productStatus === 'activacion') {
            const countQuery = 'SELECT COUNT(*) FROM product_stock_items WHERE product_id = $1 AND status = $2';
            const countResult = await client.query(countQuery, [productId, 'publicada']);
            const newStockCount = countResult.rows[0].count;
            await client.query(
                'UPDATE products SET stock_quantity = $1 WHERE id = $2',
                [newStockCount, productId]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: `${items.length} items de stock añadidos con éxito.` });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding stock items:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// Actualizar UN item de stock (para el modal de edición)
app.put('/api/provider/stock-items/:stockItemId', authenticateToken, isProvider, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { stockItemId } = req.params;
        const providerId = req.user.id;
        const { email, password, profile_name, pin } = req.body;

        // 1. Actualizar el item de stock verificando propiedad
        const updateQuery = `
      UPDATE product_stock_items
      SET email = $1, password = $2, profile_name = $3, pin = $4
      WHERE id = $5 AND provider_id = $6
      RETURNING order_item_id;
    `;
        const result = await client.query(updateQuery, [
            email || null,
            password || null,
            profile_name || null,
            pin || null,
            stockItemId,
            providerId
        ]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('Item no encontrado o no te pertenece.');
        }

        const { order_item_id } = result.rows[0];

        // 2. Encontrar al comprador para notificarle
        let buyerUserId = null;
        if (order_item_id) {
            const orderQuery = `
        SELECT o.user_id
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE oi.id = $1;
      `;
            const orderResult = await client.query(orderQuery, [order_item_id]);
            if (orderResult.rows.length > 0) {
                buyerUserId = orderResult.rows[0].user_id;
            }
        }

        await client.query('COMMIT');

        // 3. Enviar notificación (fuera de la transacción)
        if (buyerUserId) {
            await createNotification(
                buyerUserId,
                'Cuenta Actualizada',
                'Los datos de tu cuenta han sido actualizados por el proveedor.',
                '/historial-pedidos'
            );
        }

        res.status(200).json({ message: 'Item actualizado y cliente notificado.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error actualizando stock item:', err.stack);
        res.status(400).json({ error: err.message || 'Error interno al actualizar.' });
    } finally {
        client.release();
    }
});

// Eliminar UN item de stock
app.delete('/api/provider/stock-items/:stockItemId', authenticateToken, isProvider, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { stockItemId } = req.params;
        const providerId = req.user.id;

        const itemResult = await client.query('SELECT product_id FROM product_stock_items WHERE id = $1 AND provider_id = $2', [stockItemId, providerId]);
        if (itemResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Item no encontrado o no te pertenece.' });
        }
        const { product_id } = itemResult.rows[0];

        const productResult = await client.query('SELECT status FROM products WHERE id = $1', [product_id]);
        const productStatus = productResult.rows[0].status;

        const deleteQuery = `
      DELETE FROM product_stock_items
      WHERE id = $1 AND provider_id = $2 AND status = $3
      RETURNING *;
    `;
        const result = await client.query(deleteQuery, [stockItemId, providerId, 'publicada']);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Item no encontrado, no te pertenece, o ya fue vendido.' });
        }

        const stockCheck = await client.query(
            'SELECT COUNT(*) AS remaining_stock FROM product_stock_items WHERE product_id = $1 AND status = $2',
            [product_id, 'publicada']
        );
        const remaining_stock = parseInt(stockCheck.rows[0].remaining_stock, 10);

        if (productStatus === 'en stock' && remaining_stock === 0) {
            await client.query(
                'UPDATE products SET status = $1 WHERE id = $2',
                ['agotado', product_id]
            );
        } else if (productStatus === 'activacion') {
            await client.query(
                'UPDATE products SET stock_quantity = $1 WHERE id = $2',
                [remaining_stock, product_id]
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Item de stock eliminado.', remaining_stock });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting stock item:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// ---
// 11. RUTAS DE USUARIO (Recargas)
// ---

// Enviar una solicitud de recarga
app.post('/api/recharges/request', authenticateToken, isUser, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = req.user.id;
        const { amount_usd, payment_method, transaction_reference, proof_url } = req.body;

        if (!amount_usd || !payment_method || !transaction_reference) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Monto, método de pago y referencia son requeridos.' });
        }

        const newRequestQuery = `
      INSERT INTO recharge_requests (user_id, amount_usd, payment_method, transaction_reference, proof_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const result = await client.query(newRequestQuery, [userId, amount_usd, payment_method, transaction_reference, proof_url]);

        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating recharge request:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// Ver el historial de recargas del usuario
app.get('/api/recharges/history', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
      SELECT id, amount_usd, payment_method, transaction_reference, status, created_at, admin_notes
      FROM recharge_requests
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

        const result = await pool.query(query, [userId]);
        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching recharge history:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// ---
// 12. RUTAS DE ADMIN PARA GESTIONAR RECARGAS
// ---

// Ver todas las solicitudes PENDIENTES
app.get('/api/admin/recharges/pending', authenticateToken, isAdmin, async (req, res) => {
    try {
        const query = `
      SELECT rr.*, u.username
      FROM recharge_requests rr
      JOIN users u ON rr.user_id = u.id
      WHERE rr.status = 'pendiente'
      ORDER BY rr.created_at ASC;
    `;
        const result = await pool.query(query);
        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching pending recharges:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Aprobar o Rechazar una solicitud
app.put('/api/admin/recharges/:id', authenticateToken, isAdmin, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { status, admin_notes } = req.body;
        const adminId = req.user.id;

        if (!status || (status !== 'aprobado' && status !== 'rechazado')) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Estado no válido.' });
        }

        const requestQuery = 'SELECT * FROM recharge_requests WHERE id = $1 FOR UPDATE;';
        const requestResult = await client.query(requestQuery, [id]);

        if (requestResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }

        const request = requestResult.rows[0];

        if (request.status !== 'pendiente') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Esta solicitud ya ha sido procesada.' });
        }

        if (status === 'aprobado') {
            const updateBalanceQuery = `
        UPDATE user_profiles
        SET balance_usd = balance_usd + $1
        WHERE user_id = $2;
      `;
            await client.query(updateBalanceQuery, [request.amount_usd, request.user_id]);
        }

        const updateRequestQuery = `
      UPDATE recharge_requests
      SET status = $1, admin_notes = $2, reviewed_by = $3, reviewed_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
        const updatedResult = await client.query(updateRequestQuery, [status, admin_notes || null, adminId, id]);

        await client.query('COMMIT');
        res.json(updatedResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing recharge:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// ---
// 13. RUTAS DE PEDIDOS (CHECKOUT E HISTORIAL)
// ---

// Crear un pedido (Checkout)
app.post('/api/orders/checkout', authenticateToken, isUser, async (req, res) => {

    if (req.user.role === 'proveedor') {
        return res.status(403).json({ error: 'Los proveedores no pueden realizar compras. Por favor, usa una cuenta de usuario.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = req.user.id;
        const { cartItems, couponId } = req.body;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'El carrito está vacío.' });
        }

        // --- SEGURIDAD: Límite de 2 productos ---
        if (cartItems.length > 2) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Solo se permite un máximo de 2 productos por pedido.' });
        }

        let subtotal = 0;
        let calculatedTotal = 0;
        const productDetails = [];
        const providerEarnings = {};

        // Validar productos
        for (const item of cartItems) {
            const productQuery = `
        SELECT p.id, p.name, p.price_usd, p.offer_price_usd, p.status, p.stock_quantity,
               p.duration_days, p.has_renewal, p.renewal_price_usd,
               p.provider_id,
               u.username AS provider_name, u.phone_prefix, u.phone_number
        FROM products p
        LEFT JOIN users u ON p.provider_id = u.id
        WHERE p.id = $1 FOR UPDATE OF p;
      `;

            const productResult = await client.query(productQuery, [item.productId]);
            if (productResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: `Producto ${item.productId} no encontrado.` });
            }

            const product = productResult.rows[0];
            const price = parseFloat(product.offer_price_usd || product.price_usd);
            subtotal += price * item.quantity;
            productDetails.push({ ...item, ...product });
        }

        // Lógica de cupón
        calculatedTotal = subtotal;
        if (couponId) {
            const couponQuery = `
        SELECT * FROM coupons
        WHERE id = $1 AND is_active = TRUE AND current_uses < max_uses
        FOR UPDATE;
      `;
            const couponResult = await client.query(couponQuery, [couponId]);

            if (couponResult.rows.length > 0) {
                const coupon = couponResult.rows[0];
                const discountAmount = (subtotal * parseFloat(coupon.discount_percent)) / 100;
                calculatedTotal -= discountAmount;

                await client.query(
                    'UPDATE coupons SET current_uses = current_uses + 1 WHERE id = $1',
                    [couponId]
                );
            }
        }

        calculatedTotal = Math.max(0, calculatedTotal);

        // Tasa de cambio
        const TASA_DE_CAMBIO_USD_A_SOL = 3.75;
        const calculatedTotalSol = calculatedTotal * TASA_DE_CAMBIO_USD_A_SOL;

        // LÓGICA DE PUNTOS
        // 1. Verificar saldo Y OBTENER PUNTOS ACTUALES
        const profileResult = await client.query(
            'SELECT balance_usd, points_balance FROM user_profiles WHERE user_id = $1 FOR UPDATE',
            [userId]
        );

        const userBalance = parseFloat(profileResult.rows[0].balance_usd);
        const userPoints = parseInt(profileResult.rows[0].points_balance, 10) || 0;

        if (userBalance < calculatedTotal) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Saldo insuficiente para completar la compra.' });
        }

        // 2. Calcular puntos a añadir (10 por cada $1 gastado)
        const pointsToAdd = Math.floor(calculatedTotal * 10);

        // Crear pedido (Header)
        const orderQuery = `
      INSERT INTO orders (user_id, total_amount_usd, total_amount_sol, status, coupon_id)
      VALUES ($1, $2, $3, 'completado', $4)
      RETURNING id;
    `;
        const orderResult = await client.query(orderQuery, [
            userId,
            calculatedTotal,
            calculatedTotalSol,
            couponId || null
        ]);

        const newOrderId = orderResult.rows[0].id;

        // Procesar items y registrar ganancias
        for (const item of productDetails) {
            // Cálculo del precio bruto
            const pricePerUnit = parseFloat(item.offer_price_usd || item.price_usd);
            const grossEarning = pricePerUnit * item.quantity;

            const isInstantActivation = item.status === 'en stock';
            const newOrderItemStatus = isInstantActivation ? 'activo' : 'pendiente';

            const orderItemQuery = `
        INSERT INTO order_items (
          order_id, product_id, provider_id, quantity, price_per_unit_usd, status,
          customer_name, customer_phone,
          duration_days, has_renewal, renewal_price_usd, original_duration_days
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id;
      `;

            const orderItemResult = await client.query(orderItemQuery, [
                newOrderId, item.id, item.provider_id, item.quantity,
                pricePerUnit,
                newOrderItemStatus,
                item.customerName || null, item.customerPhone || null,
                item.duration_days, item.has_renewal, item.renewal_price_usd,
                item.duration_days
            ]);

            const newOrderItemId = orderItemResult.rows[0].id;

            // 3. Acreditar y loguear ganancias del proveedor (Precio BRUTO)

            // Log earnings_log
            await client.query(
                `INSERT INTO earnings_log (provider_id, order_item_id, amount_usd, net_amount, type, log_date)
            VALUES ($1, $2, $3, $4, $5, NOW())`,
                [item.provider_id, newOrderItemId, grossEarning, grossEarning, 'purchase_credit']
            );

            // Acumular ganancia para el proveedor
            providerEarnings[item.provider_id] = (providerEarnings[item.provider_id] || 0) + grossEarning;


            // Stock en stock
            if (item.status === 'en stock') {
                const stockItems = await client.query(
                    `SELECT id FROM product_stock_items WHERE product_id = $1 AND status = 'publicada' FOR UPDATE LIMIT $2`,
                    [item.id, item.quantity]
                );
                if (stockItems.rows.length < item.quantity) {
                    await client.query('ROLLBACK');
                    throw new Error(`Stock agotado para: ${item.name}`);
                }
                for (const stockItem of stockItems.rows) {
                    await client.query(
                        `UPDATE product_stock_items SET status = 'vendida', order_item_id = $1, sold_at = NOW(), activation_date = NOW() WHERE id = $2`,
                        [newOrderItemId, stockItem.id]
                    );
                }
                const remainingStock = await client.query(
                    `SELECT COUNT(*) FROM product_stock_items WHERE product_id = $1 AND status = $2`,
                    [item.id, 'publicada']
                );
                if (remainingStock.rows[0].count === '0') {
                    await client.query('UPDATE products SET status = $1 WHERE id = $2', ['agotado', item.id]);
                }
            } else if (item.status === 'a pedido' || item.status === 'activacion') {
                const stockUpdate = await client.query(
                    `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1 RETURNING stock_quantity`,
                    [item.quantity, item.id]
                );
                if (stockUpdate.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error(`Stock agotado para: ${item.name}`);
                }
                if (item.status === 'activacion') {
                    for (let i = 0; i < item.quantity; i++) {
                        await client.query(
                            `INSERT INTO product_stock_items (product_id, provider_id, status, order_item_id, activation_date)
             VALUES ($1, (SELECT provider_id FROM products WHERE id = $1), 'vendida', $2, NULL)`,
                            [item.id, newOrderItemId]
                        );
                    }
                }
            }
        } // Fin del loop de items

        // 4. Acreditar saldo a los proveedores
        for (const providerId in providerEarnings) {
            const totalEarning = providerEarnings[providerId];
            await client.query(
                'UPDATE user_profiles SET balance_usd = balance_usd + $1 WHERE user_id = $2',
                [totalEarning, providerId]
            );
        }

        // 5. Cobrar al usuario (Neto) y Añadir Puntos
        const newBalance = userBalance - calculatedTotal;
        const newPointsBalance = userPoints + pointsToAdd;

        await client.query(
            'UPDATE user_profiles SET balance_usd = $1, points_balance = $2 WHERE user_id = $3',
            [newBalance, newPointsBalance, userId]
        );

        // 6. Registrar la transacción de puntos
        if (pointsToAdd > 0) {
            await client.query(
                `INSERT INTO point_transactions (user_id, points_changed, type, related_order_id)
          VALUES ($1, $2, $3, $4)`,
                [userId, pointsToAdd, 'bono_compra', newOrderId]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: '¡Compra realizada con éxito!',
            orderId: newOrderId,
            newBalance,
            newPointsBalance
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error en checkout:', err.stack);
        res.status(400).json({ error: err.message || 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});


// Historial de pedidos del usuario
app.get('/api/orders/history', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
      SELECT
        o.id,
        o.total_amount_usd,
        o.status,
        o.created_at,
        (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC;
    `;

        const result = await pool.query(query, [userId]);
        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching order history:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// Detalle de UN pedido
app.get('/api/orders/:orderId', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.params;

    try {
        const orderQuery = `SELECT o.* FROM orders o WHERE o.id = $1 AND o.user_id = $2;`;
        const orderResult = await pool.query(orderQuery, [orderId, userId]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }

        const itemsQuery = `
      SELECT
        oi.id AS order_item_id, oi.product_id, oi.quantity, oi.price_per_unit_usd,
        oi.status, oi.customer_name, oi.customer_phone, oi.duration_days,
        oi.has_renewal, oi.renewal_price_usd,

        COALESCE(oi.original_duration_days, p.duration_days) AS original_duration_days,

        p.name AS product_name, p.image_url, p.status AS product_type,
        psi.id AS stock_item_id, psi.email, psi.password, psi.profile_name, psi.pin,
        psi.activation_date, psi.status AS item_status,
        u.username AS provider_name, u.phone_prefix, u.phone_number
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_stock_items psi ON psi.order_item_id = oi.id
      LEFT JOIN users u ON oi.provider_id = u.id
      WHERE oi.order_id = $1;
    `;
        const itemsResult = await pool.query(itemsQuery, [orderId]);

        res.json({
            order: orderResult.rows[0],
            items: itemsResult.rows.map(item => ({
                ...item,
                provider_phone: item.phone_prefix && item.phone_number ? `${item.phone_prefix}${item.phone_number}` : 'N/A',
                end_date: item.activation_date && item.duration_days
                    ? new Date(new Date(item.activation_date).getTime() + item.duration_days * 24 * 60 * 60 * 1000).toISOString()
                    : null,
            })),
        });

    } catch (err) {
        console.error('Error fetching order details:', err.stack);
        res.status(500).json({ error: 'Error interno.' });
    }
});


// ---
// 13.5 RUTA DE RENOVACIÓN
// ---
// RUTA DE RENOVACIÓN
app.post('/api/orders/renew/:orderItemId', authenticateToken, isUser, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { orderItemId } = req.params;
        const userId = req.user.id;

        // 1. Consultar datos
        const itemQuery = `
      SELECT
        oi.id, oi.duration_days, oi.renewal_price_usd, oi.has_renewal, oi.status,
        oi.provider_id, o.user_id,
        COALESCE(oi.original_duration_days, p.duration_days) AS days_to_add
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE oi.id = $1 FOR UPDATE
    `;
        const itemResult = await client.query(itemQuery, [orderItemId]);

        if (itemResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }

        const item = itemResult.rows[0];

        // Validaciones
        if (item.user_id !== userId) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'No autorizado.' });
        }
        if (item.status !== 'activo') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Solo puedes renovar servicios activos.' });
        }
        if (!item.has_renewal) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Este producto no admite renovación.' });
        }

        const renewalPrice = parseFloat(item.renewal_price_usd);
        const daysToAdd = parseInt(item.days_to_add);

        if (!daysToAdd || daysToAdd <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Error: Duración del producto no definida.' });
        }

        // 2. Verificar saldo
        const userBalQuery = 'SELECT balance_usd FROM user_profiles WHERE user_id = $1 FOR UPDATE';
        const userBalRes = await client.query(userBalQuery, [userId]);
        const userBalance = parseFloat(userBalRes.rows[0].balance_usd);

        if (userBalance < renewalPrice) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Saldo insuficiente.' });
        }

        // 3. Lógica de Renovación (Sumar días)
        const newDuration = item.duration_days + daysToAdd;

        // 4. Transacciones Económicas
        await client.query('UPDATE user_profiles SET balance_usd = balance_usd - $1 WHERE user_id = $2', [renewalPrice, userId]);
        await client.query('UPDATE user_profiles SET balance_usd = balance_usd + $1 WHERE user_id = $2', [renewalPrice, item.provider_id]);

        // 5. Actualizar item
        await client.query('UPDATE order_items SET duration_days = $1 WHERE id = $2', [newDuration, orderItemId]);

        // 6. Logs
        // Transacción Usuario
        await client.query(
            `INSERT INTO transactions (user_id, amount_usd, type, status, reference_id) VALUES ($1, $2, 'renovacion', 'completado', $3)`,
            [userId, -renewalPrice, `Renovación Item #${orderItemId}`]
        );

        // Transacción Proveedor
        await client.query(
            `INSERT INTO transactions (user_id, amount_usd, type, status, reference_id) VALUES ($1, $2, 'venta_renovacion', 'completado', $3)`,
            [item.provider_id, renewalPrice, `Cliente renovó Item #${orderItemId}`]
        );

        // Log de Ganancias
        await client.query(
            `INSERT INTO earnings_log (provider_id, order_item_id, amount_usd, net_amount, type, log_date)
            VALUES ($1, $2, $3, $3, 'renewal_credit', NOW())`,
            [item.provider_id, orderItemId, renewalPrice]
        );

        await client.query('COMMIT');

        res.json({
            message: 'Renovación exitosa.',
            newBalance: userBalance - renewalPrice,
            newDuration: newDuration
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error en renovación:', err.stack);
        res.status(500).json({ error: 'Error interno.' });
    } finally {
        client.release();
    }
});

// ---
// 13.6 RUTA DE ACTIVACIÓN (ADMIN)
// ---
app.post('/api/orders/item/activate/:orderItemId', authenticateToken, isAdmin, async (req, res) => {
    const { orderItemId } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Activar el order_item
        const itemUpdate = await client.query(
            `UPDATE order_items
        SET status = 'activo'
        WHERE id = $1 AND status = 'pendiente'
        RETURNING id;`,
            [orderItemId]
        );

        if (itemUpdate.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('El item no se encontró o ya estaba activo.');
        }

        // 2. Activar el/los product_stock_item(s) asociados (si existen)
        await client.query(
            `UPDATE product_stock_items
        SET activation_date = NOW()
        WHERE order_item_id = $1 AND activation_date IS NULL;`,
            [orderItemId]
        );

        await client.query('COMMIT');
        res.status(200).json({ message: 'Item activado con éxito. Los días han comenzado a correr.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al activar item:', err.stack);
        res.status(400).json({ error: err.message || 'Error interno al activar.' });

    } finally {
        client.release();
    }
});

// ---
// 13.7 RUTAS DE NOTIFICACIONES
// ---

// Obtener mis notificaciones (y el conteo de no leídas)
app.get('/api/notifications', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    try {
        // Obtenemos las últimas 20 notificaciones
        const notificationsQuery = `
      SELECT id, title, message, link_url, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20;
    `;
        const notificationsResult = await pool.query(notificationsQuery, [userId]);

        // Obtenemos el conteo de no leídas
        const countQuery = `
      SELECT COUNT(*) AS unread_count
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE;
    `;
        const countResult = await pool.query(countQuery, [userId]);

        res.json({
            notifications: notificationsResult.rows,
            unreadCount: parseInt(countResult.rows[0].unread_count, 10)
        });

    } catch (err) {
        console.error('Error fetching notifications:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Marcar notificaciones como leídas
app.post('/api/notifications/mark-read', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const updateQuery = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE
      RETURNING id;
    `;
        const result = await pool.query(updateQuery, [userId]);

        res.status(200).json({
            message: 'Notificaciones marcadas como leídas.',
            markedAsReadCount: result.rows.length
        });

    } catch (err) {
        console.error('Error marking notifications as read:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ---
// 13.8 RUTAS DE GESTIÓN DE PROVEEDORES (ADMIN)
// ---

// Obtener la configuración de todos los proveedores
app.get('/api/admin/provider-settings', authenticateToken, isAdmin, async (req, res) => {
    try {
        // 1. Obtener todos los proveedores y sus permisos
        const providersQuery = `
      SELECT u.id, u.username, u.status,
             COALESCE(ps.can_recharge, false) AS can_recharge,
             COALESCE(ps.can_affiliate, false) AS can_affiliate,
             COALESCE(ps.affiliate_limit, 0) AS affiliate_limit
      FROM users u
      LEFT JOIN provider_settings ps ON u.id = ps.provider_id
      WHERE u.role = 'proveedor'
      ORDER BY u.username;
    `;
        const providersResult = await pool.query(providersQuery);

        // 2. Obtener todas las categorías disponibles
        const categoriesResult = await pool.query('SELECT id, name FROM categories ORDER BY name');

        // 3. Obtener las categorías permitidas
        const allowedCatsResult = await pool.query('SELECT provider_id, category_id FROM provider_allowed_categories');

        const allowedCatsMap = {};
        for (const row of allowedCatsResult.rows) {
            if (!allowedCatsMap[row.provider_id]) {
                allowedCatsMap[row.provider_id] = [];
            }
            allowedCatsMap[row.provider_id].push(row.category_id);
        }

        const providersData = providersResult.rows.map(provider => ({
            ...provider,
            allowed_category_ids: allowedCatsMap[provider.id] || []
        }));

        res.json({
            providers: providersData,
            all_categories: categoriesResult.rows
        });

    } catch (err) {
        console.error('Error fetching provider settings:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Actualizar la configuración de UN proveedor
app.put('/api/admin/provider-settings/:providerId', authenticateToken, isAdmin, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { providerId } = req.params;
        const { can_recharge, can_affiliate, allowed_category_ids, affiliate_limit } = req.body;

        if (typeof can_recharge !== 'boolean' || typeof can_affiliate !== 'boolean' || !Array.isArray(allowed_category_ids)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Formato de datos incorrecto.' });
        }

        const limitVal = affiliate_limit ? parseInt(affiliate_limit) : 0;

        // 1. Actualizar/Insertar en provider_settings (UPSERT CON LÍMITE)
        const upsertSettingsQuery = `
      INSERT INTO provider_settings (provider_id, can_recharge, can_affiliate, affiliate_limit)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (provider_id) DO UPDATE
      SET can_recharge = EXCLUDED.can_recharge,
          can_affiliate = EXCLUDED.can_affiliate,
          affiliate_limit = EXCLUDED.affiliate_limit;
    `;

        await client.query(upsertSettingsQuery, [providerId, can_recharge, can_affiliate, limitVal]);

        // 2. Borrar categorías antiguas
        await client.query('DELETE FROM provider_allowed_categories WHERE provider_id = $1', [providerId]);

        // 3. Insertar nuevas categorías
        if (allowed_category_ids.length > 0) {
            const values = allowed_category_ids.map((catId, index) => `($1, $${index + 2})`).join(', ');
            const params = [providerId, ...allowed_category_ids];

            const insertCategoriesQuery = `
        INSERT INTO provider_allowed_categories (provider_id, category_id)
        VALUES ${values};
      `;
            await client.query(insertCategoriesQuery, params);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Permisos y cupo actualizados con éxito.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating provider settings:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
});

// ---
// 13.9 RUTAS DE GESTIÓN DE PUNTOS (ADMIN)
// ---

// Obtener todos los premios canjeables
app.get('/api/admin/redeemable-items', authenticateToken, isAdmin, async (req, res) => {
    try {
        const query = `
      SELECT ri.*,
        (SELECT COUNT(*) FROM redeem_codes rc WHERE rc.redeem_item_id = ri.id AND rc.is_used = FALSE) AS available_codes
      FROM redeemable_items ri
      ORDER BY ri.points_cost ASC;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching redeemable items:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Crear un nuevo premio
app.post('/api/admin/redeemable-items', authenticateToken, isAdmin, async (req, res) => {
    const { name, description, image_url, points_cost, stock_quantity, is_active } = req.body;

    if (!name || !points_cost) {
        return res.status(400).json({ error: 'Nombre y Costo en Puntos son requeridos.' });
    }

    try {
        const query = `
      INSERT INTO redeemable_items (name, description, image_url, points_cost, stock_quantity, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const result = await pool.query(query, [
            name,
            description || null,
            image_url || null,
            parseInt(points_cost, 10),
            stock_quantity ? parseInt(stock_quantity, 10) : null,
            is_active || true
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating redeemable item:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Actualizar un premio
app.put('/api/admin/redeemable-items/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url, points_cost, stock_quantity, is_active } = req.body;

    if (!name || !points_cost) {
        return res.status(400).json({ error: 'Nombre y Costo en Puntos son requeridos.' });
    }

    try {
        const query = `
      UPDATE redeemable_items
      SET name = $1, description = $2, image_url = $3, points_cost = $4, stock_quantity = $5, is_active = $6
      WHERE id = $7
      RETURNING *;
    `;
        const result = await pool.query(query, [
            name,
            description || null,
            image_url || null,
            parseInt(points_cost, 10),
            stock_quantity ? parseInt(stock_quantity, 10) : null,
            is_active,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Premio no encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating redeemable item:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Eliminar un premio
app.delete('/api/admin/redeemable-items/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM redeemable_items WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Premio no encontrado.' });
        }
        res.json({ message: 'Premio eliminado con éxito.' });
    } catch (err) {
        console.error('Error deleting redeemable item:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Cargar stock (códigos/cuentas) a un premio
app.post('/api/admin/redeemable-items/:id/stock', authenticateToken, isAdmin, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { codes } = req.body;

        if (!codes || !Array.isArray(codes) || codes.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Lista de códigos inválida.' });
        }

        // 1. Insertar los códigos
        const insertQuery = `
      INSERT INTO redeem_codes (redeem_item_id, code_content)
      VALUES ($1, $2)
    `;
        for (const code of codes) {
            if (code.trim()) {
                await client.query(insertQuery, [id, code.trim()]);
            }
        }

        // 2. Actualizar el contador de stock en la tabla principal
        await client.query(`
      UPDATE redeemable_items
      SET stock_quantity = (SELECT COUNT(*) FROM redeem_codes WHERE redeem_item_id = $1 AND is_used = FALSE)
      WHERE id = $1
    `, [id]);

        await client.query('COMMIT');
        res.json({ message: 'Códigos agregados correctamente.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding redeem stock:', err.stack);
        res.status(500).json({ error: 'Error al agregar stock.' });
    } finally {
        client.release();
    }
});

// ---
// 13.10 RUTAS DE CANJE DE PUNTOS (USUARIO)
// ---

// Obtener la lista de premios para canjear (solo activos y con stock)
app.get('/api/redeem-items', authenticateToken, isUser, async (req, res) => {
    try {
        const query = `
      SELECT id, name, description, image_url, points_cost, stock_quantity
      FROM redeemable_items
      WHERE is_active = TRUE AND (stock_quantity > 0 OR stock_quantity IS NULL)
      ORDER BY points_cost ASC;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching redeem items for user:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Canjear un premio
app.post('/api/redeem-items/:itemId', authenticateToken, isUser, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { itemId } = req.params;
        const userId = req.user.id;


        // 1. Validar usuario y puntos (bloquea el perfil)
        const userResult = await client.query(
            'SELECT points_balance FROM user_profiles WHERE user_id = $1 FOR UPDATE',
            [userId]
        );
        const userPoints = parseInt(userResult.rows[0].points_balance, 10) || 0;

        // 2. Obtener el premio (bloquea el item principal)
        const itemResult = await client.query(
            'SELECT * FROM redeemable_items WHERE id = $1 FOR UPDATE',
            [itemId]
        );
        if (itemResult.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('Premio no encontrado.');
        }
        const item = itemResult.rows[0];

        // 3. Validar
        if (userPoints < item.points_cost) {
            await client.query('ROLLBACK');
            throw new Error('Puntos insuficientes.');
        }
        if (!item.is_active) {
            await client.query('ROLLBACK');
            throw new Error('Premio no activo.');
        }

        // 4. Buscar Código o Cuenta (Lógica Instantánea)
        const codeResult = await client.query(`
      SELECT id, code_content
      FROM redeem_codes
      WHERE redeem_item_id = $1 AND is_used = FALSE
      LIMIT 1 FOR UPDATE SKIP LOCKED
    `, [itemId]);

        let deliveredContent = null;

        if (codeResult.rows.length > 0) {
            // A) HAY CÓDIGO: Se asigna al usuario
            const codeItem = codeResult.rows[0];
            deliveredContent = codeItem.code_content;

            await client.query(
                'UPDATE redeem_codes SET is_used = TRUE, used_by = $1, used_at = NOW() WHERE id = $2',
                [userId, codeItem.id]
            );
        } else {
            // B) NO HAY CÓDIGO: Revisamos si hay stock manual
            if (item.stock_quantity !== null) {
                if (item.stock_quantity <= 0) {
                    await client.query('ROLLBACK');
                    throw new Error('Stock agotado.');
                }
                deliveredContent = null;
            }
        }

        // 5. Actualizar contadores
        // 5a. Descontar stock en la tabla principal
        if (item.stock_quantity !== null) {
            await client.query(
                'UPDATE redeemable_items SET stock_quantity = stock_quantity - 1 WHERE id = $1',
                [itemId]
            );
        }

        // 5b. Descontar puntos al usuario
        const newPointsBalance = userPoints - item.points_cost;
        await client.query(
            'UPDATE user_profiles SET points_balance = $1 WHERE user_id = $2',
            [newPointsBalance, userId]
        );

        // 6. Registrar transacción
        const desc = deliveredContent
            ? `Canjeaste: ${item.name}. (Contenido entregado)`
            : `Canjeaste: ${item.name}. (Entrega Manual - Pendiente)`;

        await client.query(
            `INSERT INTO point_transactions (user_id, points_changed, type, description)
        VALUES ($1, $2, $3, $4)`,
            [userId, -item.points_cost, 'canje_premio', desc]
        );

        await client.query('COMMIT');

        // 7. Notificar y Responder
        if (deliveredContent) {
            await createNotification(
                userId,
                '¡Premio Listo!',
                `Has canjeado "${item.name}". Tu contenido es: ${deliveredContent}`,
                '/usuario/historial-puntos'
            );
        }

        res.json({
            message: deliveredContent
                ? '¡Canje exitoso! Tu contenido se muestra en la respuesta.'
                : '¡Canje exitoso! El administrador te contactará para la entrega manual.',
            newPointsBalance,
            deliveredContent
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al canjear premio:', err.stack);
        res.status(400).json({ error: err.message || 'Error interno al procesar el canje.' });
    } finally {
        client.release();
    }
});

// ---
// 13.11 RUTAS DE HISTORIAL DE PUNTOS (USUARIO)
// ---

app.get('/api/user/redemption-history', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `
      SELECT
        rc.used_at,
        rc.code_content,
        ri.name AS item_name,
        ri.points_cost
      FROM redeem_codes rc
      JOIN redeemable_items ri ON rc.redeem_item_id = ri.id
      WHERE rc.used_by = $1
      ORDER BY rc.used_at DESC;
    `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching redemption history:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ---
// 13.12 RUTAS DE REPORTES (ADMIN)
// ---

app.get('/api/admin/reports/summary', authenticateToken, isAdmin, async (req, res) => {
    const { start_date, end_date } = req.query;
    const params = [];
    let dateClauses = [];

    if (start_date) {
        params.push(start_date);
        dateClauses.push(`o.created_at >= $${params.length}`);
    }
    if (end_date) {
        params.push(end_date);
        dateClauses.push(`o.created_at <= $${params.length}::date + interval '1 day'`);
    }

    const filterString = dateClauses.length > 0 ? dateClauses.join(' AND ') : '1=1';

    try {
        // Calcular métricas principales
        const summaryQuery = `
          SELECT
              COALESCE(SUM(o.total_amount_usd), 0)::numeric(10, 2) AS total_revenue,
              COUNT(o.id) AS total_orders,
              COALESCE(AVG(o.total_amount_usd), 0)::numeric(10, 2) AS avg_order_value
          FROM orders o
          WHERE ${filterString};
        `;
        const summaryResult = await pool.query(summaryQuery, params);
        const summary = summaryResult.rows[0];

        // Calcular la venta promedio diaria (Daily Revenue)
        const dailyRevenueQuery = `
          SELECT COALESCE(
              SUM(o.total_amount_usd) / NULLIF(COUNT(DISTINCT o.created_at::date), 0),
              0
          )::numeric(10, 2) AS daily_revenue
          FROM orders o
          WHERE ${filterString} AND o.status = 'completado';
        `;
        const dailyRevenueResult = await pool.query(dailyRevenueQuery, params);

        res.json({
            ...summary,
            daily_revenue: dailyRevenueResult.rows[0].daily_revenue,
        });
    } catch (err) {
        console.error('Error fetching summary reports:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor al obtener métricas.' });
    }
});

app.get('/api/admin/reports/orders', authenticateToken, isAdmin, async (req, res) => {
    const { search, start_date, end_date, category_id, status } = req.query;
    const params = [];
    let whereClauses = [];

    // Construcción de filtros
    if (search) {
        params.push(`%${search}%`);
        whereClauses.push(`(o.id::text ILIKE $${params.length} OR u_user.username ILIKE $${params.length} OR p.name ILIKE $${params.length})`);
    }
    if (start_date) {
        params.push(start_date);
        whereClauses.push(`o.created_at >= $${params.length}`);
    }
    if (end_date) {
        params.push(end_date);
        whereClauses.push(`o.created_at <= $${params.length}::date + interval '1 day'`);
    }
    if (category_id) {
        params.push(category_id);
        whereClauses.push(`p.category_id = $${params.length}`);
    }
    if (status) {
        params.push(status);
        whereClauses.push(`o.status = $${params.length}`);
    }

    // Cláusula base para el WHERE
    const filterClause = whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '';


    // Query principal
    let query = `
          SELECT
              o.id,
              o.created_at,
              o.total_amount_usd,
              o.status,
              u_user.username,
              COUNT(oi.id) AS item_count,
              SUM(oi.price_per_unit_usd * oi.quantity) AS subtotal_bruto,
              c.code AS coupon_name
          FROM orders o
          JOIN users u_user ON o.user_id = u_user.id
          JOIN order_items oi ON o.id = oi.order_id
          LEFT JOIN coupons c ON o.coupon_id = c.id
          LEFT JOIN products p ON oi.product_id = p.id
          ${filterClause}
          GROUP BY o.id, u_user.username, c.code
          ORDER BY o.created_at DESC
          LIMIT 50;
        `;

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching detailed orders:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor al obtener pedidos.' });
    }
});

// --- 13.12 RUTAS DE CALIFICACIONES ---
// Obtener proveedores elegibles para calificar
app.get('/api/ratings/eligible', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `
              SELECT DISTINCT
                  u.id AS provider_id,
                  u.username AS provider_name,
                  CASE WHEN pr.id IS NOT NULL THEN TRUE ELSE FALSE END AS has_rated,
                  pr.rating AS user_rating,
                  pr.comment AS user_comment
              FROM order_items oi
              JOIN orders o ON oi.order_id = o.id
              JOIN users u ON oi.provider_id = u.id
              LEFT JOIN provider_ratings pr ON pr.provider_id = u.id AND pr.user_id = $1
              WHERE o.user_id = $1;
            `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching eligible providers:', err.stack);
        res.status(500).json({ error: 'Error al cargar proveedores.' });
    }
});

// Guardar calificación
app.post('/api/ratings', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    const { provider_id, rating, comment } = req.body;

    if (!provider_id || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Datos inválidos.' });
    }

    try {
        // Verificar elegibilidad (debe haber comprado)
        const eligibilityCheck = await pool.query(`
              SELECT 1 FROM order_items oi
              JOIN orders o ON oi.order_id = o.id
              WHERE o.user_id = $1 AND oi.provider_id = $2
              LIMIT 1
            `, [userId, provider_id]);

        if (eligibilityCheck.rows.length === 0) {
            return res.status(403).json({ error: 'No puedes calificar a este proveedor sin haberle comprado.' });
        }

        const insertQuery = `
              INSERT INTO provider_ratings (user_id, provider_id, rating, comment)
              VALUES ($1, $2, $3, $4)
              RETURNING *;
            `;
        const result = await pool.query(insertQuery, [userId, provider_id, rating, comment]);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya has calificado a este proveedor.' });
        }
        console.error('Error saving rating:', err.stack);
        res.status(500).json({ error: 'Error al guardar la calificación.' });
    }
});

// --- 13.13 RUTAS EXCLUSIVAS VIP (Ganancias) ---

// Obtener historial de ventas personales
app.get('/api/vip/ledger', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    const userTier = req.user.tier ? req.user.tier.toLowerCase() : 'usuario';

    // ⛔ RESTRICCIÓN: Solo VIP o Diamante
    if (userTier !== 'vip' && userTier !== 'diamante') {
        return res.status(403).json({ error: 'Acceso denegado. Función exclusiva para miembros VIP.' });
    }
    try {
        const result = await pool.query("SELECT * FROM user_sales_ledger WHERE user_id = $1 ORDER BY sale_date DESC", [userId]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error interno al cargar el historial.' });
    }
});

// Guardar una nueva venta personal
app.post('/api/vip/ledger', authenticateToken, isUser, async (req, res) => {
    const { item_name, cost_price, sale_price } = req.body;
    const userTier = req.user.tier ? req.user.tier.toLowerCase() : 'usuario';

    // ⛔ RESTRICCIÓN: Solo VIP o Diamante
    if (userTier !== 'vip' && userTier !== 'diamante') {
        return res.status(403).json({ error: 'Acceso denegado. Función exclusiva para miembros VIP.' });
    }
    if (!item_name || !cost_price || !sale_price) return res.status(400).json({ error: 'Datos incompletos.' });

    try {
        const result = await pool.query(
            "INSERT INTO user_sales_ledger (user_id, item_name, cost_price, sale_price) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, item_name, cost_price, sale_price]
        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al guardar.' });
    }
});

// Borrar una entrada
app.delete('/api/vip/ledger/:id', authenticateToken, isUser, async (req, res) => {
    try {
        const userTier = req.user.tier ? req.user.tier.toLowerCase() : 'usuario';
        if (userTier !== 'vip' && userTier !== 'diamante') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }
        await pool.query("DELETE FROM user_sales_ledger WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: 'Eliminado' });
    } catch (e) { res.status(500).json({ error: 'Error.' }); }
});

// --- 13.14 RUTAS EXCLUSIVAS DIAMANTE (Cupones) ---

app.get('/api/diamante/coupons', authenticateToken, isUser, async (req, res) => {
    const userTier = req.user.tier ? req.user.tier.toLowerCase() : 'usuario';

    // ⛔ RESTRICCIÓN: Solo Diamante
    if (userTier !== 'diamante') {
        return res.status(403).json({ error: 'Acceso denegado. Función exclusiva para miembros DIAMANTE.' });
    }
    try {
        // Traemos cupones que sean para diamante.
        const result = await pool.query(`
          SELECT * FROM coupons
          WHERE required_tier = 'Diamante'
          AND is_active = TRUE
          AND current_uses < max_uses
          ORDER BY discount_percent DESC
        `);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error interno al cargar cupones.' });
    }
});

// --- NUEVA RUTA: Obtener usuarios Diamante para el Select del Admin ---
app.get('/api/admin/users/diamond', authenticateToken, isAdmin, async (req, res) => {
    try {
        const query = `
      SELECT u.id, u.username, u.email
      FROM users u
      JOIN user_profiles up ON u.id = up.user_id
      WHERE up.account_tier = 'Diamante'
      ORDER BY u.username;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching diamond users:', err.stack);
        res.status(500).json({ error: 'Error interno.' });
    }
});

app.get('/api/provider/my-settings', authenticateToken, isProvider, async (req, res) => {
    try {
        const providerId = req.user.id;
        const query = 'SELECT can_recharge, can_affiliate, affiliate_limit FROM provider_settings WHERE provider_id = $1';
        const result = await pool.query(query, [providerId]);

        if (result.rows.length === 0) {
            return res.json({ can_recharge: false, can_affiliate: false, affiliate_limit: 0 });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error obteniendo ajustes:", err);
        res.status(500).json({ error: 'Error interno.' });
    }
});

// --- RUTA DE RECARGA (MODO TRANSFERENCIA: DEL SALDO DEL PROVEEDOR AL USUARIO) ---
app.post('/api/provider/recharge-user', authenticateToken, isProvider, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const providerId = req.user.id;
        const { userEmail, amount } = req.body;
        const amountNum = parseFloat(amount);

        if (!userEmail || !amountNum || amountNum <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Email y monto positivo requeridos.' });
        }

        // A. Permiso
        const permRes = await client.query('SELECT can_recharge FROM provider_settings WHERE provider_id = $1', [providerId]);
        if (permRes.rows.length === 0 || !permRes.rows[0].can_recharge) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'No tienes permiso para vender saldo.' });
        }

        // B. Saldo
        const balRes = await client.query('SELECT balance_usd FROM user_profiles WHERE user_id = $1 FOR UPDATE', [providerId]);
        const currentBalance = parseFloat(balRes.rows[0].balance_usd);

        if (currentBalance < amountNum) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: `Saldo insuficiente. Tienes $${currentBalance} y quieres enviar $${amountNum}.` });
        }

        // C. Usuario Destino
        const userRes = await client.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        const targetUserId = userRes.rows[0].id;

        if (targetUserId === providerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'No puedes autorecargarte.' });
        }

        // D. Transferencia
        await client.query('UPDATE user_profiles SET balance_usd = balance_usd - $1 WHERE user_id = $2', [amountNum, providerId]);
        await client.query('UPDATE user_profiles SET balance_usd = balance_usd + $1 WHERE user_id = $2', [amountNum, targetUserId]);

        // E. REGISTRAR TRANSACCIÓN
        // 1. Registro para el usuario que RECIBE
        await client.query(
            `INSERT INTO transactions (user_id, amount_usd, type, status, reference_id) VALUES ($1, $2, 'recarga_recibida', 'completado', $3)`,
            [targetUserId, amountNum, `Prov: ${req.user.username}`]
        );

        // 2. Registro para el proveedor que ENVÍA (Gasto negativo)
        await client.query(
            `INSERT INTO transactions (user_id, amount_usd, type, status, reference_id) VALUES ($1, $2, 'envio_saldo', 'completado', $3)`,
            [providerId, -amountNum, `A: ${userEmail}`]
        );

        await client.query('COMMIT');

        res.json({
            message: `¡Éxito! Enviaste $${amountNum} a ${userEmail}.`,
            remaining_balance: currentBalance - amountNum
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error en recarga:', err.stack);
        res.status(500).json({ error: 'Error del servidor.' });
    } finally {
        client.release();
    }
});

app.get('/api/provider/users-list', authenticateToken, isProvider, async (req, res) => {
    try {
        // Seleccionamos ID, Username y Email de usuarios que NO sean admin ni proveedores
        const query = `
          SELECT id, username, email, status
          FROM users
          WHERE role = 'usuario' AND status = 'activo'
          ORDER BY username ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error obteniendo usuarios:", err);
        res.status(500).json({ error: 'Error al cargar usuarios.' });
    }
});

// --- RUTA: Obtener historial de transferencias del proveedor ---
app.get('/api/provider/transfer-history', authenticateToken, isProvider, async (req, res) => {
    try {
        const providerId = req.user.id;
        const sentQuery = `
          SELECT id, amount_usd AS amount, reference_id, created_at, status
          FROM transactions
          WHERE user_id = $1 AND type = 'envio_saldo'
          ORDER BY created_at DESC
          LIMIT 50
        `;

        const result = await pool.query(sentQuery, [providerId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error obteniendo historial:", err);
        res.status(500).json({ error: 'Error al cargar historial.' });
    }
});

// --- 2. NUEVO: Obtener usuarios INACTIVOS (Para afiliar) ---
app.get('/api/provider/inactive-users', authenticateToken, isProvider, async (req, res) => {
    try {
        const query = `
          SELECT id, username, email, created_at
          FROM users
          WHERE role = 'usuario' AND status = 'inactivo'
          ORDER BY created_at DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching inactive users:", err);
        res.status(500).json({ error: 'Error al cargar usuarios.' });
    }
});

// --- 3. NUEVO: Activar Usuario (Gastar Cupo) ---
app.post('/api/provider/affiliate-user', authenticateToken, isProvider, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const providerId = req.user.id;
        const { userIdToActivate } = req.body;

        // A. Verificar Permiso y Cupo
        const settingsRes = await client.query(
            'SELECT can_affiliate, affiliate_limit FROM provider_settings WHERE provider_id = $1 FOR UPDATE',
            [providerId]
        );

        if (settingsRes.rows.length === 0 || !settingsRes.rows[0].can_affiliate) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'No tienes permiso para afiliar usuarios.' });
        }

        const currentLimit = settingsRes.rows[0].affiliate_limit || 0;

        // B. Si el cupo es 0 o menor, error
        if (currentLimit <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Has agotado tu cupo de afiliaciones.' });
        }

        // C. Verificar usuario destino
        const userRes = await client.query('SELECT status FROM users WHERE id = $1', [userIdToActivate]);
        if (userRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        if (userRes.rows[0].status === 'activo') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'El usuario ya está activo.' });
        }

        // D. Ejecutar la acción
        // 1. Activar usuario
        await client.query("UPDATE users SET status = 'activo' WHERE id = $1", [userIdToActivate]);

        // 2. Restar 1 al cupo
        await client.query("UPDATE provider_settings SET affiliate_limit = affiliate_limit - 1 WHERE provider_id = $1", [providerId]);

        // 3. (Opcional) Marcar quién lo refirió
        await client.query("UPDATE user_profiles SET referred_by_id = $1 WHERE user_id = $2", [providerId, userIdToActivate]);

        await client.query('COMMIT');

        res.json({
            message: `Usuario activado. Te quedan ${currentLimit - 1} cupos.`,
            remaining_limit: currentLimit - 1
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error afiliando:", err);
        res.status(500).json({ error: 'Error del servidor.' });
    } finally {
        client.release();
    }
});

// --- SISTEMA DE SOPORTE (USUARIO Y PROVEEDOR) ---

// 1. USUARIO: Reportar un problema
app.post('/api/orders/item/:id/report', authenticateToken, isUser, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const userId = req.user.id;

        // Verificar que el item pertenece al usuario
        const verifyQuery = `
      SELECT oi.id, oi.status
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.id = $1 AND o.user_id = $2
    `;
        const verifyResult = await client.query(verifyQuery, [id, userId]);

        if (verifyResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }

        const currentStatus = verifyResult.rows[0].status;
        if (currentStatus !== 'activo') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Solo puedes reportar problemas en pedidos activos.' });
        }

        // Cambiar estado a 'soporte'
        await client.query("UPDATE order_items SET status = 'soporte' WHERE id = $1", [id]);

        await client.query('COMMIT');
        res.json({ message: 'Pedido enviado a soporte. El proveedor ha sido notificado.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al reportar el problema.' });
    } finally {
        client.release();
    }
});

// 2. PROVEEDOR: Ver tickets de soporte
app.get('/api/provider/support-tickets', authenticateToken, isProvider, async (req, res) => {
    try {
        const providerId = req.user.id;

        const query = `
      SELECT
        oi.id,
        oi.product_id,
        oi.customer_name,
        oi.customer_phone,
        psi.email AS account_email,
        psi.password AS account_pass,
        psi.profile_name,
        psi.pin,
        psi.activation_date,
        oi.duration_days,
        p.name AS product_name,
        u.username AS buyer_name,
        u.email AS buyer_email
      FROM order_items oi
      LEFT JOIN product_stock_items psi ON psi.order_item_id = oi.id
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE oi.provider_id = $1 AND oi.status = 'soporte'
      ORDER BY oi.id DESC
    `;

        const result = await pool.query(query, [providerId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error en soporte:", err);
        res.status(500).json({ error: 'Error al cargar tickets.' });
    }
});

// 3. PROVEEDOR: Resolver Ticket
app.post('/api/provider/support-tickets/:id/resolve', authenticateToken, isProvider, async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    const providerId = req.user.id;

    try {
        // Verificar propiedad
        const verify = await pool.query("SELECT id FROM order_items WHERE id = $1 AND provider_id = $2", [id, providerId]);
        if (verify.rows.length === 0) return res.status(403).json({ error: 'No autorizado.' });

        let newStatus = '';
        if (action === 'restore') newStatus = 'activo';
        else if (action === 'cancel') newStatus = 'cancelado';
        else return res.status(400).json({ error: 'Acción inválida.' });

        await pool.query("UPDATE order_items SET status = $1 WHERE id = $2", [newStatus, id]);

        res.json({ message: `Ticket actualizado a: ${newStatus}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al resolver ticket.' });
    }
});

// --- Rutas de Stock (Asumidas públicas/temporales para simplificación) ---
// 1. Ruta para OBTENER el stock
app.get('/provider/stock-items/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await pool.query(
            `SELECT id, email, password, profile_name, pin, status
             FROM product_stock_items
             WHERE product_id = $1
             ORDER BY id DESC`,
            [productId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar stock' });
    }
});

// 2. Ruta para EDITAR un item
app.put('/provider/stock-items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, profile_name, pin } = req.body;

        await pool.query(
            `UPDATE product_stock_items
             SET email = $1, password = $2, profile_name = $3, pin = $4
             WHERE id = $5`,
            [email, password, profile_name, pin, id]
        );

        res.json({ message: 'Item actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar item' });
    }
});

// 3. Ruta para ELIMINAR un item
app.delete('/provider/stock-items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM product_stock_items WHERE id = $1', [id]);
        res.json({ message: 'Item eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar item' });
    }
});

// ---
// 13.15 RUTAS DE AFILIADOS (DASHBOARD)
// ---

// 1. Obtener Estadísticas del Afiliado (Genera código si no existe)
app.get('/api/affiliate/stats', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    try {
        // A. Obtener mi código de referido y saldo
        const result = await pool.query('SELECT referral_code, balance_usd FROM user_profiles WHERE user_id = $1', [userId]);
        let referralCode = profileRes.rows[0]?.referral_code;

        // Si el usuario no tiene código, generamos uno automáticamente (Ej: USER1234)
        if (!referralCode) {
            const userRes = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
            const usernamePrefix = userRes.rows[0].username.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            referralCode = `${usernamePrefix}${randomNum}`;

            // Guardamos el nuevo código en la DB
            await pool.query('UPDATE user_profiles SET referral_code = $1 WHERE user_id = $2', [referralCode, userId]);
        }

        // B. Contar cuántos usuarios ha referido
        const referralsCountQuery = `SELECT COUNT(*) AS total FROM user_profiles WHERE referred_by_id = $1`;
        const countRes = await pool.query(referralsCountQuery, [userId]);
        const totalReferrals = parseInt(countRes.rows[0].total);

        // C. Calcular ganancias estimadas (Ejemplo: 5% de las compras de tus referidos)
        const commissionQuery = `
          SELECT COALESCE(SUM(o.total_amount_usd), 0) AS total_sales
          FROM orders o
          JOIN user_profiles up ON o.user_id = up.user_id
          WHERE up.referred_by_id = $1 AND o.status = 'completado'
        `;
        const commRes = await pool.query(commissionQuery, [userId]);
        const totalSalesReferrals = parseFloat(commRes.rows[0].total_sales);
        const estimatedCommission = (totalSalesReferrals * 0.05).toFixed(2);

        res.json({
            referralCode,
            referralLink: `https://blackstreaming.com/register?ref=${referralCode}`,
            totalReferrals,
            activeReferrals: totalReferrals,
            totalEarnings: estimatedCommission,
            balance: profileRes.rows[0].balance_usd
        });

    } catch (err) {
        console.error("Error en affiliate stats:", err);
        res.status(500).json({ error: 'Error al cargar estadísticas de afiliado.' });
    }
});

// 2. Obtener Lista de Referidos
app.get('/api/affiliate/referrals', authenticateToken, isUser, async (req, res) => {
    const userId = req.user.id;
    try {
        // Buscamos usuarios cuyo 'referred_by_id' sea mi ID
        const query = `
          SELECT u.username, u.email, u.created_at, u.status,
                 (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id AND o.status = 'completado') as total_orders
          FROM users u
          JOIN user_profiles up ON u.id = up.user_id
          WHERE up.referred_by_id = $1
          ORDER BY u.created_at DESC
          LIMIT 50
        `;
        const result = await pool.query(query, [userId]);

        // Formateamos la respuesta
        const referrals = result.rows.map(r => ({
            username: r.username,
            email: r.email,
            date: r.created_at,
            status: r.status,
            orders: parseInt(r.total_orders),
            commission: (parseInt(r.total_orders) * 0.50).toFixed(2)
        }));

        res.json(referrals);
    } catch (err) {
        console.error("Error en affiliate referrals:", err);
        res.status(500).json({ error: 'Error al cargar referidos.' });
    }
});
// ---
// 14. Iniciar el servidor
// ---
app.listen(PORT, () => {
    console.log(`Servidor de API corriendo en http://localhost:${PORT}`);
});

export default app;
