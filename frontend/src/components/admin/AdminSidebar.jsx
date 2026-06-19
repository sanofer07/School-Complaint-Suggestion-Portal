import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiClipboard, FiThumbsUp, FiUsers, FiLogOut, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/admin/complaints', label: 'Manage Complaints', icon: <FiClipboard /> },
  { to: '/admin/suggestions', label: 'Manage Suggestions', icon: <FiThumbsUp /> },
  { to: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
];

const AdminSidebar = ({ open, setOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setOpen(false)}></div>}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-gray-900 z-40 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">SP</div>
            <span className="font-bold text-white">Admin Panel</span>
          </div>
          <button className="lg:hidden text-xl text-gray-400" onClick={() => setOpen(false)}><FiX /></button>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm text-red-400 hover:bg-gray-800 mt-2">
            <FiLogOut className="text-lg" /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
