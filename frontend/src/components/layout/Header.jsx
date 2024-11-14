import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MyApp</h1>
        <nav>
          <Link to="/dashboard" className="mr-4">Dashboard</Link>
          <Link to="/profile" className="mr-4">Profile</Link>
          <Link to="/logout">Logout</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 