import React, { useEffect, useState } from 'react';
import FormSection from '../components/FormSection';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import TextareaField from '../components/ui/TextareaField';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import type { ClientePayload } from '../types/cliente';
import { createCliente, getClienteById, updateCliente } from '../services/clienteService';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';

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
  const [isFetching, setIsFetching] = useState(isEditMode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect (() => {
    const loadPageData = async () => {
      setIsFetching(true);
      setError(null);
      try{
        if(isEditMode && clientId){
          const clientData = await getClienteById(clientId)

          const endereco = clientData.endereco ?? {};

          const flattenedData = {
            nome: clientData.nome, 
            sobrenome: clientData.sobrenome, 
            cpf: clientData.cpf || '', 
            rg: clientData.rg || '',
            dataNascimento: clientData.dataNascimento || '',
            genero: clientData.genero || '',
            naturalidade: clientData.naturalidade || '', 
            telefone: clientData.telefone || '',
            telefoneSecundario: clientData.telefoneSecundario || '',
            email: clientData.email || '',
            observacoes: clientData.observacoes || '',
            logradouro: endereco.logradouro || '',
            numero: endereco.numero || '',
            bairro: endereco.bairro || '',
            complemento: endereco.complemento || '',
            cidade: endereco.cidade || '',
            estado: endereco.estado || '',  
            cep: endereco.cep || '',
          }
            setFormData(flattenedData);
        }
      }catch (err) {
        setError("Falha ao carregar os dados. Verifique a conexão e tente novamente.");
        console.error(err);
      } finally {
        setIsFetching(false);
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

    const clientePayload: ClientePayload = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      cpf: cleanedCpf || undefined,
      rg: cleanedRg || undefined,
      dataNascimento: formData.dataNascimento || undefined,
      genero: formData.genero || undefined,
      naturalidade: formData.naturalidade || undefined,
      email: formData.email || undefined,
      telefone: cleanedTelefone || undefined,
      telefoneSecundario: formData.telefoneSecundario || undefined,
      endereco: {
        logradouro: formData.logradouro || undefined,
        numero: formData.numero || undefined,
        bairro: formData.bairro || undefined,
        complemento: formData.complemento || undefined,
        cidade: formData.cidade || undefined,
        estado: formData.estado || undefined,
        cep: formData.cep || undefined,
      },
      observacoes: formData.observacoes || undefined
    };

    try {
      if(isEditMode && clientId){
        await updateCliente(clientId, clientePayload);
      }else{
        await createCliente(clientePayload);
      }
      
      navigate('/clientes');
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).join(', ');
        setError(`Falha ao cadastrar: ${errorMessages}`);
      } else {
        setError('Falha ao cadastrar o cliente...');
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full box-border">
      <HeaderTitlePage page_name={isEditMode ? "Editar dados do cliente" : "Cadastrar novo cliente"}/>
      <div className="w-full flex flex-1 flex-col p-4 box-border">
          <form onSubmit={handleSubmit}>
            <FormSection title="Dados pessoais">
              <InputField label="Nome" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite o nome do cliente..." className="md:col-span-4" />
              <InputField label="Sobrenome" id="sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} placeholder="Digite o sobrenome do cliente..." className="md:col-span-4" />
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

            <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath='/clientes' textButton2={isEditMode ? 'Salvar alterações' : 'Cadastrar'} isLoading={isLoading} />
          </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default RegisterClientPage;