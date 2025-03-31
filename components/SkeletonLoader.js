import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

/**
 * Componente de carregamento tipo "esqueleto" para exibir durante o carregamento de dados
 * 
 * @param {Object} props
 * @param {String} props.type - Tipo de skeleton ('card', 'text', 'circle', 'table', 'list')
 * @param {Number} props.count - Número de itens a serem exibidos
 * @param {String} props.width - Largura do skeleton
 * @param {String} props.height - Altura do skeleton
 * @param {String} props.className - Classes adicionais
 */
const SkeletonLoader = ({ 
  type = 'text', 
  count = 1, 
  width, 
  height, 
  className = '' 
}) => {
  // Para garantir SSR, verificamos se o tema está montado
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Base CSS para animação de pulso
  const baseClass = 'animate-pulse rounded-md theme-transition';
  const themeClass = mounted && resolvedTheme === 'dark' 
    ? 'bg-gray-700' 
    : 'bg-gray-200';
  
  const getTypeStyles = () => {
    switch(type) {
      case 'card':
        return `${width || 'w-full'} ${height || 'h-40'}`;
      case 'text':
        return `${width || 'w-full'} ${height || 'h-4'}`;
      case 'circle':
        return `${width || 'w-10'} ${height || 'h-10'} rounded-full`;
      case 'table':
        return `${width || 'w-full'} ${height || 'h-8'}`;
      case 'list':
        return `${width || 'w-full'} ${height || 'h-8'}`;
      default:
        return `${width || 'w-full'} ${height || 'h-4'}`;
    }
  };
  
  const renderSkeleton = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(
        <div 
          key={i} 
          className={`${baseClass} ${themeClass} ${getTypeStyles()} ${className}`}
          style={{ 
            animationDelay: `${i * 0.05}s`,
            animationDuration: '1.5s',
          }}
          aria-hidden="true"
        />
      );
    }
    return items;
  };
  
  if (type === 'card-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 theme-transition overflow-hidden">
            <div className={`${baseClass} ${themeClass} h-5 w-3/4 mb-3`}></div>
            <div className={`${baseClass} ${themeClass} h-10 w-1/2 mb-3`}></div>
            <div className="flex justify-between items-center">
              <div className={`${baseClass} ${themeClass} h-4 w-1/3`}></div>
              <div className={`${baseClass} ${themeClass} h-4 w-1/4`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'table-row') {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="flex w-full space-x-2">
            <div className={`${baseClass} ${themeClass} h-8 w-1/4`}></div>
            <div className={`${baseClass} ${themeClass} h-8 w-1/4`}></div>
            <div className={`${baseClass} ${themeClass} h-8 w-1/4`}></div>
            <div className={`${baseClass} ${themeClass} h-8 w-1/4`}></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'preco-card') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 theme-transition overflow-hidden">
        <div className="flex justify-between items-start mb-3">
          <div className={`${baseClass} ${themeClass} h-5 w-3/4`}></div>
          <div className={`${baseClass} ${themeClass} h-6 w-6 rounded-full`}></div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className={`${baseClass} ${themeClass} h-8 w-20 mb-2`}></div>
            <div className={`${baseClass} ${themeClass} h-4 w-24`}></div>
          </div>
          <div className="text-right">
            <div className={`${baseClass} ${themeClass} h-4 w-16 mb-1`}></div>
            <div className={`${baseClass} ${themeClass} h-4 w-20`}></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'form') {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className={`${baseClass} ${themeClass} h-5 w-1/4 mb-2`}></div>
          <div className={`${baseClass} ${themeClass} h-10 w-full`}></div>
        </div>
        
        <div className="space-y-3">
          <div className={`${baseClass} ${themeClass} h-5 w-1/4 mb-2`}></div>
          <div className={`${baseClass} ${themeClass} h-10 w-full`}></div>
        </div>
        
        <div className="space-y-3">
          <div className={`${baseClass} ${themeClass} h-5 w-1/4 mb-2`}></div>
          <div className={`${baseClass} ${themeClass} h-10 w-full`}></div>
        </div>
        
        <div className="space-y-3">
          <div className={`${baseClass} ${themeClass} h-5 w-1/4 mb-2`}></div>
          <div className={`${baseClass} ${themeClass} h-10 w-full`}></div>
        </div>
        
        <div className="flex justify-end">
          <div className={`${baseClass} ${themeClass} h-12 w-40 rounded-lg`}></div>
        </div>
      </div>
    );
  }
  
  return <div className="space-y-2">{renderSkeleton()}</div>;
};

export default SkeletonLoader;