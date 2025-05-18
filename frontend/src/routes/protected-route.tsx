import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../App";
import { Role } from "../api/dto";
import { useAuth } from "../providers/auth.provider";

export function ProtectedRoute({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const { user } = useAuth();

	if (user?.role != Role.ADMIN) {
		navigate(ROUTES.userDetails(user?.sub?.toString()));

		return <></>;
	}

	return <>{children}</>;
}
