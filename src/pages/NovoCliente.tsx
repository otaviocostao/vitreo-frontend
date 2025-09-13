import React, { useState } from 'react';
import FormSection from '../components/FormSection';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import TextareaField from '../components/ui/TextareaField';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SaveCancelButtonsArea from '../components/SaveCancelButtonsArea';

const RegisterClientPage = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '', cpf: '', rg: '', genero: '', nascimento: '', naturalidade: '',
    logradouro: '', numero: '', bairro: '', complemento: '', cidade: '', estado: '', cep: '',
    telefone: '', telSecundario: '', email: '',
    observacoes: '', dataCadastro: '', ultimaCompra: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    alert('Cliente cadastrado com sucesso! (Verifique o console)');
  };

  return (
    <div className="flex flex-1 flex-col w-full box-border">
      <HeaderTitlePage page_name="Novo cliente"/>
      <div className="w-full flex flex-1 flex-col p-4 box-border">
          <form onSubmit={handleSubmit}>
            <FormSection title="Dados pessoais">
              <InputField label="Nome completo" id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="Digite o nome completo do cliente..." className="md:col-span-6" />
              <InputField label="CPF" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="md:col-span-3" />
              <InputField label="RG" id="rg" name="rg" value={formData.rg} onChange={handleChange} placeholder="00.000.000-0" className="md:col-span-3" />

              <SelectField label="Gênero" id="genero" name="genero" value={formData.genero} onChange={handleChange} options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }, { value: 'O', label: 'Outro' }]} className="md:col-span-4" />
              <InputField label="Nascimento" id="nascimento" name="nascimento" type="date" value={formData.nascimento} onChange={handleChange} placeholder="dd/mm/aaaa" className="md:col-span-4" />
              <InputField label="Naturalidade" id="naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} placeholder="Naturalidade do cliente..." className="md:col-span-4" />
            </FormSection>

            <FormSection title="Endereço">
              <InputField label="Logradouro" id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} placeholder="Endereço do cliente..." className="md:col-span-5" />
              <InputField label="Número" id="numero" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número..." className="md:col-span-2" />
              <InputField label="Bairro" id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro..." className="md:col-span-5" />
              
              <InputField label="Complemento" id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Complemento..." className="md:col-span-12" />
              
              <InputField label="Cidade" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade do cliente..." className="md:col-span-5" />
              <InputField label="Estado" id="estado" name="estado" value={formData.estado} onChange={handleChange} placeholder="Estado..." className="md:col-span-4" />
              <InputField label="CEP" id="cep" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" className="md:col-span-3" />
            </FormSection>

            <FormSection title="Informações de contato">
              <InputField label="Telefone" id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="(99) 99999-9999" className="md:col-span-4" />
              <InputField label="Tel. secundário" id="telSecundario" name="telSecundario" type="tel" value={formData.telSecundario} onChange={handleChange} placeholder="(99) 99999-9999" className="md:col-span-4" />
              <InputField label="E-mail (opcional)" id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: john@mail.com" className="md:col-span-4" />
            </FormSection>

            <FormSection title="Informações adicionais">
              <TextareaField label="Observações" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} className="md:col-span-8" />
              

              <div className="md:col-span-4 flex flex-col gap-5">
                <InputField label="D. Cadastro" id="dataCadastro" name="dataCadastro" type="date" value={formData.dataCadastro} onChange={handleChange} placeholder="dd/mm/aaaa" />
                {/* <Button variant='secondary' className='w-35'>Última compra</Button> */}
              </div>
            </FormSection>

            <SaveCancelButtonsArea textButton1='Cancelar' textButton2='Cadastrar' />
          </form>
      </div>
    </div>
  );
};

export default RegisterClientPage;