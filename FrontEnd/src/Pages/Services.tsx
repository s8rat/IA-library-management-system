import { Link } from 'react-router-dom';

export const Services = () => {
    return (
        <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Unlock Your Reading Journey!
                    </h1>
                    <h2 className="text-3xl md:text-4xl text-slate-700">
                        Membership Plans
                    </h2>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Standard Plan */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Standard Plan</h3>
                            <p className="text-slate-600 mb-6">For Passionate Readers!</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-bold text-slate-800">49</span>
                                <span className="text-3xl text-slate-400">.99</span>
                                <span className="ml-2 text-slate-600">EGP</span>
                            </div>
                            <div className="border-t border-gray-200 pt-6">
                                <div className="text-slate-600 mb-4">
                                    <p className="mb-4">you can borrow up to <span className="font-semibold">10 books per month</span></p>
                                    <p>and reserve study rooms for a focused reading or study experience.</p>
                                </div>
                                <p className="text-slate-600 mb-6">Plus, you'll receive priority registration for events.</p>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-2xl font-bold text-slate-800">499.99</span>
                                    <span className="ml-2 text-slate-600">EGP</span>
                                    <span className="ml-2 text-slate-600">Annual</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 pb-8">
                            <Link
                                to="/register"
                                className="block w-full text-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                            >
                                Select Plan
                            </Link>
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Premium Plan</h3>
                            <p className="text-slate-600 mb-6">Read Together, Grow Together!</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-bold text-slate-800">119</span>
                                <span className="text-3xl text-slate-400">.99</span>
                                <span className="ml-2 text-slate-600">EGP</span>
                            </div>
                            <div className="border-t border-gray-200 pt-6">
                                <div className="text-slate-600 mb-4">
                                    <p className="mb-4">This plan includes <span className="font-semibold">all Standard benefits</span> plus:</p>
                                    <ul className="space-y-2">
                                        <li>• unlimited book borrowing</li>
                                        <li>• exclusive entry to Nadi Al-Qurra'—our book club</li>
                                        <li>• one-on-one research support</li>
                                        <li>• discounts on workshops</li>
                                        <li>• free printing and workspace access</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-2xl font-bold text-slate-800">1199.99</span>
                                    <span className="ml-2 text-slate-600">EGP</span>
                                    <span className="ml-2 text-slate-600">Annual</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 pb-8">
                            <Link
                                to="/register"
                                className="block w-full text-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                            >
                                Select Plan
                            </Link>
                        </div>
                    </div>

                    {/* Family Plan */}
                    <div className="bg-gradient-to-br from-slate-800 to-emerald-600 rounded-2xl shadow-lg overflow-hidden text-white">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-2">Family Plan</h3>
                            <p className="text-gray-100 mb-6">Read Together, Grow Together!</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-bold">249</span>
                                <span className="text-3xl text-gray-300">.99</span>
                                <span className="ml-2">EGP</span>
                            </div>
                            <div className="border-t border-white/20 pt-6">
                                <div className="text-gray-100 mb-4">
                                    <p className="mb-4">This plan includes <span className="font-semibold">all Premium benefits</span> for up to:</p>
                                    <ul className="space-y-2">
                                        <li>• four family members</li>
                                        <li>• access to kids programs</li>
                                        <li>• unlimited book borrowing</li>
                                        <li>• early access to children's events</li>
                                        <li>• enjoy the library experience as a family</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-2xl font-bold">2499.99</span>
                                    <span className="ml-2">EGP</span>
                                    <span className="ml-2">Annual</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 pb-8">
                            <Link
                                to="/register"
                                className="block w-full text-center px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Select Plan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 