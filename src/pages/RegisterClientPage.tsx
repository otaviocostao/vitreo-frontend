import React, { useEffect, useState } from 'react';
import FormSection from '../components/FormSection';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import TextareaField from '../components/ui/TextareaField';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import type { CustomerPayload } from '../types/customer';
import { createCliente, getClienteById, updateCliente } from '../services/clienteService';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import { formatCPF } from '../lib/utils';
import { formatZipCode, formatPhone } from '../helpers/formatters';

const initialFormData = {
  nome: '', sobrenome: '', cpf: '', rg: '', genero: '', dataNascimento: '', naturalidade: '',
  logradouro: '', numero: '', bairro: '', complemento: '', cidade: '', estado: '', cep: '',
  telefone: '', telefoneSecundario: '', email: '',
  observacoes: '',
};

const RegisterClientPage = () => {
  const { id: clientId } = useParams<{ id: string }>();
  const isEditMode = !!clientId;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(initialFormData);
  const [initialLoadedData, setInitialLoadedData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'cpf') {
      processedValue = formatCPF(value);
    } else if (name === 'cep') {
      processedValue = formatZipCode(value);
    } else if (name === 'telefone' || name === 'telefoneSecundario') {
      processedValue = formatPhone(value);
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  useEffect(() => {
    const loadPageData = async () => {
      setError(null);
      try {
        if (isEditMode && clientId) {
          const clientData = await getClienteById(clientId);

          const flattenedData = {
            nome: clientData.firstName || '',
            sobrenome: clientData.lastName || '',
            cpf: formatCPF(clientData.cpf || ''),
            rg: clientData.rg || '',
            dataNascimento: clientData.birthDate || '',
            genero: clientData.gender || '',
            naturalidade: clientData.naturality || '',
            telefone: formatPhone(clientData.phone || ''),
            telefoneSecundario: formatPhone(clientData.secondaryPhone || ''),
            email: clientData.email || '',
            observacoes: clientData.observations || '',
            logradouro: clientData.street || '',
            numero: clientData.number || '',
            bairro: clientData.neighborhood || '',
            complemento: clientData.complement || '',
            cidade: clientData.city || '',
            estado: clientData.state || '',
            cep: formatZipCode(clientData.zipCode || ''),
          };
          setFormData(flattenedData);
          setInitialLoadedData(flattenedData);
        }
      } catch (err) {
        setError("Falha ao carregar os dados. Verifique a conexão e tente novamente.");
        console.error(err);
      }
    };
    loadPageData();
  }, [clientId, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cleanedCpf = formData.cpf.replace(/[^\d]/g, '');
    const cleanedRg = formData.rg.replace(/[^\d]/g, '');
    const cleanedTelefone = formData.telefone.replace(/[^\d]/g, '');
    const cleanedTelefoneSecundario = formData.telefoneSecundario.replace(/[^\d]/g, '');
    const cleanedCep = formData.cep.replace(/[^\d]/g, '');

    const customerPayload: CustomerPayload = {
      firstName: formData.nome,
      lastName: formData.sobrenome,
      cpf: cleanedCpf || undefined,
      rg: cleanedRg || undefined,
      birthDate: formData.dataNascimento || undefined,
      gender: formData.genero || undefined,
      naturality: formData.naturalidade || undefined,
      email: formData.email || undefined,
      phone: cleanedTelefone || undefined,
      secondaryPhone: cleanedTelefoneSecundario || undefined,
      street: formData.logradouro || '',
      number: formData.numero || '',
      neighborhood: formData.bairro || '',
      complement: formData.complemento || '',
      city: formData.cidade || '',
      state: formData.estado || '',
      zipCode: cleanedCep || '',
      observations: formData.observacoes || undefined
    };

    try {
      if (isEditMode && clientId) {
        await updateCliente(clientId, customerPayload);
      } else {
        await createCliente(customerPayload);
      }

      navigate('/clientes');
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).join(', ');
        setError(`Falha ao cadastrar: ${errorMessages}`);
      } else {
        setError('Falha ao cadastrar o cliente...');
      }
    } finally {
      setIsLoading(false);
    }
  };

          const isFormEmpty = (data: typeof initialFormData) => {
            return Object.values(data).every(val => val === '');
          };

          const isFormUnchanged = (current: typeof initialFormData, initial: typeof initialFormData) => {
            return Object.keys(current).every(key => current[key as keyof typeof initialFormData] === initial[key as keyof typeof initialFormData]);
          };

          const isSaveDisabled = isEditMode
            ? isFormUnchanged(formData, initialLoadedData)
            : isFormEmpty(formData);

          return (
            <div className="flex flex-1 flex-col w-full box-border">
              <HeaderTitlePage page_name={isEditMode ? "Editar dados do client" : "Cadastrar novo cliente"} />
              <div className="w-full flex flex-1 flex-col p-4 box-border">
                <form onSubmit={handleSubmit}>
                  <FormSection title="Dados pessoais">
                    <InputField label="Nome *" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite o nome do cliente..." className="md:col-span-4" required />
                    <InputField label="Sobrenome *" id="sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} placeholder="Digite o sobrenome do cliente..." className="md:col-span-4" required />
                    <InputField label="CPF" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="md:col-span-2" />
                    <InputField label="RG" id="rg" name="rg" value={formData.rg} onChange={handleChange} placeholder="00.000.000-00" className="md:col-span-2" />
                    <SelectField label="Gênero" id="genero" name="genero" value={formData.genero} onChange={handleChange} options={[{ value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }, { value: 'outro', label: 'Outro' }]} className="md:col-span-2" />
                    <InputField label="Nascimento" id="nascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} placeholder="dd/mm/aaaa" className="md:col-span-2" />
                    <InputField label="Naturalidade" id="naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} placeholder="Naturalidade do cliente..." className="md:col-span-3" />
                  </FormSection>

                  <FormSection title="Endereço">
                    <InputField label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} className="md:col-span-5" />
                    <InputField label="Número" name="numero" value={formData.numero} onChange={handleChange} className="md:col-span-2" />
                    <InputField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} className="md:col-span-3" />
                    <InputField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} className="md:col-span-3" />
                    <InputField label="Estado" name="estado" value={formData.estado} onChange={handleChange} className="md:col-span-3" />
                    <InputField label="CEP" name="cep" value={formData.cep} onChange={handleChange} className="md:col-span-3" placeholder="00000-000" />
                    <InputField label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} className="md:col-span-9" />
                  </FormSection>

                  <FormSection title="Informações de contato">
                    <InputField label="Telefone" id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="(99) 99999-9999" className="md:col-span-4" />
                    <InputField label="Tel. secundário" id="telSecundario" name="telefoneSecundario" type="tel" value={formData.telefoneSecundario} onChange={handleChange} placeholder="(99) 99999-9999" className="md:col-span-4" />
                    <InputField label="E-mail (opcional)" id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: joao@email.com" className="md:col-span-4" />
                  </FormSection>

                  <FormSection title="Informações adicionais">
                    <TextareaField label="Observações" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} className="md:col-span-8" />


                    <div className="md:col-span-4 flex flex-col gap-5">
                      {/* <InputField label="D. Cadastro" id="dataCadastro" name="dataCadastro" type="date" value={formData.dataCadastro} onChange={handleChange} placeholder="dd/mm/aaaa" /> */}
                      {/* <Button variant='secondary' className='w-35'>Última compra</Button> */}
                    </div>
                  </FormSection>

                  <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath='/clientes' textButton2={isEditMode ? 'Salvar alterações' : 'Cadastrar'} isLoading={isLoading} isSaveDisabled={isSaveDisabled} />
                </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default RegisterClientPage;