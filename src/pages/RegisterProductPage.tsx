import React, { useEffect, useState } from 'react';
import FormSection from '../components/FormSection';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import { useNavigate, useParams } from 'react-router-dom';
import type { FornecedorOption, MarcaOption, ProdutoPayload, ProdutoResponse, TipoProduto } from '../types/produto';
import { getFornecedoresOptions } from '../services/fornecedorService';
import { getMarcasOptions } from '../services/marcaService';
import { createProduct, getProductById, updateProduct } from '../services/productService';
import ErrorPopup from '../components/ErrorPopup';
import LoadingSpinner from '../components/LoadingSpinner';

const initialFormData = {
  tipoProduto: 'ARMACAO' as TipoProduto,
  fornecedorId: '', marcaId: '', nome: '', referencia: '', codigoBarras: '',
  custo: '', valorVenda: '', margemLucroPercentual: '', quantidadeEstoque: '', ativo: true,
  cor: '', material: '', tamanho: '',
  materialLente: '', tratamento: '', tipoLente: '',
};

const RegisterProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!productId;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fornecedores, setFornecedores] = useState<FornecedorOption[]>([]);
  const [marcas, setMarcas] = useState<MarcaOption[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    const loadPageData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const [fornecedoresData, marcasData] = await Promise.all([
          getFornecedoresOptions(),
          getMarcasOptions(),
        ]);
        setFornecedores(fornecedoresData);
        setMarcas(marcasData);

        if (isEditMode && productId) {
          const productData = await getProductById(productId);
          
          const flattenedData = {
            tipoProduto: productData.tipoProduto,
            fornecedorId: productData.fornecedor.id,
            marcaId: productData.marca.id || '',
            nome: productData.nome,
            referencia: productData.referencia || '',
            codigoBarras: productData.codigoBarras || '',
            custo: String(productData.custo || ''),
            valorVenda: String(productData.valorVenda || ''),
            margemLucroPercentual: String(productData.margemLucroPercentual || ''),
            quantidadeEstoque: String(productData.quantidadeEstoque),
            ativo: productData.ativo,
            cor: productData.cor || '',
            material: productData.material || '',
            tamanho: productData.tamanho || '',
            materialLente: productData.materialLente,
            tratamento: productData.tratamento || '',
            tipoLente: productData.tipoLente || '',
          };
          setFormData(flattenedData);
        }
      } catch (err) {
        setError("Falha ao carregar os dados. Verifique a conexão e tente novamente.");
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    loadPageData();
  }, [productId, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      tipoProduto: formData.tipoProduto,
      fornecedorId: formData.fornecedorId,
      marcaId: formData.marcaId || undefined,
      nome: formData.nome,
      referencia: formData.referencia,
      codigoBarras: formData.codigoBarras,
      custo: formData.custo ? parseFloat(formData.custo.replace(',', '.')) : 0,
      valorVenda: formData.valorVenda ? parseFloat(formData.valorVenda.replace(',', '.')) : 0,
      margemLucroPercentual: formData.margemLucroPercentual ? parseFloat(formData.margemLucroPercentual.replace(',', '.')) : 0,
      quantidadeEstoque: formData.quantidadeEstoque ? parseInt(formData.quantidadeEstoque, 10) : 0,
      ativo: formData.ativo,
      cor: formData.cor,
      material: formData.material,
      tamanho: formData.tamanho,
      materialLente: formData.materialLente,
      tratamento: formData.tratamento,
      tipoLente: formData.tipoLente,
    };

    try {
      if (isEditMode && productId) {
        await updateProduct(productId, productPayload);
      } else {
        await createProduct(productPayload);
      }
      navigate('/produtos');
    } catch (err) {
      setError(`Falha ao ${isEditMode ? 'atualizar' : 'cadastrar'} o produto. Verifique os dados.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const productTypeOptions = [{ value: 'ARMACAO', label: 'Armação' }, { value: 'LENTE', label: 'Lente' }];
  const supplierOptions = fornecedores.map(f => ({ value: f.id, label: f.razaoSocial }));
  const brandOptions = marcas.map(m => ({ value: m.id, label: m.nome }));

  if (isFetching) {
    return <LoadingSpinner text='Carregando dados do fornecedor...'/>
  }

  return (
    <div className="w-full">
      <HeaderTitlePage page_name={isEditMode ? "Editar Produto" : "Novo Produto"}/>
      
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
            <InputField label="Custo (R$)" name="custo" type="number" value={parseFloat(formData.custo) === 0 ? '' : formData.custo} onChange={handleChange} placeholder="0.00" className="md:col-span-2" />
            <InputField label="Valor Final (R$)" name="valorVenda" type="number" value={parseFloat(formData.valorVenda) === 0 ? '' : formData.valorVenda} onChange={handleChange} placeholder="0.00" className="md:col-span-2" />
            <InputField label="Margem de Lucro (%)" readOnly name="margemLucroPercentual" type="number" value={parseFloat(formData.margemLucroPercentual) === 0 ? '' : formData.margemLucroPercentual} onChange={handleChange} placeholder="100" className="md:col-span-2" />
            <InputField label="Estoque Inicial *" name="quantidadeEstoque" type="number" value={parseInt(formData.quantidadeEstoque) === 0 ? '' : formData.quantidadeEstoque} onChange={handleChange} placeholder="0" className="md:col-span-2" required />
          </FormSection>

          {formData.tipoProduto === 'ARMACAO' && (
            <FormSection title="Detalhes da Armação">
              <InputField label="Cor" name="cor" value={formData.cor} onChange={handleChange} placeholder="Preto, Dourado..." className="md:col-span-4" />
              <InputField label="Material" name="material" value={formData.material} onChange={handleChange} placeholder="Acetato, Metal..." className="md:col-span-4" />
              <InputField label="Tamanho" name="tamanho" value={formData.tamanho} onChange={handleChange} placeholder="58-14-140" className="md:col-span-4" />
            </FormSection>
          )}

          {formData.tipoProduto === 'LENTE' && (
            <FormSection title="Detalhes da Lente">
              <InputField label="Material" name="materialLente" value={formData.materialLente} onChange={handleChange} placeholder="Poli, Orma..." className="md:col-span-4" />
              <InputField label="Tratamento" name="tratamento" value={formData.tratamento} onChange={handleChange} placeholder="Antirreflexo, Blue Light..." className="md:col-span-4" />
              <InputField label="Tipo da Lente" name="tipoLente" value={formData.tipoLente} onChange={handleChange} placeholder="Visão Simples, Multifocal..." className="md:col-span-4" />
            </FormSection>
          )}
            <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath='/produtos' textButton2={isEditMode ? "Salvar alterações" : 'Cadastrar'} isLoading={isLoading} />
        </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default RegisterProductPage;