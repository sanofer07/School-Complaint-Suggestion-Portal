import React from 'react';

export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 ${sizes[size]}`}></div>
  );
};

export const FullPageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

export const Badge = ({ children, className = '' }) => (
  <span className={`badge ${className}`}>{children}</span>
);

export const EmptyState = ({ icon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="text-5xl mb-4 text-gray-300">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-gray-500 mt-1 max-w-sm">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
