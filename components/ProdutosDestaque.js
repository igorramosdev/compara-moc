import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatarPreco, formatarData } from '../utils/formatters';

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
        <div className="flex space-x-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[280px]">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 theme-transition">
                <div className="space-y-4">
                  <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-4 w-4 animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
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
    <div className="relative mx-2 mb-6">
      {/* Carrossel */}
      <div 
        ref={carouselRef} 
        className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {produto.loja} • {produto.bairro}
                    </p>
                  </div>
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
    </div>
  );
};

export default ProdutosDestaque;