import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatarPreco, formatarData } from '../utils/formatters';
import SkeletonLoader from './SkeletonLoader';

const ProdutosDestaque = ({ precos, isLoading }) => {
  const [produtosComMenorPreco, setProdutosComMenorPreco] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const scrollTimer = useRef(null);
  const autoPlayTimer = useRef(null);

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1;

  // Busca produtos com menores preços em categorias diferentes
  useEffect(() => {
    if (precos && precos.length > 0) {
      // Agrupar por produto
      const produtosPorNome = precos.reduce((acc, curr) => {
        const nome = curr.produto.toLowerCase();
        if (!acc[nome]) {
          acc[nome] = [];
        }
        acc[nome].push(curr);
        return acc;
      }, {});

      // Para cada produto, encontrar o de menor preço
      const menoresPrecos = Object.values(produtosPorNome).map(grupo => {
        return grupo.reduce((menor, atual) => {
          return atual.preco < menor.preco ? atual : menor;
        });
      });

      // Pegar até 10 produtos distintos com menor preço
      const result = menoresPrecos
        .sort((a, b) => a.preco - b.preco)
        .slice(0, 10);

      setProdutosComMenorPreco(result);
    }
  }, [precos]);

  // Autoplay do carrossel
  useEffect(() => {
    if (isAutoPlaying && produtosComMenorPreco.length > itemsPerView) {
      autoPlayTimer.current = setInterval(() => {
        handleNextClick();
      }, 5000);
    }

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [isAutoPlaying, produtosComMenorPreco, itemsPerView]);

  const handleNextClick = () => {
    if (!carouselRef.current) return;

    const cardWidth = carouselRef.current.scrollWidth / produtosComMenorPreco.length;
    carouselRef.current.scrollBy({ left: cardWidth * itemsPerView, behavior: 'smooth' });

    // Atualiza o índice atual
    let newIndex = currentIndex + itemsPerView;
    if (newIndex >= produtosComMenorPreco.length) {
      newIndex = 0;
      // Se chegou ao final, volta para o início
      setTimeout(() => {
        carouselRef.current.scrollTo({ left: 0, behavior: 'auto' });
      }, 500);
    }
    setCurrentIndex(newIndex);

    // Pausa o autoplay temporariamente
    setIsAutoPlaying(false);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsAutoPlaying(true), 2000);
  };

  const handlePrevClick = () => {
    if (!carouselRef.current) return;

    const cardWidth = carouselRef.current.scrollWidth / produtosComMenorPreco.length;
    carouselRef.current.scrollBy({ left: -(cardWidth * itemsPerView), behavior: 'smooth' });

    // Atualiza o índice atual
    let newIndex = currentIndex - itemsPerView;
    if (newIndex < 0) {
      newIndex = produtosComMenorPreco.length - itemsPerView;
      // Se chegou ao início, volta para o final
      setTimeout(() => {
        carouselRef.current.scrollTo({ 
          left: carouselRef.current.scrollWidth, 
          behavior: 'auto' 
        });
      }, 500);
    }
    setCurrentIndex(newIndex);

    // Pausa o autoplay temporariamente
    setIsAutoPlaying(false);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsAutoPlaying(true), 2000);
  };

  // Se estiver carregando, mostra o skeleton loader
  if (isLoading) {
    return (
      <div className="relative mx-2 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[280px] h-[180px] bg-white dark:bg-gray-700 rounded-lg shadow">
              <div className="p-4 h-full flex flex-col">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-6"></div>
                <div className="mt-auto flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Se não houver produtos, mostra mensagem
  if (produtosComMenorPreco.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400">
          Nenhum produto em destaque disponível no momento.
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-2">
      {/* Carrossel */}
      <div 
        ref={carouselRef} 
        className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4"
      >
        {produtosComMenorPreco.map((produto, index) => (
          <div 
            key={produto.id} 
            className="flex-shrink-0 w-[280px] transform transition duration-500 ease-in-out hover:scale-105"
          >
            <Link href={`/preco/${produto.produto.replace(/\s+/g, '-').toLowerCase()}`}>
              <a className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full theme-transition">
                <div className="p-4 flex flex-col h-full">
                  <div className="mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                      Melhor Preço
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
                    {produto.produto}
                  </h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {formatarPreco(produto.preco)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {produto.loja} • {produto.bairro}
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatarData(produto.data)}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Ver detalhes
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      {produtosComMenorPreco.length > itemsPerView && (
        <>
          <button 
            onClick={handlePrevClick}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none z-10 theme-transition"
            aria-label="Anterior"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleNextClick}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none z-10 theme-transition"
            aria-label="Próximo"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores */}
      {produtosComMenorPreco.length > itemsPerView && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: Math.ceil(produtosComMenorPreco.length / itemsPerView) }).map((_, idx) => {
            const isActive = Math.floor(currentIndex / itemsPerView) === idx;
            return (
              <span 
                key={idx} 
                className={`h-2 rounded-full transition-all ${
                  isActive 
                    ? 'w-6 bg-blue-600 dark:bg-blue-500' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProdutosDestaque;