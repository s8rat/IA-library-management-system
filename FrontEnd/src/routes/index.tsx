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