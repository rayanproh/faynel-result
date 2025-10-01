import React, { useState, useEffect, useCallback } from 'react';
import logo from '/src/logo.png';
import { useTranslation } from 'react-i18next';

export const WelcomePopup = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsShowing(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isShowing]);

  const handleClose = useCallback(() => {
    setIsShowing(false);
    const timer = setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isShowing ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(10, 5, 20, 0.6)' }}
      onClick={handleClose}
    >
      <div
        dir={i18n.dir()} // Added for right-to-left language support
        className={`bg-slate-900/80 backdrop-blur-xl border border-purple-800/50 rounded-2xl shadow-2xl shadow-purple-900/60 p-8 max-w-lg w-full text-center transform transition-all duration-300 ease-in-out ${isShowing ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center mb-6">
          <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-purple-500 to-blue-500">
            <img 
              src={logo} 
              alt="Website Logo" 
              className="w-16 h-16 rounded-full bg-slate-900 p-1"
            />
          </div>
        </div>
        <h2
          id="welcome-popup-title"
          className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 tracking-wide"
          style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
        >
          {t('welcome.title')}
        </h2>
        <p className="text-amber-400 mb-8 text-lg font-semibold tracking-wider">{t('welcome.madeBy')}</p> 
        <div className="text-slate-300/90 text-md space-y-3 mb-8 bg-slate-800/50 p-5 rounded-lg border border-slate-700/60 text-right">
            <p>{t('welcome.class')}</p>
            <p>{t('welcome.school')}</p>
        </div>
        <button
          onClick={handleClose}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
        >
          {t('welcome.close')}
        </button>
      </div>
    </div>
  );
};
