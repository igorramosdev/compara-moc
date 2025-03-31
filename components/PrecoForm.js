import { useState } from 'react';
import { useRouter } from 'next/router';
import { adicionarPreco } from '../lib/supabase';
import { formatarPreco } from '../utils/formatters';
import ProdutoSugestoes from './ProdutoSugestoes';

const PrecoForm = ({ bairros = [], lojas = [], cidades = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    produto: '',
    preco: '',
    loja: '',
    bairro: '',
    outro_bairro: '',
    outra_loja: '',
    cidade: 'Montes Claros',
    outra_cidade: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setSuccess(false);

    if (!formData.produto || !formData.preco) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      // Prepara os dados para envio
      const precoData = {
        produto: formData.produto.trim(),
        preco: parseFloat(formData.preco.replace(',', '.')),
        loja: formData.loja === 'outra' ? formData.outra_loja.trim() : formData.loja,
        bairro: formData.bairro === 'outro' ? formData.outro_bairro.trim() : formData.bairro,
        cidade: formData.cidade === 'outra' ? formData.outra_cidade.trim() : formData.cidade,
        estado: 'MG'
      };

      const { data, error } = await adicionarPreco(precoData);

      if (error) throw error;

      // Limpa o formulário
      setFormData({
        produto: '',
        preco: '',
        loja: '',
        bairro: '',
        outro_bairro: '',
        outra_loja: '',
        cidade: 'Montes Claros',
        outra_cidade: ''
      });
      
      setSuccess(true);

      // Redireciona para a página do produto após 2 segundos
      setTimeout(() => {
        const produtoSlug = precoData.produto.toLowerCase().replace(/\s+/g, '-');
        router.push(`/preco/${produtoSlug}`);
      }, 2000);
    } catch (error) {
      console.error('Erro ao adicionar preço:', error);
      setErro('Ocorreu um erro ao salvar o preço. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md theme-transition">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-gray-100 mb-6">Cadastrar Novo Preço</h2>
      
      {erro && (
        <div className="bg-red-100 dark:bg-red-900 dark:bg-opacity-30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6 flex items-center theme-transition">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {erro}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-6 flex items-center theme-transition">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Preço cadastrado com sucesso! Redirecionando...
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="produto" className="form-label">Produto*</label>
          <input
            type="text"
            id="produto"
            name="produto"
            className="form-input"
            value={formData.produto}
            onChange={handleChange}
            placeholder="Ex: Gasolina, Arroz 5kg, Gás de Cozinha 13kg"
            required
            disabled={loading}
          />
          <ProdutoSugestoes 
            onSelect={(nomeProduto) => {
              setFormData(prev => ({ ...prev, produto: nomeProduto }));
            }} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="preco" className="form-label">Preço (R$)*</label>
          <input
            type="text"
            id="preco"
            name="preco"
            className="form-input"
            value={formData.preco}
            onChange={handleChange}
            placeholder="Ex: 5,99"
            pattern="^\d+[,.]?\d{0,2}$"
            required
            disabled={loading}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Use ponto ou vírgula para separar os centavos</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="cidade" className="form-label">Cidade*</label>
          <select
            id="cidade"
            name="cidade"
            className="form-input"
            value={formData.cidade}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Selecione uma cidade</option>
            {cidades.map(cidade => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
            <option value="outra">Outra cidade (especificar)</option>
          </select>
        </div>
        
        {formData.cidade === 'outra' && (
          <div className="form-group">
            <label htmlFor="outra_cidade" className="form-label">Nome da Cidade*</label>
            <input
              type="text"
              id="outra_cidade"
              name="outra_cidade"
              className="form-input"
              value={formData.outra_cidade}
              onChange={handleChange}
              placeholder="Digite o nome da cidade"
              required
              disabled={loading}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="loja" className="form-label">Estabelecimento*</label>
          <select
            id="loja"
            name="loja"
            className="form-input"
            value={formData.loja}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Selecione um estabelecimento</option>
            {lojas.map(loja => (
              <option key={loja} value={loja}>{loja}</option>
            ))}
            <option value="outra">Outro estabelecimento (especificar)</option>
          </select>
        </div>
        
        {formData.loja === 'outra' && (
          <div className="form-group">
            <label htmlFor="outra_loja" className="form-label">Nome do Estabelecimento*</label>
            <input
              type="text"
              id="outra_loja"
              name="outra_loja"
              className="form-input"
              value={formData.outra_loja}
              onChange={handleChange}
              placeholder="Digite o nome do estabelecimento"
              required
              disabled={loading}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="bairro" className="form-label">Bairro*</label>
          <select
            id="bairro"
            name="bairro"
            className="form-input"
            value={formData.bairro}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Selecione um bairro</option>
            {bairros.map(bairro => (
              <option key={bairro} value={bairro}>{bairro}</option>
            ))}
            <option value="outro">Outro bairro (especificar)</option>
          </select>
        </div>
        
        {formData.bairro === 'outro' && (
          <div className="form-group">
            <label htmlFor="outro_bairro" className="form-label">Nome do Bairro*</label>
            <input
              type="text"
              id="outro_bairro"
              name="outro_bairro"
              className="form-input"
              value={formData.outro_bairro}
              onChange={handleChange}
              placeholder="Digite o nome do bairro"
              required
              disabled={loading}
            />
          </div>
        )}
        
        <div className="pt-4">
          <button 
            type="submit" 
            className={`btn-primary w-full py-3 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Cadastrar Preço
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrecoForm;