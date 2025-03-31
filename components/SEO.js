import Head from 'next/head';

/**
 * Componente SEO para otimização de indexação por motores de busca e suporte a PWA
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título da página
 * @param {string} props.description - Descrição da página
 * @param {string} props.canonical - Path canônico
 * @param {string} props.ogType - Tipo Open Graph (website, article, product)
 * @param {string} props.ogImage - URL da imagem Open Graph
 * @param {string} props.keywords - Palavras-chave para SEO
 * @param {Object} props.jsonLd - Dados estruturados para Schema.org
 * @param {React.ReactNode} props.children - Componentes filhos (para scripts adicionais)
 */
const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogType = 'website',
  ogImage,
  keywords = '',
  jsonLd,
  children 
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000';
  const pageTitle = title ? `${title} | Compara MoC` : 'Compara MoC - Compare preços em Montes Claros';
  const pageDescription = description || 'Compare preços de produtos essenciais em Montes Claros-MG e economize no seu dia a dia. Gasolina, gás de cozinha, alimentos e mais atualizados pela comunidade local.';
  const pageCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const pageOgImage = ogImage || `${siteUrl}/icons/icon-512x512.png`;
  const defaultKeywords = 'preços, comparação, Montes Claros, economia, gasolina, alimentos, supermercado, combustível, promoções, ofertas, economia local, melhores preços, preços Montes Claros, comparador de preços, economia MG';
  const pageKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;
  
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={pageCanonical} />
      
      {/* Viewport para responsividade */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Cor do tema para mobile */}
      <meta name="theme-color" content="#2563eb" />
      
      {/* Suporte PWA */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Compara MoC" />
      
      {/* Ícones para diferentes plataformas */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <link rel="mask-icon" href="/icons/icon-base.svg" color="#2563eb" />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:image" content={pageOgImage} />
      <meta property="og:site_name" content="Compara MoC" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageOgImage} />
      
      {/* Geo Tags para SEO local */}
      <meta name="geo.region" content="BR-MG" />
      <meta name="geo.placename" content="Montes Claros" />
      <meta name="geo.position" content="-16.7286;-43.8582" />
      <meta name="ICBM" content="-16.7286, -43.8582" />
      
      {/* Tags locais adicionais */}
      <meta name="language" content="pt-BR" />
      <meta property="business:contact_data:locality" content="Montes Claros" />
      <meta property="business:contact_data:region" content="MG" />
      <meta property="business:contact_data:country_name" content="Brasil" />
      <meta property="business:contact_data:postal_code" content="39400-000" />
      
      {/* JSON-LD Schema.org */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {children}
    </Head>
  );
};

export default SEO;