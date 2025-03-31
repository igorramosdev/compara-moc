import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import PrecoCard from '../../components/PrecoCard';
import ShareButtons from '../../components/ShareButtons';
import SkeletonLoader from '../../components/SkeletonLoader';
import Link from 'next/link';
import { buscarPrecosProduto } from '../../lib/supabase';
import { getProdutoPorId, getProdutosSimilares } from '../../utils/produtos';
import { capitalizarPalavras } from '../../utils/formatters';
import { useEffect, useState } from 'react';

export default function ProdutoPage({ 
  precos = [], 
  produtoInfo, 
  produtosSimilares = []
}) {
  const router = useRouter();
  const [pageUrl, setPageUrl] = useState('');
  
  // Obtém a URL completa da página para compartilhamento
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, []);
  
  // Se a página ainda estiver sendo gerada, mostra um skeleton loader
  if (router.isFallback) {
    return (
      <Layout>
        <div className="mb-6">
          <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-10 w-2/3 rounded-md mb-2"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-5 w-1/3 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, index) => (
            <SkeletonLoader key={index} type="preco-card" count={1} />
          ))}
        </div>
        <div className="mb-6">
          <SkeletonLoader type="text" count={3} />
        </div>
      </Layout>
    );
  }
  
  // Nome formatado do produto para exibição
  const produtoNome = produtoInfo?.nome || 
    capitalizarPalavras(router.query.produto?.replace(/-/g, ' ') || '');
  
  // Schema.org para estruturação de dados
  const schemaOrgProduto = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": produtoNome,
    "description": `Preços de ${produtoNome} em Montes Claros-MG e região. Compare os melhores valores.`,
    "category": produtoInfo?.categoria || "Produtos em Montes Claros",
    "image": precos[0]?.imagem || `${process.env.NEXT_PUBLIC_SITE_URL}/icons/icon-512x512.png`,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "BRL",
      "highPrice": precos.length > 0 ? Math.max(...precos.map(p => p.preco)) : 0,
      "lowPrice": precos.length > 0 ? Math.min(...precos.map(p => p.preco)) : 0,
      "offerCount": precos.length,
      "offers": precos.map(preco => ({
        "@type": "Offer",
        "price": preco.preco,
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        "url": pageUrl,
        "seller": {
          "@type": "Organization",
          "name": preco.loja || "Estabelecimento em Montes Claros",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": preco.cidade || "Montes Claros",
            "addressRegion": preco.estado || "MG",
            "addressCountry": "BR"
          }
        }
      }))
    },
    "aggregateRating": precos.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": precos.length
    } : undefined
  };

  return (
    <Layout>
      <SEO 
        title={`Preço de ${produtoNome} em Montes Claros`}
        description={`Compare preços de ${produtoNome} em diferentes estabelecimentos de Montes Claros-MG.`}
        canonical={`/preco/${router.query.produto}`}
        ogType="product"
        jsonLd={schemaOrgProduto}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
            Preços de {produtoNome}
          </h1>
          <Link href="/">
            <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors mt-2">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para a lista
            </a>
          </Link>
        </div>
        
        <Link href="/adicionar">
          <a className="btn-primary flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Novo Preço
          </a>
        </Link>
      </div>
      
      {precos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {precos.map(preco => (
            <PrecoCard key={preco.id} preco={preco} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center mb-8 theme-transition">
          <svg className="h-16 w-16 text-neutral-400 dark:text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg text-neutral-700 dark:text-gray-300 mb-4">
            Nenhum preço encontrado para <span className="font-medium">{produtoNome}</span>. 
            Seja o primeiro a adicionar!
          </p>
          <Link href="/adicionar">
            <a className="btn-primary inline-flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Preço
            </a>
          </Link>
        </div>
      )}
      
      {/* Seção de compartilhamento */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 theme-transition">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
          Compartilhar Preços de {produtoNome}
        </h2>
        <p className="text-neutral-600 dark:text-gray-400 mb-3">
          Ajude outras pessoas a economizar compartilhando estes preços
        </p>
        <ShareButtons url={pageUrl} title={`Preços de ${produtoNome} em Montes Claros`} />
      </div>

      {produtosSimilares.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 theme-transition">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">Produtos Similares</h2>
          <div className="flex flex-wrap gap-2">
            {produtosSimilares.map(produto => (
              <Link key={produto.id} href={`/preco/${produto.id}`}>
                <a className="bg-neutral-100 hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-neutral-700 dark:text-gray-200 px-3 py-2 rounded-md text-sm transition-colors">
                  {produto.nome}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { produto } = params;
  
  // Busca preços deste produto
  const { data: precos, error: precosError } = await buscarPrecosProduto(produto);
  
  if (precosError) {
    console.error('Erro ao buscar preços do produto:', precosError);
  }
  
  // Busca informações do produto no catálogo
  const produtoInfo = getProdutoPorId(produto);
  
  // Busca produtos similares
  const produtosSimilares = getProdutosSimilares(produto);
  
  return {
    props: {
      precos: precos || [],
      produtoInfo: produtoInfo || null,
      produtosSimilares: produtosSimilares || [],
    },
  };
}