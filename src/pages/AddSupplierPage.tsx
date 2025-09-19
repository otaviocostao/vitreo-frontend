import React, { useState, useEffect } from 'react';
import InputField from '../components/ui/InputField';
import FormSection from '../components/FormSection';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import AssociatedBrandsManager from '../components/AssociatedBrandsManager';

interface SupplierFormData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
 marcasTrabalhadas: string[];
    dataCadastro: string;
}

interface Marca {
  id: string;
  nome: string;
}

const initialFormData: SupplierFormData = {
  razaoSocial: '', nomeFantasia: '', cnpj: '', inscricaoEstadual: '', telefone: '', email: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '', complemento: '',
  marcasTrabalhadas: [],
  dataCadastro: new Date().toISOString().split('T')[0],
};

const AddSupplierPage = () => {
  const [formData, setFormData] = useState<SupplierFormData>(initialFormData);
  const [allBrands, setAllBrands] = useState<Marca[]>([]); 

  useEffect(() => {
    const fetchBrands = async () => {
      const mockBrands: Marca[] = [
        { id: 'uuid-brand-1', nome: 'Ray-Ban' },
        { id: 'uuid-brand-2', nome: 'Oakley' },
        { id: 'uuid-brand-3', nome: 'Prada' },
        { id: 'uuid-brand-4', nome: 'Vogue' },
        { id: 'uuid-brand-5', nome: 'Essilor' },
        { id: 'uuid-brand-6', nome: 'Hoya' },
      ];
      setAllBrands(mockBrands);
    };
    fetchBrands();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do Fornecedor para Enviar:', formData);
    alert('Fornecedor cadastrado com sucesso! (Verifique o console)');
  };

  const handleBrandChange = (selectedIds: string[]) => {
    setFormData(prev => ({ ...prev, marcasTrabalhadas: selectedIds }));
  };

  return (
    <div className="w-full">
      <HeaderTitlePage page_name="Novo Fornecedor"/>
      
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
                <div className="md:col-span-4">
                    <InputField label="Data do Cadastro" name="dataCadastro" type="date" value={formData.dataCadastro} onChange={handleChange} readOnly />
                </div>
            </FormSection>
            
            <SaveCancelButtonsArea textButton1='Cancelar' textButton2='Cadastrar' cancelButtonPath='/fornecedores' />
        </form>
      </div>
    </div>
  );
};

export default AddSupplierPage;