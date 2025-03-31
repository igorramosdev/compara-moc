import { buscarPrecosRecentes, listarBairros, listarCidades } from '../lib/supabase';

const Sitemap = () => {
  return null;
};

export async function getServerSideProps({ res }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://precos-montes-claros.vercel.app';
  
  // Busca dados do banco para gerar URLs dinâmicas
  const { data: precos } = await buscarPrecosRecentes(100);
  const { data: bairros } = await listarBairros();
  const { data: cidades } = await listarCidades();
  
  // Conjunto para evitar produtos duplicados no sitemap
  const produtosUnicos = new Set();
  
  // Se tiver preços, adiciona cada produto único
  if (precos && precos.length > 0) {
    precos.forEach(preco => {
      const slug = preco.produto.toLowerCase().replace(/\s+/g, '-');
      produtosUnicos.add(slug);
    });
  }
  
  // Data atual para o campo lastmod
  const dataAtual = new Date().toISOString();
  
  // Criando o XML do sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Páginas Estáticas -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${dataAtual}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/adicionar</loc>
    <lastmod>${dataAtual}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Páginas Dinâmicas de Produtos -->
  ${Array.from(produtosUnicos).map(produto => `
  <url>
    <loc>${siteUrl}/preco/${produto}</loc>
    <lastmod>${dataAtual}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default Sitemap;