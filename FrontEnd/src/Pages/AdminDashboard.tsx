export const AdminDashboard = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Books</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Available Books</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Users</span>
                            <span className="font-semibold">0</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="text-gray-600">
                        No recent activity
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            Add New Book
                        </button>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            Manage Users
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            View Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 