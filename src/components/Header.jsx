import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, BookOpen, Atom, Lightbulb, MessageCircle, PlayCircle, Menu, X } from 'lucide-react'
import { ModeToggle } from "./mode-toggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import logo from '/src/logo.png';

const Header = ({ currentSection, onSectionChange }) => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'home', name: t('home'), icon: Globe },
    { id: 'explanation', name: t('explanation'), icon: BookOpen },
    { id: 'simulation', name: t('simulation'), icon: Atom },
    { id: 'facts', name: t('facts'), icon: Lightbulb },
    { id: 'tutor', name: t('tutor_nav'), icon: MessageCircle },
    { id: 'video', name: t('video_explanation'), icon: PlayCircle },
    { id: 'presentation', name: t('presentation'), icon: BookOpen }
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSectionChange('home')}
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
              <h1 className="text-2xl font-bold group-hover:text-yellow-300 transition-colors duration-300">{t('main_title')}</h1>
              <p className="text-sm text-purple-200 group-hover:text-purple-100 transition-colors duration-300">{t('subtitle')}</p>
            </div>
          </div>
         
          <div className='flex items-center gap-x-3'>
            <div className="hover:scale-110 transition-transform duration-300">
              <ModeToggle />
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 justify-center">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;
           
            return (
              <Button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  setMobileMenuOpen(false);
                }}
                variant={isActive ? "default" : "ghost"}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                  ${isActive
                    ? 'bg-white text-purple-900 shadow-lg scale-105 hover:shadow-xl hover:scale-110'
                    : 'text-white hover:bg-white/20 hover:scale-105 hover:shadow-md border border-white/20 hover:border-white/40'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {section.name}
                {isActive && (
                  <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-900">
                    •
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
     
      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
    </header>
  );
};

export default Header;