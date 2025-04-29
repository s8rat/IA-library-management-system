import { Outlet } from "react-router";
import { Navigation } from "../Components/Navigation";
// The <Outlet /> component is a placeholder that renders the child routes defined in the router configuration.
// It allows nested routes to display their components within the parent layout.
const RootLayout = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navigation />
                <main className="flex-1 pt-16 md:pt-20">
                    <Outlet />
                </main>
                <footer className="bg-white py-6 text-center text-gray-600 border-t border-gray-200">
                    <p>&copy; 2025 Aalam Al-Kutub. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
 
export default RootLayout;