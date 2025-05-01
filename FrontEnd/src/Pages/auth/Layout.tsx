import { Outlet } from "react-router";
import { Navigation } from "../../components/Navigation";
import Footer from "../../components/Footer";

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navigation />
            <main className="flex-1 flex pt-16 md:pt-20 min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
 
export default AuthLayout;