/**
 * Formata um valor numérico como preço em reais
 */
export function formatarPreco(valor) {
  if (valor === null || valor === undefined) return 'R$ --,--';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formata uma data ISO em formato legível
 */
export function formatarData(dataIso) {
  if (!dataIso) return '';
  
  const data = new Date(dataIso);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formata uma data ISO em formato legível com hora
 */
export function formatarDataHora(dataIso) {
  if (!dataIso) return '';
  
  const data = new Date(dataIso);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calcula o tempo relativo entre uma data e agora (ex: "há 2 horas")
 */
export function tempoRelativo(dataIso) {
  if (!dataIso) return '';
  
  const data = new Date(dataIso);
  const agora = new Date();
  const diffMs = agora - data;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  
  if (diffMonth > 0) {
    return `há ${diffMonth} ${diffMonth === 1 ? 'mês' : 'meses'}`;
  }
  if (diffDay > 0) {
    return `há ${diffDay} ${diffDay === 1 ? 'dia' : 'dias'}`;
  }
  if (diffHour > 0) {
    return `há ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
  }
  if (diffMin > 0) {
    return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  }
  
  return 'agora mesmo';
}

/**
 * Normaliza um texto removendo acentos e caracteres especiais
 */
export function normalizarTexto(texto) {
  if (!texto) return '';
  
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Gera um slug a partir de um texto
 */
export function gerarSlug(texto) {
  if (!texto) return '';
  
  return normalizarTexto(texto)
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Capitaliza a primeira letra de cada palavra em um texto
 */
export function capitalizarPalavras(texto) {
  if (!texto) return '';
  
  return texto
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(' ');
}