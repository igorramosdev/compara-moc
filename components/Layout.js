import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import BotaoFeedback from './BotaoFeedback';
import ThemeToggle from './ThemeToggle';
import { useEffect } from 'react';

const Layout = ({ children, title, description }) => {
  const pageTitle = title ? `${title} | Comparador de Preços` : 'Comparador de Preços de Montes Claros';
  const pageDescription = description || 'Compare preços de produtos essenciais em Montes Claros-MG. Gasolina, gás de cozinha, alimentos e mais.';

  // Script para tema escuro (precisa ser executado antes do primeiro render)
  useEffect(() => {
    // Verifica preferências salvas de tema
    const darkModeSetup = () => {
      if (
        localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    // Executa apenas no cliente
    darkModeSetup();
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50 theme-transition dark:bg-gray-900">
        <Header />
        <main className="flex-grow py-6 md:py-10 animate-fade-in">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
        <ThemeToggle />
        <BotaoFeedback />
        <Footer />
      </div>
    </>
  );
};

export default Layout;