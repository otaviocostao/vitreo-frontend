import React, { useState, useEffect } from 'react';
import InputField from '../components/ui/InputField';
import FormSection from '../components/FormSection';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import AssociatedBrandsManager from '../components/AssociatedBrandsManager';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import type { SupplierPayload, SupplierResponse } from '../types/supplier';
import { associateMarca, createFornecedor, dissociateMarca, getFornecedorById, updateFornecedor } from '../services/supplierService';
import type { BrandResponse } from '../types/marca';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCNPJ } from '../lib/utils';

interface SupplierFormData {
  corporateName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  cellPhone: string;
  email: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  brands: BrandResponse[];
}

const initialFormData = {
  corporateName: '', tradeName: '', cnpj: '', stateRegistration: '', cellPhone: '', email: '',
  zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '', complement: '',
  brands: [],
};

const RegisterSupplierPage = () => {
  const { id: supplierId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!supplierId;

  const [formData, setFormData] = useState<SupplierFormData>(initialFormData);
  const [initialLoadedData, setInitialLoadedData] = useState<SupplierFormData>(initialFormData);
  const [initialBrands, setInitialBrands] = useState<BrandResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode) setIsFetching(true);
      setError(null);

      try {
        if (isEditMode && supplierId) {
          const supplierData = await getFornecedorById(supplierId);

          const flattenedData: SupplierFormData = {
            corporateName: supplierData.corporateName,
            tradeName: supplierData.tradeName,
            cnpj: formatCNPJ(supplierData.cnpj),
            stateRegistration: supplierData.stateRegistration,
            cellPhone: supplierData.cellPhone,
            email: supplierData.email,
            street: supplierData.street || '',
            number: supplierData.number || '',
            neighborhood: supplierData.neighborhood || '',
            complement: supplierData.complement || '',
            city: supplierData.city || '',
            state: supplierData.state || '',
            zipCode: supplierData.zipCode,
            brands: supplierData.brands,
          };

          setFormData(flattenedData);
          setInitialLoadedData(flattenedData);
          setInitialBrands(supplierData.brands);
        }
      } catch (err) {
        setError("Falha ao carregar os dados. Verifique a conexão e tente novamente.");
        console.error(err);
      } finally {
        if (isEditMode) setIsFetching(false);
      }
    };

    loadInitialData();
  }, [supplierId, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'cnpj' ? formatCNPJ(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleBrandChange = (updatedBrands: BrandResponse[]) => {
    setFormData(prev => ({ ...prev, brands: updatedBrands }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cleanedCnpj = formData.cnpj.replace(/[^a-zA-Z0-9]/g, '');


    const supplierPayload: SupplierPayload = {
      corporateName: formData.corporateName,
      tradeName: formData.tradeName,
      cnpj: cleanedCnpj,
      stateRegistration: formData.stateRegistration,
      cellPhone: formData.cellPhone,
      email: formData.email,
      street: formData.street,
      number: formData.number,
      neighborhood: formData.neighborhood,
      complement: formData.complement,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    };

    try {
      let savedFornecedor: SupplierResponse;

      if (isEditMode && supplierId) {
        savedFornecedor = await updateFornecedor(supplierId, supplierPayload);
      } else {
        savedFornecedor = await createFornecedor(supplierPayload);
      }

      await syncMarcas(savedFornecedor.id);

      navigate('/fornecedores');

    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).join(', ');
        setError(`Falha ao ${isEditMode ? 'atualizar' : 'cadastrar'} o fornecedor: ${errorMessages}`);
      } else {
        setError('Falha ao cadastrar o fornecedor...');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const syncMarcas = async (fornecedorId: string) => {
    const initialBrandIds = new Set(initialBrands.map(b => b.id));
    const currentBrandIds = new Set(formData.brands.map(b => b.id));

    const marcasToAdd = formData.brands.filter(b => !initialBrandIds.has(b.id));
    const marcasToRemove = initialBrands.filter(b => !currentBrandIds.has(b.id));

    const associationPromises = marcasToAdd.map(marca =>
      associateMarca(fornecedorId, marca.id)
    );
    const dissociationPromises = marcasToRemove.map(marca =>
      dissociateMarca(fornecedorId, marca.id)
    );

    await Promise.all([...associationPromises, ...dissociationPromises]);
  };

  if (isFetching) {
    return <LoadingSpinner text='Carregando dados do fornecedor...' />
  }

  const areBrandsEqual = (arr1: BrandResponse[], arr2: BrandResponse[]) => {
    if (arr1.length !== arr2.length) return false;
    const set1 = new Set(arr1.map(b => b.id));
    return arr2.every(b => set1.has(b.id));
  };

  const isFormEmpty = (data: SupplierFormData) => {
    const textFieldsEmpty = (
      data.corporateName === '' &&
      data.tradeName === '' &&
      data.cnpj === '' &&
      data.stateRegistration === '' &&
      data.cellPhone === '' &&
      data.email === '' &&
      data.street === '' &&
      data.number === '' &&
      data.neighborhood === '' &&
      data.complement === '' &&
      data.city === '' &&
      data.state === '' &&
      data.zipCode === ''
    );
    const brandsEmpty = data.brands.length === 0;
    return textFieldsEmpty && brandsEmpty;
  };

  const isFormUnchanged = (current: SupplierFormData, initial: SupplierFormData) => {
    const textFieldsUnchanged = (
      current.corporateName === initial.corporateName &&
      current.tradeName === initial.tradeName &&
      current.cnpj === initial.cnpj &&
      current.stateRegistration === initial.stateRegistration &&
      current.cellPhone === initial.cellPhone &&
      current.email === initial.email &&
      current.street === initial.street &&
      current.number === initial.number &&
      current.neighborhood === initial.neighborhood &&
      current.complement === initial.complement &&
      current.city === initial.city &&
      current.state === initial.state &&
      current.zipCode === initial.zipCode
    );
    const brandsUnchanged = areBrandsEqual(current.brands, initial.brands);
    return textFieldsUnchanged && brandsUnchanged;
  };

  const isSaveDisabled = isEditMode
    ? isFormUnchanged(formData, initialLoadedData)
    : isFormEmpty(formData);

  return (
    <div className="w-full">
      <HeaderTitlePage page_name={isEditMode ? 'Editar Fornecedor' : 'Novo Fornecedor'} />

      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <FormSection title="Dados da Empresa">
            <InputField label="Razão Social *" name="corporateName" value={formData.corporateName} onChange={handleChange} className="md:col-span-7" required />
            <InputField label="Nome Fantasia" name="tradeName" value={formData.tradeName} onChange={handleChange} className="md:col-span-5" />
            <InputField label="CNPJ *" name="cnpj" value={formData.cnpj} onChange={handleChange} className="md:col-span-3" placeholder="00.000.000/0000-00" required />
            <InputField label="Inscrição Estadual" name="stateRegistration" value={formData.stateRegistration} onChange={handleChange} className="md:col-span-3" />
          </FormSection>

          <FormSection title="Endereço">
            <InputField label="Logradouro" name="street" value={formData.street} onChange={handleChange} className="md:col-span-8" />
            <InputField label="Número" name="number" value={formData.number} onChange={handleChange} className="md:col-span-1" />
            <InputField label="Bairro" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="md:col-span-4" />
            <InputField label="Cidade" name="city" value={formData.city} onChange={handleChange} className="md:col-span-4" />
            <InputField label="Estado" name="state" value={formData.state} onChange={handleChange} className="md:col-span-4" />
            <InputField label="CEP" name="zipCode" value={formData.zipCode} onChange={handleChange} className="md:col-span-3" placeholder="00000-000" />
            <InputField label="Complemento" name="complement" value={formData.complement} onChange={handleChange} className="md:col-span-9" />
          </FormSection>

          <FormSection title="Informações de Contato">
            <InputField label="Telefone" name="cellPhone" type="tel" value={formData.cellPhone} onChange={handleChange} className="md:col-span-6" placeholder="(99) 9999-9999" />
            <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} className="md:col-span-6" placeholder="contato@empresa.com" />
          </FormSection>

          <FormSection title="Marcas Associadas">
            <div className="md:col-span-12">
              <AssociatedBrandsManager
                selectedBrands={formData.brands}
                onChange={handleBrandChange}
              />
            </div>
          </FormSection>

          <SaveCancelButtonsArea textButton1='Cancelar' textButton2={isEditMode ? 'Salvar alterações' : 'Cadastrar'} isLoading={isLoading} cancelButtonPath='/fornecedores' isSaveDisabled={isSaveDisabled} />
        </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default RegisterSupplierPage;
