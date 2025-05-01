import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Navigation = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/explore", label: "Explore Books" },
        { to: "/services", label: "Our Services" },
    ];

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

                    {/* Navigation Links - Adaptive for both mobile and desktop */}
                    <div className={`absolute md:relative top-full md:top-auto left-0 md:left-auto right-0 md:right-auto 
                        ${isMenuOpen ? 'block' : 'hidden md:block'} 
                        bg-white md:bg-transparent shadow-lg md:shadow-none mt-0`}>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-8 p-4 md:p-0">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`text-white hover:text-gray-500  font-poppins transition-colors py-2 md:py-0 ${
                                        location.pathname === link.to ? 'text-blue-600 font-medium' : ''
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link 
                                to="/auth/login" 
                                className="mt-4 md:mt-0 px-6 py-2 bg-secondary text-white rounded-full shadow-lg hover:shadow-xl hover:text-gray-500 transition-all duration-300  text-center"
                            >
                                Login
                            </Link>
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