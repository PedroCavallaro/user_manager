import { jwtDecode } from "jwt-decode";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../App";
import { api } from "../api";
import type { LoginDTO } from "../api/dto";
import { Role, type User } from "../api/dto/user";
import { safeDecode } from "../lib";

type IAuthContext = {
	login: (data: LoginDTO) => Promise<void>;
	refresh: () => Promise<void>;
	user?: User;
};

const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User>();

	const navigate = useNavigate();

	const isAuthRoute = [ROUTES.login, ROUTES.register];

	const getUserFromLocalStorage = useCallback(() => {
		const token = localStorage.getItem("token");

		const path = window.location.pathname;

		if (!token && isAuthRoute.includes(path)) {
			return;
		}

		const tokenData = safeDecode<User>(token!);

		if (!tokenData && !isAuthRoute.includes(path)) {
			return navigate(ROUTES.login);
		}

		const navigateTo =
			tokenData?.role === Role.ADMIN
				? ROUTES.usersList
				: ROUTES.userDetails(tokenData?.sub.toString());

		setUser(tokenData!);

		if (tokenData && isAuthRoute.includes(path)) {
			return navigate(navigateTo);
		}
	}, [navigate, setUser]);

	const refresh = useCallback(async () => {
		const res = await api.auth.refresh();

		const tokenData = safeDecode<User>(res.token);

		if (!tokenData) return;

		localStorage.setItem("token", res.token);
		localStorage.setItem("refresh", res.refresh);

		console.log(tokenData);
		setUser(tokenData);
	}, [setUser]);

	const login = useCallback(
		async (data: LoginDTO) => {
			const res = await api.auth.login(data);

			const tokenData = safeDecode<User>(res.token);

			if (!tokenData) return;

			localStorage.setItem("token", res.token);
			localStorage.setItem("refresh", res.refresh);

			const navigateTo =
				tokenData?.role === Role.ADMIN
					? ROUTES.usersList
					: ROUTES.userDetails(tokenData?.sub?.toString());

			setUser(tokenData);

			navigate(navigateTo);
		},
		[user, setUser, navigate],
	);

	useEffect(() => {
		getUserFromLocalStorage();
	}, [getUserFromLocalStorage]);

	return (
		<AuthContext.Provider
			value={{
				login,
				refresh,
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
