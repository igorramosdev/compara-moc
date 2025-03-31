import { useState } from 'react';

const ShareButtons = ({ url, title }) => {
  const [copiado, setCopiado] = useState(false);
  
  // URLs para compartilhamento
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  
  // Função para copiar o link para clipboard
  const copiarLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
    });
  };
  
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {/* WhatsApp */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors theme-transition"
          aria-label="Compartilhar no WhatsApp"
        >
          <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M5.092 24l.347-1.27c-1.788-.488-3.18-1.287-4.255-2.362C.394 19.578 0 18.328 0 16.922c0-1.41.394-2.66 1.184-3.75 1.292-1.784 3.394-2.89 5.593-2.95L6.7 9.01 6.43 8 5.8 5.1 5.537 4l.984-.169c.631-.112 1.275-.169 1.916-.169 6.255 0 11.34 5.05 11.34 11.259 0 6.21-5.085 11.26-11.34 11.26-.642 0-1.286-.058-1.917-.17L5.092 24zm6.344-3.051c5.044 0 9.15-4.075 9.15-9.077s-4.106-9.077-9.15-9.077c-.58 0-1.156.052-1.728.153l.625 3.622a5.21 5.21 0 00-.176.077l.234 1.348c-.93.061-.185.124-.275.189l.422 2.44c-2.24.089-4.298 1.183-5.571 2.91-.75.92-1.133 1.982-1.133 3.164 0 1.183.384 2.244 1.132 3.163.87 1.062 2.172 1.766 3.645 2.028l.608-2.274c.772.272 1.596.417 2.445.417z" fillRule="evenodd"/>
          </svg>
          WhatsApp
        </a>
        
        {/* Telegram */}
        <a 
          href={telegramUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors theme-transition"
          aria-label="Compartilhar no Telegram"
        >
          <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218l-10.227 9.183z"/>
          </svg>
          Telegram
        </a>
        
        {/* Twitter */}
        <a 
          href={twitterUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors theme-transition"
          aria-label="Compartilhar no Twitter"
        >
          <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Twitter
        </a>
        
        {/* Facebook */}
        <a 
          href={facebookUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors theme-transition"
          aria-label="Compartilhar no Facebook"
        >
          <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </a>
        
        {/* Copiar link */}
        <button 
          onClick={copiarLink}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors theme-transition"
          aria-label="Copiar link"
        >
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copiado ? 'Copiado!' : 'Copiar Link'}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;