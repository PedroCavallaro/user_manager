import "./App.css";
import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { UserDetails } from "./pages/user-details/user-details";
import { UsersList } from "./pages/users-list/users-list";
import { Providers } from "./providers/providers";
import { Layout } from "./routes/layout";
import { ProtectedRoute } from "./routes/protected-route";

export const ROUTES = {
	login: "/",
	register: "/cadastro",
	usersList: "/listagem",
	userDetails: (id = ":id") => `/detalhes/${id}`,
};

function App() {
	return (
		<Router>
			<Providers>
				<Routes>
					<Route path={ROUTES.login} element={<Login />} />
					<Route path={ROUTES.register} element={<Register />} />
					<Route element={<Layout />}>
						<Route path={ROUTES.userDetails()} element={<UserDetails />} />
						<Route
							path={ROUTES.usersList}
							element={
								<ProtectedRoute>
									<UsersList />
								</ProtectedRoute>
							}
						/>
					</Route>
				</Routes>
			</Providers>
		</Router>
	);
}

export default App;
