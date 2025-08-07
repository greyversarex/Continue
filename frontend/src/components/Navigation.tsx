import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { path: '/', label: t('navigation.home') },
    { path: '/tours', label: t('navigation.tours') },
    { path: '/admin', label: t('navigation.admin') }
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-blue-600">
              {t('header.title')}
            </h1>
          </Link>
          
          <div className="flex items-center space-x-6">
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
            
            <LanguageSwitcher />
          </div>
        </div>
        
        <div className="text-center pb-4">
          <p className="text-gray-600">
            {t('header.subtitle')}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navigation;