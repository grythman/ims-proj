import { BellIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="ml-4 flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src="https://ui-avatars.com/api/?name=Admin+User"
              alt="User"
            />
            <span className="ml-2 text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 