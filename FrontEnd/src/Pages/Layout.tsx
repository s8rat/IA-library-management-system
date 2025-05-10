import { Outlet } from "react-router";
import { Navigation } from "../Components/Layouts/Navigation";
import Footer from "../Components/Layouts/Footer";

const RootLayout = () => {
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

export default RootLayout;
