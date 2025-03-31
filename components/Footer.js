import { useState, useEffect, useRef } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [typingAnimation, setTypingAnimation] = useState({phase: 'typing', text: ''});
  const devSignature = "< Desenvolvido por Igor Dev />";
  const cursorRef = useRef(null);
  
  useEffect(() => {
    let timeout;
    let interval;
    
    // Função para animar o cursor piscando
    const cursorBlinkAnimation = () => {
      if (cursorRef.current) {
        cursorRef.current.animate(
          [
            { opacity: 1 },
            { opacity: 0 },
            { opacity: 1 }
          ],
          {
            duration: 1000,
            iterations: Infinity
          }
        );
      }
    };
    
    // Inicia a animação do cursor
    cursorBlinkAnimation();
    
    // Controle da animação de digitação
    const typeText = () => {
      setTypingAnimation({ phase: 'typing', text: '' });
      let i = 0;
      
      clearInterval(interval);
      
      // Digitação progressiva
      interval = setInterval(() => {
        if (i < devSignature.length) {
          setTypingAnimation(prev => ({
            phase: 'typing',
            text: prev.text + devSignature.charAt(i)
          }));
          i++;
        } else {
          clearInterval(interval);
          
          // Pausa quando a digitação estiver completa
          timeout = setTimeout(() => {
            setTypingAnimation({ phase: 'pausing', text: devSignature });
            
            // Depois de pausar, apaga lentamente
            timeout = setTimeout(() => {
              eraseText();
            }, 5000);
          }, 1000);
        }
      }, 80);
    };
    
    // Função para apagar o texto gradualmente
    const eraseText = () => {
      let i = devSignature.length;
      
      clearInterval(interval);
      
      interval = setInterval(() => {
        if (i > 0) {
          i--;
          setTypingAnimation(prev => ({
            phase: 'erasing',
            text: devSignature.substring(0, i)
          }));
        } else {
          clearInterval(interval);
          
          // Quando terminar de apagar, começa novamente após um tempo
          timeout = setTimeout(() => {
            typeText();
          }, 1000);
        }
      }, 40); // Apaga mais rápido do que digita
    };
    
    // Inicia o processo de animação
    typeText();
    
    // Limpeza
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-300">Compara Moc</h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              O Compara Moc ajuda você a encontrar os melhores
              preços de produtos essenciais em Montes Claros. Economize tempo e dinheiro.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-300">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/" className="hover:text-white transition-colors">Início</a>
              </li>
              <li>
                <a href="/adicionar" className="hover:text-white transition-colors">Cadastrar Preço</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Sobre o Projeto</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Produtos Populares</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Lojas</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-300">Contato</h3>
            <p className="text-gray-300 mb-4">Tem sugestões ou encontrou algum erro? Entre em contato conosco.</p>
            <a href="mailto:contato@comparamoc.com.br" className="text-blue-400 hover:text-blue-300 transition-colors">
              contato@comparamoc.com.br
            </a>
          </div>
        </div>
        
        <div className="pt-6 mb-8 flex justify-center">
          <div className="relative font-mono font-medium text-cyan-400 dark:text-cyan-300 bg-gray-700 px-5 py-3 rounded-lg shadow-lg text-sm overflow-hidden group">
            {/* Container do texto com efeito de gradiente */}
            <div className="relative z-10 flex items-center overflow-hidden">
              <span className="whitespace-nowrap">
                {typingAnimation.text}
              </span>
              {/* Cursor piscante */}
              <span 
                ref={cursorRef}
                className={`h-4 w-0.5 ml-0.5 bg-current transform ${
                  typingAnimation.phase === 'pausing' ? 'animate-blink' : ''
                }`}
              ></span>
            </div>
            
            {/* Efeito gradiente subjacente, visível apenas no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-1000"></div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Compara Moc - Montes Claros. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center text-xs">
              <span className="mr-2">Desenvolvido com</span>
              <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 0-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
                </svg>
                Next.js
              </a>
              <span className="mx-2">+</span>
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-green-400 hover:text-green-300 transition-colors">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 109 113" fill="currentColor">
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" />
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)" />
                  <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                Supabase
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;