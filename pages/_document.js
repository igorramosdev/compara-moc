import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Preconnect para melhorar performance */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL}
          crossOrigin="anonymous"
        />
        
        {/* Fonte padrão */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        {/* Preload de recursos críticos */}
        <link
          rel="preload"
          href="/icons/icon-192x192.png"
          as="image"
          type="image/png"
        />
      </Head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 theme-transition">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}