import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PrecoCard from '../components/PrecoCard';
import ProdutosDestaque from '../components/ProdutosDestaque';
import CategoriasFilter from '../components/CategoriasFilter';
import SkeletonLoader from '../components/SkeletonLoader';
import Link from 'next/link';
import { buscarPrecosRecentes, listarBairros, listarCidades } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function Home({ precos, bairros, cidades }) {
  const [bairroSelecionado, setBairroSelecionado] = useState('todos');
  const [cidadeSelecionada, setCidadeSelecionada] = useState('todos');
  const [ordem, setOrdem] = useState('recentes');
  const [categoriasUnicas, setCategoriasUnicas] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  const [isLoading, setIsLoading] = useState(true);
  
  // Extrair categorias únicas dos produtos
  useEffect(() => {
    if (precos && precos.length > 0) {
      const categorias = ['Combustível', 'Alimentos', 'Higiene', 'Limpeza', 'Bebidas'];
      setCategoriasUnicas(categorias);
    }
    // O loading será controlado pelo getServerSideProps
  }, [precos]);
  
  // Controlar o estado de carregamento após a montagem do componente
  useEffect(() => {
    // Carregar preços
    setIsLoading(false);
  }, []);
  
  // Função para tentar identificar a categoria do produto com base no nome
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
        lowerNome.includes('cafe') || lowerNome.includes('farinha') ||
        lowerNome.includes('macarrão') || lowerNome.includes('macarrao')) {
      return 'Alimentos';
    }
    
    if (lowerNome.includes('sabonete') || lowerNome.includes('shampoo') || 
        lowerNome.includes('pasta') || lowerNome.includes('dental') || 
        lowerNome.includes('papel higiênico') || lowerNome.includes('papel higienico') ||
        lowerNome.includes('creme') || lowerNome.includes('desodorante') ||
        lowerNome.includes('absorvente') || lowerNome.includes('escova')) {
      return 'Higiene';
    }
    
    if (lowerNome.includes('detergente') || lowerNome.includes('sabão') || 
        lowerNome.includes('sabao') || lowerNome.includes('desinfetante') || 
        lowerNome.includes('água sanitária') || lowerNome.includes('agua sanitaria') ||
        lowerNome.includes('limpador') || lowerNome.includes('alvejante') ||
        lowerNome.includes('multiuso') || lowerNome.includes('vassoura')) {
      return 'Limpeza';
    }
    
    if (lowerNome.includes('água') || lowerNome.includes('agua') || 
        lowerNome.includes('refrigerante') || lowerNome.includes('suco') || 
        lowerNome.includes('cerveja') || lowerNome.includes('vinho') ||
        lowerNome.includes('bebida') || lowerNome.includes('chá') ||
        lowerNome.includes('cha') || lowerNome.includes('energético') ||
        lowerNome.includes('energetico')) {
      return 'Bebidas';
    }
    
    return 'Outros';
  };

  // Filtra preços pelo bairro, cidade e categoria selecionados
  const precosFiltrados = precos.filter(preco => {
    const passaBairro = bairroSelecionado === 'todos' || preco.bairro === bairroSelecionado;
    const passaCidade = cidadeSelecionada === 'todos' || preco.cidade === cidadeSelecionada;
    const passaCategoria = categoriaSelecionada === 'todas' || identificarCategoria(preco.produto) === categoriaSelecionada;
    return passaBairro && passaCidade && passaCategoria;
  });
  
  // Ordena os preços conforme selecionado
  const precosOrdenados = [...precosFiltrados].sort((a, b) => {
    if (ordem === 'recentes') {
      return new Date(b.data) - new Date(a.data);
    } else if (ordem === 'antigos') {
      return new Date(a.data) - new Date(b.data);
    } else if (ordem === 'menorPreco') {
      return a.preco - b.preco;
    } else if (ordem === 'maiorPreco') {
      return b.preco - a.preco;
    }
    return 0;
  });

  return (
    <Layout>
      <SEO 
        title="Preços em Montes Claros"
        description="Compare preços de produtos essenciais em Montes Claros-MG e economize no seu dia a dia. Gasolina, gás de cozinha, alimentos e mais atualizados pela comunidade local."
        keywords="preços Montes Claros, comparador de preços, economia MG, gasolina, supermercado, combustível, promoções, ofertas, gás de cozinha, alimentos, comparativo preços"
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Preços Montes Claros - Comparador de Preços",
          "url": process.env.NEXT_PUBLIC_SITE_URL,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${process.env.NEXT_PUBLIC_SITE_URL}/preco/{search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Compara Moc",
            "logo": {
              "@type": "ImageObject",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL}/icons/icon-512x512.png`
            }
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "BRL",
            "highPrice": Math.max(...precos.map(p => p.preco), 0),
            "lowPrice": Math.min(...precos.map(p => p.preco), 0),
            "offerCount": precos.length,
            "offers": precos.slice(0, 10).map(p => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": p.produto
              },
              "price": p.preco,
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "LocalBusiness",
                "name": p.loja,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": p.cidade,
                  "addressRegion": "MG"
                }
              }
            }))
          }
        }}
      >
        {/* JSON-LD para negócio local */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Compara Moc",
              "description": "Plataforma comunitária de comparação de preços em Montes Claros-MG",
              "url": process.env.NEXT_PUBLIC_SITE_URL,
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL}/icons/icon-512x512.png`,
              "image": `${process.env.NEXT_PUBLIC_SITE_URL}/icons/icon-512x512.png`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Montes Claros",
                "addressRegion": "MG",
                "addressCountry": "BR",
                "postalCode": "39400-000"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-16.7286",
                "longitude": "-43.8582"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
                  "Saturday", "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            })
          }}
        />
      </SEO>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-2xl shadow-lg mb-10 p-6 md:p-10 shine theme-transition">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight animate-fade-in">
            Preços em Montes Claros
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Encontre os melhores preços de produtos essenciais na cidade de Montes Claros e economize no seu dia a dia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/adicionar" passHref>
              <a className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-400 px-6 py-3 rounded-lg font-bold shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Cadastrar Novo Preço
              </a>
            </Link>
            <a href="#precos" className="bg-blue-500 bg-opacity-30 hover:bg-opacity-40 border border-white border-opacity-20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover-lift">
              Ver Preços Recentes
            </a>
          </div>
        </div>
      </div>
      
      {/* Produtos em Destaque */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Produtos em Destaque</h2>
          <div className="ml-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
            Melhores Preços
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-md p-6 theme-transition">
          <ProdutosDestaque precos={precos} isLoading={isLoading} />
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center card-scale theme-transition">
          <div className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide font-medium mb-1">Total de Preços</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{precos.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center card-scale theme-transition">
          <div className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide font-medium mb-1">Bairros Monitorados</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{bairros.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center card-scale theme-transition">
          <div className="text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide font-medium mb-1">Contribuidores</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {Math.min(precos.length, 15)}
          </p>
        </div>
      </div>
      
      {/* Filtros e ordenação */}
      <div id="precos" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 theme-transition">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Filtrar Resultados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Cidade
            </label>
            <div className="relative">
              <select 
                id="cidade" 
                value={cidadeSelecionada}
                onChange={(e) => setCidadeSelecionada(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm appearance-none"
              >
                <option value="todos">Todas as Cidades</option>
                {cidades?.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Bairro
            </label>
            <div className="relative">
              <select 
                id="bairro" 
                value={bairroSelecionado}
                onChange={(e) => setBairroSelecionado(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm appearance-none"
              >
                <option value="todos">Todos os Bairros</option>
                {bairros.map(bairro => (
                  <option key={bairro} value={bairro}>{bairro}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Categoria
            </label>
            <div className="relative">
              <CategoriasFilter 
                categorias={['todos', 'combustivel', 'alimentos', 'higiene', 'limpeza', 'bebidas']}
                categoriaSelecionada={categoriaSelecionada === 'todas' ? 'todos' : (
                  categoriaSelecionada === 'Combustível' ? 'combustivel' : 
                  categoriaSelecionada === 'Alimentos' ? 'alimentos' : 
                  categoriaSelecionada === 'Higiene' ? 'higiene' : 
                  categoriaSelecionada === 'Limpeza' ? 'limpeza' : 
                  categoriaSelecionada === 'Bebidas' ? 'bebidas' : 'todos'
                )}
                onChange={(categoria) => setCategoriaSelecionada(categoria === 'todos' ? 'todas' : (
                  categoria === 'combustivel' ? 'Combustível' : 
                  categoria === 'alimentos' ? 'Alimentos' : 
                  categoria === 'higiene' ? 'Higiene' : 
                  categoria === 'limpeza' ? 'Limpeza' : 
                  categoria === 'bebidas' ? 'Bebidas' : 'Outros'
                ))}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar por
            </label>
            <div className="relative">
              <select 
                id="ordem" 
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm appearance-none"
              >
                <option value="recentes">Mais Recentes</option>
                <option value="antigos">Mais Antigos</option>
                <option value="menorPreco">Menor Preço</option>
                <option value="maiorPreco">Maior Preço</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filtros ativos */}
        <div className="flex flex-wrap gap-2 mb-4">
          {cidadeSelecionada !== 'todos' && (
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <span className="mr-1">Cidade: {cidadeSelecionada}</span>
              <button 
                onClick={() => setCidadeSelecionada('todos')} 
                className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100 focus:outline-none"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {bairroSelecionado !== 'todos' && (
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <span className="mr-1">Bairro: {bairroSelecionado}</span>
              <button 
                onClick={() => setBairroSelecionado('todos')} 
                className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 focus:outline-none"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {categoriaSelecionada !== 'todas' && (
            <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <span className="mr-1">Categoria: {categoriaSelecionada}</span>
              <button 
                onClick={() => setCategoriaSelecionada('todas')} 
                className="text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 focus:outline-none"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span>{precosOrdenados.length} resultados encontrados</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Link href="/adicionar" passHref>
            <a className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center hover-lift">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Novo Preço
            </a>
          </Link>
        </div>
      </div>
      
      {/* Lista de preços */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <svg className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Últimos Preços Cadastrados
        </h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonLoader key={index} type="preco-card" count={1} />
          ))}
        </div>
      ) : precosOrdenados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {precosOrdenados.map(preco => (
            <PrecoCard key={preco.id} preco={preco} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center theme-transition">
          <svg className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">Nenhum preço encontrado</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Parece que ainda não há preços cadastrados com os filtros selecionados.</p>
          <Link href="/adicionar" passHref>
            <a className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white px-5 py-3 rounded-lg font-medium transition-colors inline-flex items-center hover-lift">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Seja o primeiro a adicionar
            </a>
          </Link>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  // Busca preços recentes
  const { data: precos, error: precosError } = await buscarPrecosRecentes(50);
  
  // Busca lista de bairros para filtro
  const { data: bairros, error: bairrosError } = await listarBairros();
  
  // Busca lista de cidades para filtro
  const { data: cidades, error: cidadesError } = await listarCidades();
  
  if (precosError || bairrosError || cidadesError) {
    console.error('Erro ao buscar dados:', precosError || bairrosError || cidadesError);
  }
  
  return {
    props: {
      precos: precos || [],
      bairros: bairros || [],
      cidades: cidades || [],
    },
  };
}