const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-white py-6 text-center text-gray-600 border-t border-gray-200">
            <p>&copy; {currentYear} Aalam Al-Kutub. All rights reserved.</p>
        </footer>
    );
}
 
export default Footer;