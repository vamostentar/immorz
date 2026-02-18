import { fetchPublicAgents } from '@/api/agent-queries';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  showBack?: boolean;
  backLabel?: string;
}

export function Navbar({ showBack = false, backLabel }: NavbarProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasAgents, setHasAgents] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicAgents({ limit: 1 })
      .then(resp => {
        const agents = Array.isArray(resp) ? resp : (resp.data ?? []);
        setHasAgents(agents.length > 0);
      })
      .catch(() => setHasAgents(false));
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left zone: Back button and/or Logo */}
          <div className="flex items-center gap-4">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors group pr-4 border-r border-gray-200"
                type="button"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">{backLabel ?? t('navbar.back')}</span>
              </button>
            )}

            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img 
                src="/logo.svg" 
                alt="RibeiraZul" 
                className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Desktop Menu */}
          <div className="hidden md:flex items-center justify-end gap-8">
            <Link 
              to="/#imoveis" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              {t('navbar.properties')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
            {hasAgents && (
              <Link 
                to="/equipa" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {t('navbar.team')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
            <Link 
              to="/sobre" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              {t('navbar.about')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link 
              to="/faq" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              {t('navbar.faq')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link 
              to="/#contato" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              {t('navbar.contact')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
            <LanguageSwitcher />
            <Link 
              to="/admin/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {t('navbar.login')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>


        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-4 border-t border-gray-200 mt-4">
            <Link 
              to="/#imoveis" 
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navbar.properties')}
            </Link>
            {hasAgents && (
              <Link 
                to="/equipa" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navbar.team')}
              </Link>
            )}
            <Link 
              to="/sobre" 
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navbar.about')}
            </Link>
            <Link 
              to="/faq" 
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navbar.faq')}
            </Link>
            <Link 
              to="/#contato" 
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navbar.contact')}
            </Link>
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            <Link 
              to="/admin/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center block"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navbar.login')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
