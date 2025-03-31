import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PrecoForm from '../components/PrecoForm';
import SkeletonLoader from '../components/SkeletonLoader';
import Link from 'next/link';
import { listarBairros, listarLojas, listarCidades } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function AdicionarPage({ bairros, lojas, cidades }) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simular um pequeno carregamento para mostrar os skeleton loaders
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Layout>
      <SEO 
        title="Adicionar Preço"
        description="Adicione um novo preço de produto em Montes Claros-MG e ajude outras pessoas a economizar. Sua contribuição é importante para a economia local."
        canonical="/adicionar"
        keywords="cadastro de preços, contribuição de preços, montes claros, minas gerais, economia local, colaboração preços"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Adicionar Preço - Preços Montes Claros",
          "description": "Adicione um novo preço de produto em Montes Claros-MG e ajude outras pessoas a economizar. Sua contribuição é importante para a economia local.",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL}/adicionar`,
          "isPartOf": {
            "@type": "WebSite",
            "name": "Preços Montes Claros",
            "url": process.env.NEXT_PUBLIC_SITE_URL
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", ".info-text"]
          },
          "potentialAction": {
            "@type": "CreateAction",
            "target": `${process.env.NEXT_PUBLIC_SITE_URL}/adicionar`,
            "description": "Cadastrar um novo preço de produto em Montes Claros"
          },
          "mainEntity": {
            "@type": "WebForm",
            "name": "Formulário de Cadastro de Preços",
            "description": "Formulário para adicionar preços de produtos em Montes Claros e região"
          }
        }}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Adicionar Novo Preço
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ajude a comunidade cadastrando preços que você encontrou em Montes Claros
          </p>
        </div>
        
        <Link href="/" passHref>
          <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mt-4 md:mt-0 transition-colors">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a lista
          </a>
        </Link>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-100 p-4 rounded-lg mb-6 theme-transition">
        <div className="flex items-start">
          <svg className="h-6 w-6 mr-3 text-blue-500 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium mb-1">Dicas para adicionar preços:</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-blue-700 dark:text-blue-300">
              <li>Informe o preço exato que você viu no estabelecimento</li>
              <li>Especifique bem o produto (marca, tamanho, modelo)</li>
              <li>Verifique se a loja e o bairro estão corretos</li>
              <li>Se possível, adicione preços recentes (até 7 dias)</li>
            </ul>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md theme-transition">
          <SkeletonLoader type="form" count={1} />
        </div>
      ) : (
        <PrecoForm bairros={bairros} lojas={lojas} cidades={cidades} />
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  // Busca bairros para o formulário
  const { data: bairros, error: bairrosError } = await listarBairros();
  
  // Busca lojas para o formulário
  const { data: lojas, error: lojasError } = await listarLojas();
  
  // Busca cidades para o formulário
  const { data: cidades, error: cidadesError } = await listarCidades();
  
  if (bairrosError || lojasError || cidadesError) {
    console.error('Erro ao buscar dados:', bairrosError || lojasError || cidadesError);
  }
  
  return {
    props: {
      bairros: bairros || [],
      lojas: lojas || [],
      cidades: cidades || [],
    },
  };
}