import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-extrabold text-primary-600">404</h1>
    <p className="text-gray-600 mt-2 mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Go Home</Link>
  </div>
);

export default NotFound;
