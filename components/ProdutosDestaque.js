import { useState, useEffect, useRef } from 'react';
import { formatarPreco, tempoRelativo } from '../utils/formatters';
import Link from 'next/link';
import SkeletonLoader from './SkeletonLoader';

// Função para identificar categoria do produto
const identificarCategoria = (nomeProduto) => {
  const lowerNome = nomeProduto.toLowerCase();
  
  if (lowerNome.includes('gasolina') || lowerNome.includes('álcool') || 
      lowerNome.includes('alcool') || lowerNome.includes('diesel') || 
      lowerNome.includes('combustível') || lowerNome.includes('combustivel') ||
      lowerNome.includes('gás') || lowerNome.includes('gas')) {
    return 'Combustível';
  }
  
  if (lowerNome.includes('arroz') || lowerNome.includes('feijão') || 
      lowerNome.includes('feijao') || lowerNome.includes('carne') || 
      lowerNome.includes('leite') || lowerNome.includes('pão') || 
      lowerNome.includes('pao') || lowerNome.includes('açúcar') || 
      lowerNome.includes('acucar') || lowerNome.includes('óleo') || 
      lowerNome.includes('oleo') || lowerNome.includes('café') ||
      lowerNome.includes('cafe') || lowerNome.includes('farinha')) {
    return 'Alimentos';
  }
  
  if (lowerNome.includes('sabonete') || lowerNome.includes('shampoo') || 
      lowerNome.includes('pasta') || lowerNome.includes('dental') || 
      lowerNome.includes('papel higiênico') || lowerNome.includes('papel higienico')) {
    return 'Higiene';
  }
  
  if (lowerNome.includes('detergente') || lowerNome.includes('sabão') || 
      lowerNome.includes('sabao') || lowerNome.includes('desinfetante')) {
    return 'Limpeza';
  }
  
  if (lowerNome.includes('água') || lowerNome.includes('agua') || 
      lowerNome.includes('refrigerante') || lowerNome.includes('suco')) {
    return 'Bebidas';
  }
  
  return 'Outros';
};

