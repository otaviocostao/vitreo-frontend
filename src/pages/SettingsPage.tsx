import { useState } from "react";
import FormSection from "../components/FormSection";
import HeaderTitlePage from "../components/HeaderTitlePage";
import InputField from "../components/ui/InputField";
import SaveCancelButtonsArea from "../components/SaveCancelButtonsArea";
import { formatZipCode, formatPhone } from "../helpers/formatters";
import { formatCNPJ } from "../lib/utils";
import { validateCNPJ, validatePhone, validateCEP } from "../lib/validators";
import ErrorPopup from "../components/ErrorPopup";

interface SettingsFormData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  celular: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
}

const initialFormData: SettingsFormData = {
  razaoSocial: '', nomeFantasia: '', cnpj: '', inscricaoEstadual: '', celular: '', telefone: '', email: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '', complemento: ''
};

const Home = () => {
  const [formData, setFormData] = useState<SettingsFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'cep') {
      processedValue = formatZipCode(value);
    } else if (name === 'celular' || name === 'telefone') {
      processedValue = formatPhone(value);
    } else if (name === 'cnpj') {
      processedValue = formatCNPJ(value);
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const validationErrors: Record<string, string> = {};
    if (!validateCNPJ(formData.cnpj)) {
      validationErrors.cnpj = 'CNPJ inválido';
    }
    if (!validateCEP(formData.cep)) {
      validationErrors.cep = 'CEP inválido';
    }
    if (!validatePhone(formData.celular)) {
      validationErrors.celular = 'Telefone inválido';
    }
    if (!validatePhone(formData.telefone)) {
      validationErrors.telefone = 'Telefone inválido';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setError('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    // Submit logic
    console.log("Saving settings:", formData);
  };

  return (
    <div className="flex flex-1 flex-col w-full box-border">
      <HeaderTitlePage page_name="Ajustes" />
      <div className="p-4">
        <form onSubmit={handleSubmit}>

          <FormSection title="Dados da empresa">
            <InputField 
              label="Razão social" 
              id="razaoSocial" 
              name="razaoSocial" 
              value={formData.razaoSocial}
              onChange={handleChange}
              placeholder="Digite a razão social da empresa..." 
              className="md:col-span-6" 
            />
            <InputField 
              label="Nome fantasia" 
              id="nomeFantasia" 
              name="nomeFantasia" 
              value={formData.nomeFantasia}
              onChange={handleChange}
              placeholder="Digite o nome fantasia da empresa..." 
              className="md:col-span-6" 
            />
            <InputField 
              label="CNPJ" 
              id="cnpj" 
              name="cnpj" 
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00" 
              className="md:col-span-6" 
              error={errors.cnpj}
            />
            <InputField 
              label="Inscrição Estadual" 
              id="inscricaoEstadual" 
              name="inscricaoEstadual" 
              value={formData.inscricaoEstadual}
              onChange={handleChange}
              placeholder="Digite a inscrição estadual da empresa..." 
              className="md:col-span-6" 
            />
            <InputField 
              label="Telefone Celular" 
              id="celular" 
              name="celular" 
              type="tel" 
              value={formData.celular} 
              onChange={handleChange} 
              placeholder="(99) 99999-9999" 
              className="md:col-span-4" 
              error={errors.celular}
            />
            <InputField 
              label="Telefone Fixo" 
              id="telefone" 
              name="telefone" 
              type="tel" 
              value={formData.telefone} 
              onChange={handleChange} 
              placeholder="(99) 99999-9999" 
              className="md:col-span-4" 
              error={errors.telefone}
            />
            <InputField 
              label="E-mail" 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: example@email.com" 
              className="md:col-span-4" 
            />
          </FormSection>

          <FormSection title="Endereço da empresa">
            <InputField 
              label="Logradouro" 
              placeholder="Digite o logradouro..." 
              name="logradouro" 
              value={formData.logradouro}
              onChange={handleChange}
              className="md:col-span-8" 
            />
            <InputField 
              label="Número" 
              placeholder="Num..." 
              name="numero" 
              value={formData.numero}
              onChange={handleChange}
              className="md:col-span-1" 
            />
            <InputField 
              label="Bairro" 
              placeholder="Digite o bairro..." 
              name="bairro" 
              value={formData.bairro}
              onChange={handleChange}
              className="md:col-span-4" 
            />
            <InputField 
              label="Cidade" 
              placeholder="Digite a cidade..." 
              name="cidade" 
              value={formData.cidade}
              onChange={handleChange}
              className="md:col-span-4" 
            />
            <InputField 
              label="Estado" 
              placeholder="Digite o estado..." 
              name="estado" 
              value={formData.estado}
              onChange={handleChange}
              className="md:col-span-4" 
            />
            <InputField 
              label="CEP" 
              name="cep" 
              value={formData.cep} 
              onChange={handleChange} 
              className="md:col-span-3" 
              placeholder="00000-000" 
              error={errors.cep}
            />
            <InputField 
              label="Complemento" 
              placeholder="Digite o complemento do endereço..." 
              name="complemento" 
              value={formData.complemento}
              onChange={handleChange}
              className="md:col-span-9" 
            />
          </FormSection>

          <SaveCancelButtonsArea textButton1="Cancelar" textButton2="Salvar" cancelButtonPath="/" />
        </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default Home;