import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { BookDetail } from "../Pages/BookDetail";
import Login from "../Pages/auth/Login";
import { ExploreBooks } from "../Pages/ExploreBooks";
import { Services } from "../Pages/Plans";
import RootLayout from "../Pages/Layout";
import AuthLayout from "../Pages/auth/Layout";
import AdminDashboard from "../Pages/AdminDashboard";
import { Library } from "../Pages/Library";
import UserProfile from "../Pages/auth/UserProfile";
import Register from "../Pages/auth/Register";

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
        path: "/plans",
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
      {
        path: "user/:id",
        element: <UserProfile />,
      },
    ],
  },
]);
