import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <ul>
        <li><Link to="/dashboard" className="block py-2">Dashboard</Link></li>
        <li><Link to="/chat" className="block py-2">Chat</Link></li>
        <li><Link to="/reports" className="block py-2">Reports</Link></li>
        <li><Link to="/internships" className="block py-2">Internships</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar; 