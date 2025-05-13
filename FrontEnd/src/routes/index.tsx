import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { BookDetail } from "../Pages/BookDetail";
import Login from "../Pages/auth/Login";
import { ExploreBooks } from "../Pages/ExploreBooks";
import { Services } from "../Pages/Plans";
import RootLayout from "../Pages/Layout";
import AuthLayout from "../components/Layouts/Layout";
import AdminDashboard from "../Pages/AdminDashboard";
import { Librarian } from "../Pages/Librarian";
import UserProfile from "../Pages/UserProfile";
import Register from "../Pages/auth/Register";
import ChatePage from "../Pages/ChatePage";

// Optional: Simple error fallback
const ErrorFallback = () => (
  <div style={{ padding: "2rem", color: "red" }}>
    <h2>Something went wrong</h2>
    <p>Please try again later.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/explore", element: <ExploreBooks /> },
      { path: "/book/:id", element: <BookDetail /> },
      { path: "/plans", element: <Services /> },
      { path: "/admin", element: <AdminDashboard />, errorElement: <ErrorFallback /> },
      { path: "/librarian", element: <Librarian /> },
      { path: "/chat", element: <ChatePage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "user/:id", element: <UserProfile /> },
    ],
  },
]);
