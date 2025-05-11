import { Outlet } from "react-router";
import { Navigation } from "../components/Layouts/Navigation";
import Footer from "../components/Layouts/Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-1 min-h-0 flex flex-col pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
