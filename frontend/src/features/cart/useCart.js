import { useCartContext } from './CartContext';

const useCart = () => {
  const { items, setItems } = useCartContext();

  const addItem = (item) => setItems((prev) => [...prev, item]);
  const clearCart = () => setItems([]);

  return { items, addItem, clearCart };
};

export default useCart;
