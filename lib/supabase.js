import { createClient } from '@supabase/supabase-js';
import { bairrosMontesClaros } from '../utils/bairrosData';

// Inicializa o cliente Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Busca os preços mais recentes limitados por quantidade
 */
export async function buscarPrecosRecentes(limite = 10) {
  const { data, error } = await supabase
    .from('precos')
    .select('*')
    .order('data', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('Erro ao buscar preços recentes:', error);
    return { data: [], error };
  }

  return { data, error };
}

/**
 * Busca os preços por produto limitados por quantidade
 */
export async function buscarPrecosProduto(produto, limite = 50) {
  // Normaliza o nome do produto para busca
  const produtoNormalizado = produto.replace(/-/g, ' ').toLowerCase();

  const { data, error } = await supabase
    .from('precos')
    .select('*')
    .ilike('produto', `%${produtoNormalizado}%`)
    .order('data', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('Erro ao buscar preços do produto:', error);
    return { data: [], error };
  }

  return { data, error };
}

/**
 * Adiciona um novo preço ao banco de dados
 */
export async function adicionarPreco(dadosPreco) {
  // Adiciona a data atual se não for fornecida
  if (!dadosPreco.data) {
    dadosPreco.data = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('precos')
    .insert([dadosPreco])
    .single();

  if (error) {
    console.error('Erro ao adicionar preço:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Busca preços por bairro
 */
export async function buscarPrecosPorBairro(bairro, limite = 50) {
  const { data, error } = await supabase
    .from('precos')
    .select('*')
    .eq('bairro', bairro)
    .order('data', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('Erro ao buscar preços por bairro:', error);
    return { data: [], error };
  }

  return { data, error };
}

/**
 * Busca preços por loja/estabelecimento
 */
export async function buscarPrecosPorLoja(loja, limite = 50) {
  const { data, error } = await supabase
    .from('precos')
    .select('*')
    .eq('loja', loja)
    .order('data', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('Erro ao buscar preços por loja:', error);
    return { data: [], error };
  }

  return { data, error };
}

/**
 * Lista todos os bairros - combina bairros do banco com lista pré-definida de Montes Claros
 */
export async function listarBairros() {
  const { data, error } = await supabase
    .from('precos')
    .select('bairro')
    .order('bairro')
    .not('bairro', 'is', null);

  if (error) {
    console.error('Erro ao listar bairros:', error);
    return { data: bairrosMontesClaros, error };
  }

  // Remove duplicados dos bairros do banco de dados
  const bairrosDoBanco = [...new Set(data.map(item => item.bairro))];
  
  // Mescla os bairros do banco com a lista pré-definida
  const todosBairros = [...bairrosDoBanco, ...bairrosMontesClaros];
  
  // Remove duplicatas e ordena alfabeticamente
  const bairrosUnicos = [...new Set(todosBairros)].sort((a, b) => 
    a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
  );
  
  return { data: bairrosUnicos, error: null };
}

/**
 * Busca preços por cidade
 */
export async function buscarPrecosPorCidade(cidade, limite = 50) {
  const { data, error } = await supabase
    .from('precos')
    .select('*')
    .eq('cidade', cidade)
    .order('data', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('Erro ao buscar preços por cidade:', error);
    return { data: [], error };
  }

  return { data, error };
}

/**
 * Lista todas as cidades distintas no banco de dados
 */
export async function listarCidades() {
  const { data, error } = await supabase
    .from('precos')
    .select('cidade')
    .order('cidade')
    .not('cidade', 'is', null);

  if (error) {
    console.error('Erro ao listar cidades:', error);
    return { data: [], error };
  }

  // Remove duplicados e retorna apenas os nomes das cidades
  const cidadesUnicas = [...new Set(data.map(item => item.cidade))];
  
  // Garante que Montes Claros está sempre na lista, mesmo sem dados
  if (!cidadesUnicas.includes('Montes Claros')) {
    cidadesUnicas.unshift('Montes Claros');
  }
  
  return { data: cidadesUnicas, error: null };
}

/**
 * Lista todas as lojas/estabelecimentos distintos no banco de dados
 */
export async function listarLojas() {
  const { data, error } = await supabase
    .from('precos')
    .select('loja')
    .order('loja')
    .not('loja', 'is', null);

  if (error) {
    console.error('Erro ao listar lojas:', error);
    return { data: [], error };
  }

  // Remove duplicados e retorna apenas os nomes das lojas
  const lojasUnicas = [...new Set(data.map(item => item.loja))];
  return { data: lojasUnicas, error: null };
}