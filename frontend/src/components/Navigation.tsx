import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tours', label: 'Tours' },
    { path: '/admin', label: 'Admin' }
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-blue-600">
              Tajik Trails
            </h1>
          </Link>
          
          <nav className="flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="text-center pb-4">
          <p className="text-gray-600">
            Discover the Beauty of Tajikistan
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navigation;