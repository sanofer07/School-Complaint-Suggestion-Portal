import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar open={open} setOpen={setOpen} />
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-2xl text-gray-600" onClick={() => setOpen(true)}><FiMenu /></button>
              <h1 className="font-bold text-lg text-gray-800">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
