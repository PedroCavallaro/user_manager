import { Outlet } from "react-router-dom";
import { Header } from "../components/header";

export function Layout() {
	return (
		<main className="bg-black flex flex-col lg:gap-16  h-full">
			<Header />
			<Outlet />
		</main>
	);
}
