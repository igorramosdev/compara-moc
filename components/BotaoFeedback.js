import { useState, useRef, useEffect } from 'react';

function BotaoFeedback() {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState('sugestao');
  const [sucesso, setSucesso] = useState(false);
  const modalRef = useRef(null);
  
  // Tipos de feedback
  const tipos = [
    { id: 'sugestao', nome: 'Sugestão' },
    { id: 'erro', nome: 'Reportar Erro' },
    { id: 'preco', nome: 'Preço Incorreto' },
    { id: 'elogio', nome: 'Elogio' }
  ];
  
  // Fecha o modal quando clicado fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        fecharModal();
      }
    }
    
    if (aberto) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [aberto]);
  
  // Bloqueia o scroll quando o modal estiver aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [aberto]);
  
  // Fecha com ESC
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.keyCode === 27) {
        fecharModal();
      }
    }
    
    if (aberto) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aberto]);
  
  const abrirModal = () => {
    setAberto(true);
    setMensagem('');
    setSucesso(false);
  };
  
  const fecharModal = () => {
    if (enviando) return;
    setAberto(false);
    setTimeout(() => {
      setSucesso(false);
    }, 300);
  };
  
  const enviarFeedback = (e) => {
    e.preventDefault();
    
    if (!mensagem.trim()) return;
    
    setEnviando(true);
    
    // Simulação de envio para API
    setTimeout(() => {
      // Em produção, este seria um fetch para a API
      console.log('Feedback enviado:', { tipo, mensagem });
      
      setEnviando(false);
      setSucesso(true);
      setMensagem('');
      
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        fecharModal();
      }, 2000);
    }, 1000);
  };
  
  return (
    <>
      {/* Botão Flutuante */}
      <button 
        onClick={abrirModal}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Enviar feedback"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>
      
      {/* Modal de Feedback */}
      {aberto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div 
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full transform transition-all duration-300 ease-in-out theme-transition"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Envie seu feedback</h3>
                <button 
                  onClick={fecharModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                  disabled={enviando}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {sucesso ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg mb-4">
                    <svg className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">Feedback enviado com sucesso!</p>
                    <p className="text-sm mt-1">Obrigado por nos ajudar a melhorar.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={enviarFeedback}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de feedback
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {tipos.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTipo(item.id)}
                          className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                            tipo === item.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {item.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sua mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      rows="4"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Descreva seu feedback em detalhes..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white theme-transition"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={fecharModal}
                      className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      disabled={enviando}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                      disabled={enviando || !mensagem.trim()}
                    >
                      {enviando ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Feedback'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BotaoFeedback;