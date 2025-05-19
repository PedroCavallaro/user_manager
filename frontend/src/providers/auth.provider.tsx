import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../App';
import { api } from '../api';
import type { CreateAccountDTO, LoginDTO } from '../api/dto';
import { Role, type User } from '../api/dto/user';
import { tokenService } from '../services';
import { useToast } from './toast.provider';

interface IAuthContext {
  login: (data: LoginDTO) => Promise<void>;
  refresh: () => Promise<void>;
  register: (data: CreateAccountDTO) => Promise<void>;
  socialLogin: (token: string) => Promise<void>;
  user?: User;
  setUser: (user: User) => void;
}

const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isAuthRoute = useMemo(() => [ROUTES.login, ROUTES.register], []);

  console.log('asd');
  const getUserFromLocalStorage = useCallback(() => {
    const token = tokenService.getToken();

    const path = window.location.pathname;

    if (!token && isAuthRoute.includes(path)) {
      return;
    }

    const tokenData = tokenService.safeDecode<User>(token!);

    if (!tokenData && !isAuthRoute.includes(path)) {
      return navigate(ROUTES.login);
    }

    const navigateTo =
      tokenData?.role === Role.ADMIN ? ROUTES.usersList : ROUTES.userDetails;

    setUser(tokenData!);

    if (tokenData && isAuthRoute.includes(path)) {
      return navigate(navigateTo);
    }
  }, [navigate, setUser, isAuthRoute]);

  const refresh = useCallback(async () => {
    const { data, error } = await api.auth.refresh();

    if (error) return showToast(error);

    const tokenData = tokenService.safeDecode<User>(data.token);

    if (!tokenData) return;

    tokenService.setTokens(data.token, data.refresh);

    setUser(tokenData);
  }, [setUser, showToast]);

  const login = useCallback(
    async (loginDto: LoginDTO) => {
      const { data, error } = await api.auth.login(loginDto);

      if (error) return showToast(error);

      const tokenData = tokenService.safeDecode<User>(data.token);

      if (!tokenData) return;

      tokenService.setTokens(data.token, data.refresh);

      const navigateTo =
        tokenData?.role === Role.ADMIN ? ROUTES.usersList : ROUTES.userDetails;

      setUser(tokenData);

      navigate(navigateTo);
    },
    [setUser, navigate, showToast]
  );

  const socialLogin = useCallback(
    async (token: string) => {
      const { data, error } = await api.auth.socialLogin(token);

      if (error) return showToast(error);

      const tokenData = tokenService.safeDecode<User>(data.token);

      if (!tokenData) return;

      tokenService.setTokens(data.token, data.refresh);

      setUser(tokenData);

      navigate(ROUTES.userDetails);
    },
    [showToast, setUser, navigate]
  );

  const register = useCallback(
    async (createAccountDTO: CreateAccountDTO) => {
      const { error } = await api.auth.register(createAccountDTO);

      if (error) return showToast(error);

      navigate(ROUTES.login);
    },
    [navigate, showToast]
  );

  useEffect(() => {
    getUserFromLocalStorage();
  }, [getUserFromLocalStorage, showToast]);

  return (
    <AuthContext.Provider
      value={{
        login,
        setUser,
        register,
        refresh,
        socialLogin,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
