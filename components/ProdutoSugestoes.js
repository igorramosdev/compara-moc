import { useState, useRef, useEffect } from 'react';
import { produtosComuns } from '../utils/bairrosData';

/**
 * Componente para sugestões de produtos comuns com pesquisa
 */
const ProdutoSugestoes = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const dropdownRef = useRef(null);
  
  // Lista de categorias únicas dos produtos
  const categorias = ['Todas', ...new Set(produtosComuns.map(p => p.categoria))];
  
  // Filtra produtos por categoria e texto de pesquisa
  const produtosFiltrados = produtosComuns
    .filter(p => categoriaAtiva === 'Todas' || p.categoria === categoriaAtiva)
    .filter(p => filtro === '' || p.nome.toLowerCase().includes(filtro.toLowerCase()))
    .slice(0, 15); // Limitar a 15 itens para mostrar mais opções sem sobrecarregar
  
  // Fecha o dropdown quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  function handleSelect(produto) {
    onSelect(produto.nome);
    setIsOpen(false);
    setFiltro('');
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mt-1 focus:outline-none transition-colors duration-200"
      >
        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Ver sugestões de produtos frequentes
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full max-w-md bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none theme-transition">
          <div className="p-3">
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Digite para filtrar..."
              className="form-input mb-2 py-1 text-sm w-full"
            />
            
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por Categoria:</div>
              <div className="flex flex-wrap gap-1 pb-2 border-b border-gray-200 dark:border-gray-700">
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setCategoriaAtiva(categoria)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                      categoriaAtiva === categoria
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>
            
            {produtosFiltrados.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {produtosFiltrados.map((produto, index) => (
                  <button
                    key={index}
                    type="button"
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => handleSelect(produto)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{produto.nome}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {produto.categoria}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                Nenhum produto encontrado com esse filtro.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdutoSugestoes;