import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../Pages/Home';
import { BookDetail } from '../Pages/BookDetail';
import { Login } from '../Pages/Login';
import { Register } from '../Pages/Register';
import { ExploreBooks } from '../Pages/ExploreBooks';
import { Services } from '../Pages/Services';
import { Navigation } from '../components/Navigation';
import { Outlet } from 'react-router-dom';
import { AdminDashboard } from '../Pages/AdminDashboard';

export const router = createBrowserRouter([
    {
        path: '/',
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
                path: '/',
                element: <Home />
            },
            {
                path: '/explore',
                element: <ExploreBooks />
            },
            {
                path: '/book/:id',
                element: <BookDetail />
            },
            {
                path: '/services',
                element: <Services />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/admin',
                element: <AdminDashboard />
            }
        ]
    }
]); 