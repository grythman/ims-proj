import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout; 