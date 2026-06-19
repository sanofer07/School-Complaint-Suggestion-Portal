import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">SP</div>
            <span className="font-bold text-lg text-gray-800 hidden sm:block">School Portal</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 font-medium">About</Link>
            {user ? (
              <>
                <Link to={dashboardLink} className="text-gray-600 hover:text-primary-600 font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Student Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden text-2xl text-gray-700" onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)} className="text-gray-600 font-medium">Home</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="text-gray-600 font-medium">About</Link>
            {user ? (
              <>
                <Link to={dashboardLink} onClick={() => setOpen(false)} className="text-gray-600 font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary w-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-gray-600 font-medium">Student Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
