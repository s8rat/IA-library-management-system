import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface User {
    id: string;
    role: string;
    username: string;
}

export const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Check authentication status from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const id = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (token && role && id && username) {
            setUser({ id, role, username });
        } else {
            setUser(null);
        }
    }, [location.pathname]); // Re-check auth when route changes

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setUser(null);
        navigate('/');
    };

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/explore", label: "Explore Books" },
        { to: "/plans", label: "Our Plans" },
    ];

    // Add role-specific links
    if (user?.role === 'Admin') {
        navLinks.push({ to: "/admin", label: "Admin Dashboard" });
    } else if (user?.role === 'Librarian') {
        navLinks.push({ to: "/library", label: "Library Dashboard" });
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-300 ${
            isScrolled ? 'bg-primary shadow-lg' : 'bg-primary'
        }`}>
            <div className="max-w-full mx-32 px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="h-full flex items-center gap-2 text-xl md:text-2xl transition-colors z-10 text-white hover:text-white font-poppins"
                    >
                        <img 
                            src="/Image/aalm-alkutub-logo.png" 
                            alt="logo" 
                            className="h-full relative after:content-[''] after:absolute after:top-0 after:right-[-8px] after:h-full after:w-[2px] after:bg-white"
                        />
                        <span className="hidden sm:inline font-extralight">Aalam Al-Kutub</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className={`${
                        isMenuOpen ? 'block' : 'hidden md:block'
                    } bg-white md:bg-transparent shadow-lg md:shadow-none mt-0`}>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-8 p-4 md:p-0">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`text-white hover:text-gray-500 font-poppins transition-colors py-2 md:py-0 ${
                                        location.pathname === link.to ? 'text-blue-600 font-medium' : ''
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <Link 
                                        to={`/auth/user/${user.id}`}
                                        className="mt-4 md:mt-0 px-6 py-2 bg-secondary text-white rounded-full shadow-lg hover:shadow-xl hover:text-gray-500 transition-all duration-300 text-center"
                                    >
                                        {user.username}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="mt-4 md:mt-0 px-6 py-2 bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-red-700 transition-all duration-300 text-center"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link 
                                    to="/auth/login" 
                                    className="mt-4 md:mt-0 px-6 py-2 bg-secondary text-white rounded-full shadow-lg hover:shadow-xl hover:text-gray-500 transition-all duration-300 text-center"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors z-10"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '✖' : '☰'}
                    </button>
                </div>
            </div>
        </nav>
    );
};