const ProdutosDestaque = ({ precos, isLoading = false }) => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const autoPlayRef = useRef(null);
  const scrollTimer = useRef(null);
  
  // Agrupar preços por produto e pegar o mais recente de cada
  const produtosComMenorPreco = precos
    .reduce((acc, preco) => {
      const grupo = acc.find(g => g.nome === preco.produto);
      
      if (!grupo) {
        // Produto ainda não está na lista
        acc.push({
          nome: preco.produto,
          preco: preco,
          menorPreco: preco.preco
        });
      } else if (preco.preco < grupo.menorPreco) {
        // Atualiza se for um preço menor
        grupo.preco = preco;
        grupo.menorPreco = preco.preco;
      }
      
      return acc;
    }, [])
    .sort((a, b) => a.menorPreco - b.menorPreco) // Ordena do menor pro maior preço
    .slice(0, 10); // Pega os 10 produtos com menores preços
  
  // Para responsividade, ajusta o número de itens por visualização com base no tamanho da tela
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;      // Mobile
      if (window.innerWidth < 1024) return 2;     // Tablet
      return 3;                                   // Desktop
    }
    return 3; // Fallback para SSR
  };

  const [itemsPerView, setItemsPerView] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Auto play do carrossel
  useEffect(() => {
    if (produtosComMenorPreco.length > itemsPerView && isAutoPlaying) {
      const handleAutoPlay = () => {
        if (isAutoPlaying && carouselRef.current) {
          const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
          
          // Se chegou ao final, volta para o início
          if (carouselRef.current.scrollLeft >= maxScrollLeft - 5) {
            carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Avança um item
            const cardWidth = carouselRef.current.scrollWidth / produtosComMenorPreco.length;
            carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }
      };
      
      autoPlayRef.current = setInterval(handleAutoPlay, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, produtosComMenorPreco.length, itemsPerView]);
  
  // Pausa o autoplay quando mouse entra no carrossel e retoma quando sai
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);
  
  // Funções para navegação por arrasto (mouse e toque)
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do scroll
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    // Programar retorno do autoplay após um breve período
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsAutoPlaying(true), 2000);
  };
  
  // Navegação por botões
  const scrollToNext = () => {
    if (!carouselRef.current) return;
    
    const cardWidth = carouselRef.current.scrollWidth / produtosComMenorPreco.length;
    carouselRef.current.scrollBy({ left: cardWidth * itemsPerView, behavior: 'smooth' });
    
    // Pausa o autoplay temporariamente
    setIsAutoPlaying(false);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsAutoPlaying(true), 2000);
  };
  
  const scrollToPrev = () => {
    if (!carouselRef.current) return;
    
    const cardWidth = carouselRef.current.scrollWidth / produtosComMenorPreco.length;
    carouselRef.current.scrollBy({ left: -(cardWidth * itemsPerView), behavior: 'smooth' });
    
    // Pausa o autoplay temporariamente
    setIsAutoPlaying(false);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsAutoPlaying(true), 2000);
  };
  
  // Determinando qual categoria um produto pertence com base no nome
  const getCategoriaIcon = (nome) => {
    const lowerNome = nome.toLowerCase();
    
    if (lowerNome.includes('gasolina') || lowerNome.includes('combustível') || lowerNome.includes('combustivel') || lowerNome.includes('álcool') || lowerNome.includes('alcool') || lowerNome.includes('diesel')) {
      return (
        <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-1 rounded">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </span>
      );
    }
    
    if (lowerNome.includes('arroz') || lowerNome.includes('feijão') || lowerNome.includes('feijao') || lowerNome.includes('carne') || lowerNome.includes('leite')) {
      return (
        <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-1 rounded">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </span>
      );
    }
    
    return (
      <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-1 rounded">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </span>
    );
  };
  
  // Se estiver carregando, mostra o skeleton loader
  if (isLoading) {
    return (
      <div className="relative mx-2 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex space-x-4 animate-pulse overflow-x-scroll scrollbar-hide pb-2">
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
  
  // Se não tiver produtos suficientes, mostra mensagem placeholder
  if (produtosComMenorPreco.length < 1) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md theme-transition">
        <div className="text-lg text-gray-700 dark:text-gray-300">
          Cadastre mais produtos para ver destaques aqui!
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Título da seção com estilo melhorado */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Produtos Mais Baratos
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <svg className="h-4 w-4 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Deslize para ver mais
        </span>
      </div>
      
      {/* Container do Carrossel com efeito de sombra nas laterais */}
      <div className="relative rounded-xl bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 shadow-md group">
        {/* Efeito de sombra na borda esquerda quando tem mais conteúdo à esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Efeito de sombra na borda direita quando tem mais conteúdo à direita */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none rounded-r-xl opacity-80"></div>
        
        {/* Carrossel com navegação por arrasto */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {produtosComMenorPreco.map(({ nome, preco }) => (
            <Link href={`/preco/${encodeURIComponent(nome.toLowerCase().replace(/\s+/g, '-'))}`} key={nome} passHref>
              <a className="flex-shrink-0 w-[280px] sm:w-[300px] mx-2 snap-start bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-100 dark:hover:border-blue-900 h-[180px]">
                <div className="relative p-4 flex flex-col h-full">
                  {/* Tag de categoria no canto superior */}
                  <div className="absolute -top-1 -right-1 bg-blue-500 dark:bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-md z-10">
                    {identificarCategoria(nome).toUpperCase()}
                  </div>
                  
                  <div className="flex items-start mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate flex-1 mr-2 text-base sm:text-lg">{nome}</h3>
                    <div className="mt-1">
                      {getCategoriaIcon(nome)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between mt-auto">
                    <div className="mb-2">
                      <div className="flex items-baseline">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">R$</span>
                        <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {parseFloat(preco.preco).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium truncate mt-1 flex items-center">
                        <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {preco.loja}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate max-w-[120px]">{preco.bairro}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {tempoRelativo(preco.data)}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
        
        {/* Botões de navegação */}
        {produtosComMenorPreco.length > itemsPerView && (
          <>
            <button 
              onClick={scrollToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 p-2 rounded-full shadow-md opacity-70 hover:opacity-100 focus:outline-none transition-all duration-300 z-20 transform hover:scale-110"
              aria-label="Anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={scrollToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 p-2 rounded-full shadow-md opacity-70 hover:opacity-100 focus:outline-none transition-all duration-300 z-20 transform hover:scale-110"
              aria-label="Próximo"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProdutosDestaque;