import React, { useState, useEffect } from 'react';
import InputField from '../components/ui/InputField';
import FormSection from '../components/FormSection';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import AssociatedBrandsManager from '../components/AssociatedBrandsManager';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import type { FornecedorPayload, FornecedorResponse } from '../types/fornecedor';
import { associateMarca, createFornecedor, dissociateMarca, getFornecedorById, updateFornecedor } from '../services/fornecedorService';
import type { MarcaResponse } from '../types/marca';
import { getMarcasOptions } from '../services/marcaService';
import LoadingSpinner from '../components/LoadingSpinner';

interface SupplierFormData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  telefone: string;
  email: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
  marcasTrabalhadas: MarcaResponse[];
}

const initialFormData = {
  razaoSocial: '', nomeFantasia: '', cnpj: '', inscricaoEstadual: '', telefone: '', email: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '', complemento: '',
  marcasTrabalhadas: [],
};

const AddSupplierPage = () => {
  const { id: supplierId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!supplierId;

  const [formData, setFormData] = useState<SupplierFormData>(initialFormData);
  const [initialBrands, setInitialBrands] = useState<MarcaResponse[]>([]);
  const [allBrands, setAllBrands] = useState<MarcaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(isEditMode); 

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode) setIsFetching(true);
      setError(null);

      try {
        const brandsPromise = getMarcasOptions();

        if (isEditMode && supplierId) {
          const supplierPromise = getFornecedorById(supplierId);

          const [supplierData, brandsData] = await Promise.all([supplierPromise, brandsPromise]);
          
          const flattenedData: SupplierFormData = {
            razaoSocial: supplierData.razaoSocial,
            nomeFantasia: supplierData.nomeFantasia,
            cnpj: supplierData.cnpj,
            inscricaoEstadual: supplierData.inscricaoEstadual,
            telefone: supplierData.telefone,
            email: supplierData.email,
            ...supplierData.endereco,
            complemento: supplierData.endereco.complemento || '',
            marcasTrabalhadas: supplierData.marcasTrabalhadas,
          };

          setFormData(flattenedData);
          setInitialBrands(supplierData.marcasTrabalhadas);
          setAllBrands(brandsData);

        } else {
          const brandsData = await brandsPromise;
          setAllBrands(brandsData);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (updatedBrands: MarcaResponse[]) => {
    setFormData(prev => ({ ...prev, marcasTrabalhadas: updatedBrands }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cleanedCnpj = formData.cnpj.replace(/[^\d]/g, '');


    const fornecedorPayload: FornecedorPayload = {
      razaoSocial: formData.razaoSocial,
      nomeFantasia: formData.nomeFantasia,
      cnpj: cleanedCnpj,
      inscricaoEstadual: formData.inscricaoEstadual,
      telefone: formData.telefone,
      email: formData.email,
      endereco: {
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        complemento: formData.complemento,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
      },
    };

    try {
      let savedFornecedor: FornecedorResponse;

      if (isEditMode && supplierId) {
        savedFornecedor = await updateFornecedor(supplierId, fornecedorPayload);
      } else {
        savedFornecedor = await createFornecedor(fornecedorPayload);
      }

      await syncMarcas(savedFornecedor.id);

      navigate('/fornecedores');

    } catch (err) {
      setError(`Falha ao salvar o fornecedor. Verifique os dados e tente novamente.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncMarcas = async (fornecedorId: string) => {
    const initialBrandIds = new Set(initialBrands.map(b => b.id));
    const currentBrandIds = new Set(formData.marcasTrabalhadas.map(b => b.id));

    const marcasToAdd = formData.marcasTrabalhadas.filter(b => !initialBrandIds.has(b.id));
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
    return <LoadingSpinner text='Carregando dados do fornecedor...'/>
  }

  return (
    <div className="w-full">
      <HeaderTitlePage page_name={isEditMode ? 'Editar Fornecedor' : 'Novo Fornecedor'}/>
      
      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
            <FormSection title="Dados da Empresa">
              <InputField label="Razão Social *" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} className="md:col-span-7" required />
              <InputField label="Nome Fantasia" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} className="md:col-span-5" />
              <InputField label="CNPJ *" name="cnpj" value={formData.cnpj} onChange={handleChange} className="md:col-span-3" placeholder="00.000.000/0000-00" required />
              <InputField label="Inscrição Estadual" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} className="md:col-span-3" />
            </FormSection>

            <FormSection title="Endereço">
              <InputField label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} className="md:col-span-8" />
              <InputField label="Número" name="numero" value={formData.numero} onChange={handleChange} className="md:col-span-1" />
              <InputField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} className="md:col-span-4" />
              <InputField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} className="md:col-span-4" />
              <InputField label="Estado" name="estado" value={formData.estado} onChange={handleChange} className="md:col-span-4" />
              <InputField label="CEP" name="cep" value={formData.cep} onChange={handleChange} className="md:col-span-3" placeholder="00000-000" />
              <InputField label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} className="md:col-span-9" />
            </FormSection>

            <FormSection title="Informações de Contato">
              <InputField label="Telefone *" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} className="md:col-span-6" placeholder="(99) 9999-9999" required />
              <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} className="md:col-span-6" placeholder="contato@empresa.com" />
            </FormSection>
            
            <FormSection title="Marcas Associadas">
                <div className="md:col-span-12">
                    <AssociatedBrandsManager
                        selectedBrands={formData.marcasTrabalhadas}
                        onChange={handleBrandChange}
                    />
                </div>
            </FormSection>
            
            <SaveCancelButtonsArea textButton1='Cancelar' textButton2={isEditMode ? 'Salvar' : 'Cadastrar'}  cancelButtonPath='/fornecedores' />
        </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default AddSupplierPage;
