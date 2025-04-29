<<<<<<< HEAD
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
// import HomePage from "../pages";
// import AboutPage from "../pages/About";
// import ContactPage from "../pages/Contact";
// import RootLayout from "../pages/Layout";

import LoginPage from "../pages/auth/Login";
//import PostsPage from "../pages/Posts";
import ProtectedRoute from "../components/auth/ProtectedRoute";
//import ErrorRouteHandler from "../components/errors/ErrorHandler";
import PageNotFound from "../pages/PageNotFound";
import RegisterPage from "../Pages/RegisterPage";
import AuthLayout from "../Pages/auth/Layout";

const isLoggedIn = true;
const userData: { email: string } | null = isLoggedIn ? { email: "mohamedalsgher2004@gmail.com" } : null;

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Root layout */}
            {/* <Route path="/" element={<RootLayout />} errorElement={<ErrorRouteHandler />} > 
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="posts" element={
                    <ProtectedRoute isAllowed={isLoggedIn} redirectPath="/login" data={userData}>
                        <PostsPage />
                    </ProtectedRoute>} />
            </Route> */}

            {/* Auth layout */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={
                    <ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/posts" data={userData}>
                        <LoginPage />
                    </ProtectedRoute>
                } />
                <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* 404 page */}
            <Route path="*" element={<PageNotFound />} />
        </>
    )
);

export default router;
=======
import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { BookDetail } from "../Pages/BookDetail";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { ExploreBooks } from "../Pages/ExploreBooks";
import { Services } from "../Pages/Services";
import { Navigation } from "../components/Navigation";
import { Outlet } from "react-router-dom";
import { AdminDashboard } from "../Pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-1 pt-16 md:pt-20">
          <Outlet />
        </main>
        <footer className="bg-white py-6 text-center text-gray-600 border-t border-gray-200">
          <p>&copy; 2024 Aalam Al-Kutub. All rights reserved.</p>
        </footer>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/explore",
        element: <ExploreBooks />,
      },
      {
        path: "/book/:id",
        element: <BookDetail />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
    ],
  },
]);
>>>>>>> 87cb3faaeb7417acf5f41ebb8855f9fe40974aa0
