import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { BookDetail } from "../Pages/BookDetail";
import { Login } from "../Pages/auth/Login";
import { Register } from "../Pages/auth/Register";
import { ExploreBooks } from "../Pages/ExploreBooks";
import { Services } from "../Pages/Services";
import RootLayout from "../Pages/Layout";
import AuthLayout from "../Pages/auth/Layout";
import AdminDashboard from "../Pages/AdminDashboard";
import { Library } from "../Pages/Library";

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
            {
                path: "/library",
                element: <Library />,
            },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
        ],
    }
]);
