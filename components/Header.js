import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Efeito para detecção de scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <header className={`sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white shadow-lg transition-all duration-300 theme-transition ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <nav className="flex flex-col md:flex-row items-center justify-between">
          <Link href="/" passHref>
            <a className="flex items-center space-x-3 group">
              <div className="p-2 bg-white bg-opacity-20 dark:bg-opacity-10 rounded-lg transform transition-transform group-hover:scale-110">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-7 w-7" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Compara MoC</h1>
                <p className="text-xs text-blue-100 font-light">Montes Claros - MG</p>
              </div>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/" passHref>
              <a className="text-blue-100 hover:text-white font-medium transition-colors flex items-center hover-lift">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Início
              </a>
            </Link>
            
            {/* Seletor de Tema */}
            <ThemeToggle />
            
            <Link href="/adicionar" passHref>
              <a className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 px-5 py-2 rounded-md font-medium transition-all duration-200 transform hover:translate-y-[-2px] shadow-md flex items-center btn-pulse">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Cadastrar Preço
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;