import React, { useEffect, useState } from 'react';
import FormSection from '../components/FormSection';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import { useNavigate, useParams } from 'react-router-dom';
import type { SupplierOption, BrandOption, ProductPayload, ProductType } from '../types/product';
import { getFornecedoresOptions } from '../services/supplierService';
import { getMarcasOptions } from '../services/marcaService';
import { createProduct, getProductById, updateProduct } from '../services/productService';
import ErrorPopup from '../components/ErrorPopup';
import LoadingSpinner from '../components/LoadingSpinner';

const initialFormData = {
  productType: 'frame' as ProductType,
  supplierId: '', brandId: '', name: '', reference: '', barcode: '',
  cost: '', salePrice: '', profitMargin: '', stockQuantity: '', isActive: true,
  color: '', material: '', size: '',
  lensMaterial: '', treatment: '', lensType: '',
};

const RegisterProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!productId;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fornecedores, setFornecedores] = useState<SupplierOption[]>([]);
  const [marcas, setMarcas] = useState<BrandOption[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [initialLoadedData, setInitialLoadedData] = useState(initialFormData);
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
            productType: productData.productType,
            supplierId: productData.supplier.id,
            brandId: productData.brand?.id || '',
            name: productData.name,
            reference: productData.reference || '',
            barcode: productData.barcode || '',
            cost: String(productData.cost || ''),
            salePrice: String(productData.salePrice || ''),
            profitMargin: String(productData.profitMargin || ''),
            stockQuantity: String(productData.stockQuantity),
            isActive: productData.isActive,
            color: productData.color || '',
            material: productData.material || '',
            size: productData.size || '',
            lensMaterial: productData.lensMaterial || '',
            treatment: productData.treatment || '',
            lensType: productData.lensType || '',
          };
          setFormData(flattenedData);
          setInitialLoadedData(flattenedData);
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
    const newType = e.target.value as ProductType;
    setFormData(prev => ({
      ...initialFormData,
      productType: newType,
      supplierId: prev.supplierId,
      brandId: prev.brandId,
      name: prev.name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const productPayload: ProductPayload = {
      productType: formData.productType,
      supplierId: formData.supplierId,
      brandId: formData.brandId || undefined,
      name: formData.name,
      reference: formData.reference,
      barcode: formData.barcode,
      cost: formData.cost ? parseFloat(formData.cost.replace(',', '.')) : 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice.replace(',', '.')) : 0,
      profitMargin: formData.profitMargin ? parseFloat(formData.profitMargin.replace(',', '.')) : 0,
      stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity, 10) : 0,
      isActive: formData.isActive,
      color: formData.color,
      material: formData.material,
      size: formData.size,
      lensMaterial: formData.lensMaterial,
      treatment: formData.treatment,
      lensType: formData.lensType,
    };

    try {
      if (isEditMode && productId) {
        await updateProduct(productId, productPayload);
      } else {
        await createProduct(productPayload);
      }
      navigate('/produtos');
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).join(', ');
        setError(`Falha ao ${isEditMode ? 'atualizar' : 'cadastrar'} o produto: ${errorMessages}`);
      } else {
        setError('Falha ao cadastrar o produto...');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const productTypeOptions = [{ value: 'frame', label: 'Armação' }, { value: 'lens', label: 'Lente' }];
  const supplierOptions = fornecedores.map(f => ({ value: f.id, label: f.corporateName }));
  const brandOptions = marcas.map(m => ({ value: m.id, label: m.name }));

  if (isFetching) {
    return <LoadingSpinner text='Carregando dados do fornecedor...' />
  }

          const isFormEmpty = (data: typeof initialFormData) => {
            return (
              data.supplierId === '' &&
              data.brandId === '' &&
              data.name === '' &&
              data.reference === '' &&
              data.barcode === '' &&
              data.cost === '' &&
              data.salePrice === '' &&
              data.profitMargin === '' &&
              data.stockQuantity === '' &&
              data.color === '' &&
              data.material === '' &&
              data.size === '' &&
              data.lensMaterial === '' &&
              data.treatment === '' &&
              data.lensType === ''
            );
          };

          const isFormUnchanged = (current: typeof initialFormData, initial: typeof initialFormData) => {
            return Object.keys(current).every(key => current[key as keyof typeof initialFormData] === initial[key as keyof typeof initialFormData]);
          };

          const isSaveDisabled = isEditMode
            ? isFormUnchanged(formData, initialLoadedData)
            : isFormEmpty(formData);

          return (
            <div className="w-full">
              <HeaderTitlePage page_name={isEditMode ? "Editar Produto" : "Novo Produto"} />

              <div className="w-full bg-white p-6">
                <form onSubmit={handleSubmit}>

                  <FormSection title="Informações Gerais">
                    <SelectField label="Tipo do Produto *" name="productType" value={formData.productType} onChange={handleTypeChange} options={productTypeOptions} className="md:col-span-4" />
                    <SelectField label="Fornecedor *" name="supplierId" value={formData.supplierId} onChange={handleChange} options={supplierOptions} className="md:col-span-4" required />
                    <SelectField label="Marca" name="brandId" value={formData.brandId} onChange={handleChange} options={brandOptions} className="md:col-span-4" />

                    <InputField label="Nome / Descrição *" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Ray-Ban Aviator Clássico" className="md:col-span-12" required />
                    <InputField label="Referência" name="reference" value={formData.reference} onChange={handleChange} placeholder="Ex: RB3025" className="md:col-span-6" />
                    <InputField label="Código de Barras" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="789..." className="md:col-span-6" />
                  </FormSection>

                  <FormSection title="Valores e Estoque">
                    <InputField label="Custo (R$)" name="cost" type="number" value={parseFloat(formData.cost) === 0 ? '' : formData.cost} onChange={handleChange} placeholder="0.00" className="md:col-span-2" />
                    <InputField label="Valor Final (R$) *" name="salePrice" type="number" value={parseFloat(formData.salePrice) === 0 ? '' : formData.salePrice} onChange={handleChange} placeholder="0.00" className="md:col-span-2" required />
                    <InputField label="Margem de Lucro (%)" readOnly name="profitMargin" type="number" value={parseFloat(formData.profitMargin) === 0 ? '' : formData.profitMargin} onChange={handleChange} placeholder="100" className="md:col-span-2" />
                    <InputField label="Estoque Inicial" name="stockQuantity" type="number" value={parseInt(formData.stockQuantity) === 0 ? '' : formData.stockQuantity} onChange={handleChange} placeholder="0" className="md:col-span-2" />
                  </FormSection>

                  {formData.productType === 'frame' && (
                    <FormSection title="Detalhes da Armação">
                      <InputField label="Cor" name="color" value={formData.color} onChange={handleChange} placeholder="Preto, Dourado..." className="md:col-span-4" />
                      <InputField label="Material" name="material" value={formData.material} onChange={handleChange} placeholder="Acetato, Metal..." className="md:col-span-4" />
                      <InputField label="Tamanho" name="size" value={formData.size} onChange={handleChange} placeholder="58-14-140" className="md:col-span-4" />
                    </FormSection>
                  )}

                  {formData.productType === 'lens' && (
                    <FormSection title="Detalhes da Lente">
                      <InputField label="Material" name="lensMaterial" value={formData.lensMaterial} onChange={handleChange} placeholder="Poli, Orma..." className="md:col-span-4" />
                      <InputField label="Tratamento" name="treatment" value={formData.treatment} onChange={handleChange} placeholder="Antirreflexo, Blue Light..." className="md:col-span-4" />
                      <InputField label="Tipo da Lente" name="lensType" value={formData.lensType} onChange={handleChange} placeholder="Visão Simples, Multifocal..." className="md:col-span-4" />
                    </FormSection>
                  )}
                  <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath='/produtos' textButton2={isEditMode ? "Salvar alterações" : 'Cadastrar'} isLoading={isLoading} isSaveDisabled={isSaveDisabled} />
                </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default RegisterProductPage;