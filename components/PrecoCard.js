import Link from 'next/link';
import { formatarPreco, formatarData, tempoRelativo } from '../utils/formatters';
import PrecoAvaliacao from './PrecoAvaliacao';

const PrecoCard = ({ preco }) => {
  if (!preco) return null;

  // Função para determinar cor do gradiente com base no nome do produto
  const getProductColorClass = (produtoNome) => {
    const produtoLower = produtoNome.toLowerCase();
    
    if (produtoLower.includes('gasolina')) return 'from-red-500 to-orange-500';
    if (produtoLower.includes('alcool') || produtoLower.includes('álcool')) return 'from-green-500 to-green-600';
    if (produtoLower.includes('diesel')) return 'from-yellow-500 to-amber-600';
    if (produtoLower.includes('gas') || produtoLower.includes('gás')) return 'from-blue-500 to-blue-600';
    if (produtoLower.includes('arroz')) return 'from-amber-400 to-yellow-500';
    if (produtoLower.includes('feijão') || produtoLower.includes('feijao')) return 'from-purple-500 to-purple-600';
    if (produtoLower.includes('carne')) return 'from-red-600 to-red-700';
    if (produtoLower.includes('leite')) return 'from-blue-300 to-blue-400';
    
    // Padrão para outros produtos
    return 'from-blue-500 to-blue-600';
  };

  // Tempo relativo para classes
  const getTimeClass = (date) => {
    const now = new Date();
    const dataPreco = new Date(date);
    const diffDays = Math.round((now - dataPreco) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'; // Hoje ou ontem
    if (diffDays <= 7) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'; // Essa semana
    if (diffDays <= 30) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'; // Esse mês
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'; // Mais antigo
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 theme-transition">
      <div className={`h-2 bg-gradient-to-r ${getProductColorClass(preco.produto)}`}></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Link href={`/preco/${preco.produto.toLowerCase().replace(/\s+/g, '-')}`} passHref>
              <a>{preco.produto}</a>
            </Link>
          </h3>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium">
            {preco.cidade || 'Montes Claros'}-{preco.estado || 'MG'}
          </span>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
            {formatarPreco(preco.preco)}
          </div>
          <div className={`ml-3 ${getTimeClass(preco.data)} text-xs px-2 py-1 rounded-full font-medium`}>
            {tempoRelativo(preco.data)}
          </div>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400 text-sm space-y-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-1.5 mr-3">
              <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{preco.loja}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">• {preco.bairro}</span>
            </div>
          </div>
        </div>
        
        {/* Sistema de avaliação */}
        <PrecoAvaliacao precoId={preco.id} />

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div>{formatarData(preco.data)}</div>
          <Link href={`/preco/${preco.produto.toLowerCase().replace(/\s+/g, '-')}`} passHref>
            <a className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
              Ver Histórico
              <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrecoCard;