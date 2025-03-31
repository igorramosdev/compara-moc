import { useState, useEffect, useRef } from 'react';

const CategoriasFilter = ({ categorias, categoriaSelecionada, onChange }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);
  
  // Lista de emojis para categorias
  const emojis = {
    'combustivel': '⛽',
    'alimentos': '🍎',
    'bebidas': '🥤',
    'gas': '🔥',
    'higiene': '🧴',
    'limpeza': '🧹',
    'todos': '🏠'
  };
  
  // Fecha o menu quando clicado fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    }
    
    if (menuAberto) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAberto]);
  
  // Pega o emoji da categoria
  const getEmoji = (categoria) => {
    return emojis[categoria.toLowerCase()] || '📦';
  };
  
  // Formatar nome da categoria
  const formatarNomeCategoria = (categoria) => {
    if (categoria === 'todos') return 'Todas Categorias';
    return categoria.charAt(0).toUpperCase() + categoria.slice(1);
  };
  
  // Seleciona uma categoria e fecha o menu
  const selecionarCategoria = (categoria) => {
    onChange(categoria);
    setMenuAberto(false);
  };
  
  return (
    <div className="relative" ref={menuRef}>
      {/* Botão que abre o menu */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="flex items-center px-3 pr-10 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm theme-transition w-full"
        aria-expanded={menuAberto}
      >
        <span className="mr-1">{getEmoji(categoriaSelecionada)}</span>
        <span className="ml-1">{formatarNomeCategoria(categoriaSelecionada)}</span>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-500 dark:text-gray-300 transition-transform duration-200 ${menuAberto ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {/* Menu dropdown */}
      {menuAberto && (
        <div className="absolute z-20 mt-1 w-full rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 animate-scale-in-top origin-top theme-transition">
          <div className="py-1 max-h-60 overflow-auto" style={{ maxHeight: '250px' }}>
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => selecionarCategoria(categoria)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors ${
                  categoria === categoriaSelecionada
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <span className="mr-2">{getEmoji(categoria)}</span>
                {formatarNomeCategoria(categoria)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriasFilter;