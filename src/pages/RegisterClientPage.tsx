import React, { useState } from 'react';
import FormSection from '../components/FormSection';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import TextareaField from '../components/ui/TextareaField';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';
import type { ClientePayload } from '../types/cliente';
import { createCliente } from '../services/clienteService';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';

const RegisterClientPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '', sobrenome: '', cpf: '', rg: '', genero: '', nascimento: '', naturalidade: '',
    logradouro: '', numero: '', bairro: '', complemento: '', cidade: '', estado: '', cep: '',
    telefone: '', telSecundario: '', email: '',
    observacoes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const clientePayload: ClientePayload = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      cpf: formData.cpf,
      dataNascimento: formData.nascimento,
      email: formData.email,
      telefone: formData.telefone,
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
      await createCliente(clientePayload);
      navigate('/clientes');
    } catch (err) {
      setError('Falha ao cadastrar o cliente. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full box-border">
      <HeaderTitlePage page_name="Novo cliente"/>
      <div className="w-full flex flex-1 flex-col p-4 box-border">
          <form onSubmit={handleSubmit}>
            <FormSection title="Dados pessoais">
              <InputField label="Nome" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite o nome do cliente..." className="md:col-span-4" />
              <InputField label="Sobrenome" id="sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} placeholder="Digite o sobrenome do cliente..." className="md:col-span-4" />
              <InputField label="CPF" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="md:col-span-2" />
              <InputField label="RG" id="rg" name="rg" value={formData.rg} onChange={handleChange} placeholder="00.000.000-0" className="md:col-span-2" />

              <SelectField label="Gênero" id="genero" name="genero" value={formData.genero} onChange={handleChange} options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }, { value: 'O', label: 'Outro' }]} className="md:col-span-2" />
              <InputField label="Nascimento" id="nascimento" name="nascimento" type="date" value={formData.nascimento} onChange={handleChange} placeholder="dd/mm/aaaa" className="md:col-span-2" />
              <InputField label="Naturalidade" id="naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} placeholder="Naturalidade do cliente..." className="md:col-span-4" />
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

            <FormSection title="Informações de contato">
              <InputField label="Telefone" id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="(99) 99999-9999" className="md:col-span-4" />
              <InputField label="Tel. secundário" id="telSecundario" name="telSecundario" type="tel" value={formData.telSecundario} onChange={handleChange} placeholder="(99) 99999-9999" className="md:col-span-4" />
              <InputField label="E-mail (opcional)" id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: john@mail.com" className="md:col-span-4" />
            </FormSection>

            <FormSection title="Informações adicionais">
              <TextareaField label="Observações" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} className="md:col-span-8" />
              

              <div className="md:col-span-4 flex flex-col gap-5">
                {/* <InputField label="D. Cadastro" id="dataCadastro" name="dataCadastro" type="date" value={formData.dataCadastro} onChange={handleChange} placeholder="dd/mm/aaaa" /> */}
                {/* <Button variant='secondary' className='w-35'>Última compra</Button> */}
              </div>
            </FormSection>

            <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath='/clientes' textButton2={isLoading ? 'Cadastrando...' : 'Cadastrar'} />
          </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default RegisterClientPage;