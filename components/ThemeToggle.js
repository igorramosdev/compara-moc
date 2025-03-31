import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Inicializa o tema baseado no localStorage ou preferência do sistema
  useEffect(() => {
    const darkModeFromLS = localStorage.theme === 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(
      darkModeFromLS || 
      (!('theme' in localStorage) && prefersDark)
    );
  }, []);
  
  // Atualiza o tema quando o estado mudar
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);
  
  // Gerencia o click para alternar tema
  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className={`fixed bottom-20 right-6 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg z-20 outline-none focus:outline-none border border-gray-200 dark:border-gray-700 hover-lift theme-transition ${isAnimating ? 'animate-pulse' : ''}`}
      aria-label={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {isDarkMode ? (
        // Ícone do sol (tema claro)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-yellow-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Ícone da lua (tema escuro)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-blue-700" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;