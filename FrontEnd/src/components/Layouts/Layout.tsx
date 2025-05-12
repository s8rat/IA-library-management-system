import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import Footer from "./Footer";


const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navigation />
            <main className="flex-1 min-h-0 flex flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;