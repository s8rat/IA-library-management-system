import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import { ExploreBooks } from './Pages/ExploreBooks';
import { BookDetail } from './Pages/BookDetail';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navigation />
                <main className="flex-1 pt-16 md:pt-20">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/explore" element={<ExploreBooks />} />
                        <Route path="/book/:id" element={<BookDetail />} />
                    </Routes>
                </main>
                <footer className="bg-white py-6 text-center text-gray-600 border-t border-gray-200">
                    <p>&copy; 2024 Aalam Al-Kutub. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;
