import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home";
import { BookDetail } from "../pages/BookDetail";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ExploreBooks } from "../pages/ExploreBooks";
import { Services } from "../pages/Services";
import RootLayout from "../pages/Layout";
import AuthLayout from "../pages/auth/Layout";
import AdminDashboard from "../pages/AdminDashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
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
                path: "/admin",
                element: <AdminDashboard />,
            },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    }
]);
