import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DashboardProvider } from '../../context/DashboardContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Users', href: '/dashboard/users', icon: '👥' },
    { name: 'Companies', href: '/dashboard/companies', icon: '🏢' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b">
              <h1 className="text-xl font-bold text-indigo-600">Your App Name</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-2 py-2 text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-2 text-red-600 rounded-md hover:bg-red-50"
              >
                <span className="mr-3">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top Navigation */}
          <div className="sticky top-0 z-10 bg-white md:hidden flex items-center justify-between p-4 border-b">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              ☰
            </button>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout; 