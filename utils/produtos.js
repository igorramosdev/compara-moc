// Lista de produtos comuns
const PRODUTOS = [
  {
    id: 'gasolina-comum',
    nome: 'Gasolina Comum',
    categoria: 'combustivel',
    unidade: 'litro',
  },
  {
    id: 'gasolina-aditivada',
    nome: 'Gasolina Aditivada',
    categoria: 'combustivel',
    unidade: 'litro',
  },
  {
    id: 'etanol',
    nome: 'Etanol',
    categoria: 'combustivel',
    unidade: 'litro',
  },
  {
    id: 'diesel-s10',
    nome: 'Diesel S10',
    categoria: 'combustivel',
    unidade: 'litro',
  },
  {
    id: 'gas-de-cozinha-13kg',
    nome: 'Gás de Cozinha 13kg',
    categoria: 'gas',
    unidade: 'botijão',
  },
  {
    id: 'arroz-5kg',
    nome: 'Arroz 5kg',
    categoria: 'alimento',
    unidade: 'pacote',
  },
  {
    id: 'feijao-1kg',
    nome: 'Feijão 1kg',
    categoria: 'alimento',
    unidade: 'pacote',
  },
  {
    id: 'acucar-5kg',
    nome: 'Açúcar 5kg',
    categoria: 'alimento',
    unidade: 'pacote',
  },
  {
    id: 'cafe-500g',
    nome: 'Café 500g',
    categoria: 'alimento',
    unidade: 'pacote',
  },
  {
    id: 'oleo-de-soja-900ml',
    nome: 'Óleo de Soja 900ml',
    categoria: 'alimento',
    unidade: 'garrafa',
  },
  {
    id: 'leite-1l',
    nome: 'Leite 1L',
    categoria: 'alimento',
    unidade: 'caixa',
  },
];

/**
 * Retorna um produto pelo ID
 */
export function getProdutoPorId(id) {
  return PRODUTOS.find(produto => produto.id === id) || null;
}

/**
 * Retorna a categoria de um produto pelo ID
 */
export function getCategoriaProduto(produtoId) {
  const produto = getProdutoPorId(produtoId);
  return produto ? produto.categoria : 'outro';
}

/**
 * Retorna produtos similares da mesma categoria
 */
export function getProdutosSimilares(produtoId, quantidade = 3) {
  const produto = getProdutoPorId(produtoId);
  
  if (!produto) return [];
  
  // Filtra produtos da mesma categoria, excluindo o produto atual
  return PRODUTOS
    .filter(p => p.categoria === produto.categoria && p.id !== produtoId)
    .slice(0, quantidade);
}