import { useAuthContext } from './AuthContext';

const useAuth = () => {
  const { user, setUser } = useAuthContext();
  return { user, setUser };
};

export default useAuth;
