import { useEffect } from 'react';
import useAuth from '../features/auth/useAuth';
// import { useNavigate } from 'react-router-dom'; // cuando configures React Router

const useRequireAuth = () => {
  const { user } = useAuth();
  // const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // navigate('/login');
    }
  }, [user]);

  return user;
};

export default useRequireAuth;
