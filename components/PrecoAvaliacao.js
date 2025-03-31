import { useState, useEffect } from 'react';

const PrecoAvaliacao = ({ precoId, avaliacaoInicial = null }) => {
  const [avaliacao, setAvaliacao] = useState(avaliacaoInicial);
  const [enviando, setEnviando] = useState(false);
  const [votado, setVotado] = useState(false);
  const [contagem, setContagem] = useState({
    bom: 0,
    medio: 0,
    caro: 0
  });
  
  // Verifica se já votou anteriormente
  useEffect(() => {
    const verificarVoto = () => {
      const votos = JSON.parse(localStorage.getItem('precos_votos') || '{}');
      if (votos[precoId]) {
        setAvaliacao(votos[precoId]);
        setVotado(true);
      }
    };
    
    // Carregar contagem de votos (simulado)
    const carregarContagem = () => {
      // Em produção, isso seria uma chamada à API para obter os votos reais
      // Por enquanto, vamos simular com valores aleatórios
      const bomCount = Math.floor(Math.random() * 10);
      const medioCount = Math.floor(Math.random() * 8);
      const caroCount = Math.floor(Math.random() * 6);
      
      setContagem({
        bom: bomCount,
        medio: medioCount,
        caro: caroCount
      });
    };
    
    verificarVoto();
    carregarContagem();
  }, [precoId]);
  
  // Função para votar
  const votar = (novaAvaliacao) => {
    if (enviando || (votado && avaliacao === novaAvaliacao)) return;
    
    setEnviando(true);
    
    // Simulação do envio para API
    setTimeout(() => {
      // Atualizar localStorage
      const votos = JSON.parse(localStorage.getItem('precos_votos') || '{}');
      votos[precoId] = novaAvaliacao;
      localStorage.setItem('precos_votos', JSON.stringify(votos));
      
      // Atualizar UI
      setAvaliacao(novaAvaliacao);
      setVotado(true);
      
      // Atualizar contagem
      const novaContagem = {...contagem};
      
      // Se já votou antes, decrementar o voto anterior
      if (votado && avaliacao !== novaAvaliacao) {
        novaContagem[avaliacao] = Math.max(0, novaContagem[avaliacao] - 1);
      }
      
      // Incrementar novo voto
      novaContagem[novaAvaliacao]++;
      setContagem(novaContagem);
      
      setEnviando(false);
    }, 500);
  };
  
  // Cores baseadas na avaliação
  const getBadgeColor = (tipo) => {
    if (tipo === 'bom') return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    if (tipo === 'medio') return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
    if (tipo === 'caro') return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
    return '';
  };
  
  // Texto baseado na avaliação
  const getAvaliacaoTexto = (tipo) => {
    if (tipo === 'bom') return 'Preço Bom';
    if (tipo === 'medio') return 'Preço Médio';
    if (tipo === 'caro') return 'Preço Caro';
    return '';
  };
  
  // Ícone baseado na avaliação
  const getIcon = (tipo) => {
    if (tipo === 'bom') {
      return (
        <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (tipo === 'medio') {
      return (
        <svg className="w-4 h-4 mr-1 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-9a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm0-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (tipo === 'caro') {
      return (
        <svg className="w-4 h-4 mr-1 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-12.707a1 1 0 00-1.414 0L10 7.586l-2.293-2.293a1 1 0 00-1.414 1.414L8.586 9l-2.293 2.293a1 1 0 101.414 1.414L10 10.414l2.293 2.293a1 1 0 001.414-1.414L11.414 9l2.293-2.293a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return null;
  };
  
  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">O que você acha deste preço?</p>
      
      <div className="flex flex-wrap gap-2">
        {['bom', 'medio', 'caro'].map((tipo) => (
          <button
            key={tipo}
            onClick={() => votar(tipo)}
            disabled={enviando}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${getBadgeColor(tipo)} ${avaliacao === tipo ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : 'opacity-80 hover:opacity-100'}`}
          >
            {getIcon(tipo)}
            {getAvaliacaoTexto(tipo)}
            {contagem[tipo] > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white dark:bg-gray-700 bg-opacity-30 dark:bg-opacity-30 rounded-full text-xs">
                {contagem[tipo]}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {votado && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Obrigado pelo seu voto! Isso ajuda outros consumidores.
        </p>
      )}
    </div>
  );
};

export default PrecoAvaliacao;