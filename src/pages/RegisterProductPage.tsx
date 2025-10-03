import React, { useEffect, useState } from 'react';
import FormSection from '../components/FormSection';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import { useNavigate } from 'react-router-dom';
import type { FornecedorOption, MarcaOption, ProdutoPayload, TipoProduto } from '../types/produto';
import { getFornecedoresOptions } from '../services/fornecedorService';
import { getMarcasOptions } from '../services/marcaService';
import { createProduto } from '../services/productService';
import ErrorPopup from '../components/ErrorPopup';

const initialFormData = {
  tipoProduto: 'ARMACAO' as TipoProduto,
  fornecedorId: '', marcaId: '', nome: '', referencia: '', codigoBarras: '',
  custo: '', margemLucroPercentual: '', quantidadeEstoque: '', ativo: true,
  cor: '', material: '', tamanho: '',
  indiceRefracao: '', tratamento: '', tipoLente: '',
};

const RegisterProductPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fornecedores, setFornecedores] = useState<FornecedorOption[]>([]);
  const [marcas, setMarcas] = useState<MarcaOption[]>([]);

  const [formData, setFormData] = useState(initialFormData);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fornecedoresData, marcasData] = await Promise.all([
          getFornecedoresOptions(),
          getMarcasOptions()
        ]);
        setFornecedores(fornecedoresData);
        setMarcas(marcasData);
      } catch (err) {
        setError("Falha ao carregar dados de fornecedores e marcas.");
      }
    };
    fetchData();
  }, []); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as TipoProduto;

         setFormData(prev => ({
        ...initialFormData, 
        tipoProduto: newType,
        fornecedorId: prev.fornecedorId,
        marcaId: prev.marcaId,
        nome: prev.nome,
      }));
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const productPayload: ProdutoPayload = {
      ...formData,
      tipoProduto: formData.tipoProduto as TipoProduto,
      marcaId: formData.marcaId || undefined,
      custo: formData.custo ? parseFloat(formData.custo.replace(',', '.')) : undefined,
      margemLucroPercentual: formData.margemLucroPercentual ? parseFloat(formData.margemLucroPercentual.replace(',', '.')) : undefined,
      quantidadeEstoque: parseInt(formData.quantidadeEstoque, 10),
      indiceRefracao: formData.indiceRefracao ? parseFloat(formData.indiceRefracao.replace(',', '.')) : undefined,
    };

    try {
      await createProduto(productPayload);
      navigate('/produtos');
    } catch (err) {
      setError('Falha ao cadastrar o produto. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const productTypeOptions = [{ value: 'ARMACAO', label: 'Armação' }, { value: 'LENTE', label: 'Lente' }];
  const supplierOptions = fornecedores.map(f => ({ value: f.id, label: f.razaoSocial }));
  const brandOptions = marcas.map(m => ({ value: m.id, label: m.nome }));


  return (
    <div className="w-full">
      <HeaderTitlePage page_name="Novo Produto"/>
      
      <div className="w-full bg-white p-6">
        <form onSubmit={handleSubmit}>

          <FormSection title="Informações Gerais">
            <SelectField label="Tipo do Produto *" name="tipoProduto" value={formData.tipoProduto} onChange={handleTypeChange} options={productTypeOptions} className="md:col-span-4" />
            <SelectField label="Fornecedor *" name="fornecedorId" value={formData.fornecedorId} onChange={handleChange} options={supplierOptions} className="md:col-span-4" required />
            <SelectField label="Marca" name="marcaId" value={formData.marcaId} onChange={handleChange} options={brandOptions} className="md:col-span-4" />
            
            <InputField label="Nome / Descrição *" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Ray-Ban Aviator Clássico" className="md:col-span-12" required />
            <InputField label="Referência" name="referencia" value={formData.referencia} onChange={handleChange} placeholder="Ex: RB3025" className="md:col-span-6" />
            <InputField label="Código de Barras" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="789..." className="md:col-span-6" />
          </FormSection>

          <FormSection title="Valores e Estoque">
            <InputField label="Custo (R$)" name="custo" type="number" value={parseFloat(formData.custo) === 0 ? '' : formData.custo} onChange={handleChange} placeholder="0.00" className="md:col-span-4" />
            <InputField label="Margem de Lucro (%)" name="margemLucroPercentual" type="number" value={parseFloat(formData.margemLucroPercentual) === 0 ? '' : formData.margemLucroPercentual} onChange={handleChange} placeholder="100" className="md:col-span-4" />
            <InputField label="Estoque Inicial *" name="quantidadeEstoque" type="number" value={parseInt(formData.quantidadeEstoque) === 0 ? '' : formData.quantidadeEstoque} onChange={handleChange} placeholder="0" className="md:col-span-4" required />
          </FormSection>

          {formData.tipoProduto === 'ARMACAO' && (
            <FormSection title="Detalhes da Armação">
              <InputField label="Cor" name="cor" value={formData.cor} onChange={handleChange} placeholder="Preto, Dourado..." className="md:col-span-4" />
              <InputField label="Material" name="materialArmacao" value={formData.material} onChange={handleChange} placeholder="Acetato, Metal..." className="md:col-span-4" />
              <InputField label="Tamanho" name="tamanho" value={formData.tamanho} onChange={handleChange} placeholder="58-14-140" className="md:col-span-4" />
            </FormSection>
          )}

          {formData.tipoProduto === 'LENTE' && (
            <FormSection title="Detalhes da Lente">
              <InputField label="Material" name="materialLente" value={formData.indiceRefracao} onChange={handleChange} placeholder="Poli, Orma..." className="md:col-span-4" />
              <InputField label="Tratamento" name="tratamento" value={formData.tratamento} onChange={handleChange} placeholder="Antirreflexo, Blue Light..." className="md:col-span-4" />
              <InputField label="Tipo da Lente" name="tipoLente" value={formData.tipoLente} onChange={handleChange} placeholder="Visão Simples, Multifocal..." className="md:col-span-4" />
            </FormSection>
          )}
            <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath='/produtos' textButton2={isLoading ? 'Cadastrando...' : 'Cadastrar'} />
        </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default RegisterProductPage;