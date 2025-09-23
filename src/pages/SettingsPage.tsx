import { useState } from "react";
import FormSection from "../components/FormSection";
import HeaderTitlePage from "../components/HeaderTitlePage";
import InputField from "../components/ui/InputField";
import SaveCancelButtonsArea from "../components/SaveCancelButtonsArea";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Dados de configurações para Enviar:', formData);
    };
  
  return (
    <div className="flex flex-1 flex-col w-full box-border">
        <HeaderTitlePage page_name="Ajustes"/>
        <div className="p-4">
          <form onSubmit={handleSubmit}>

              <FormSection title="Dados da empresa">
                  <InputField label="Razão social" id="razao_social" name="razao_social" placeholder="Digite a razão social da empresa..." className="md:col-span-6" />
                  <InputField label="Nome fantasia" id="razao_social" name="razao_social" placeholder="Digite o nome fantasia da empresa..." className="md:col-span-6" />

                  <InputField label="CNPJ" id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" className="md:col-span-6" />

                  <InputField label="Inscrição Estadual" id="incricao_estadual" name="incricao_estadual" placeholder="Digite a inscrição estadual da empresa..." className="md:col-span-6" />

                  <InputField label="Telefone Celular" id="celular" name="celular" type="tel" placeholder="(99) 99999-9999" className="md:col-span-4" />
                  
                  <InputField label="Telefone Fixo" id="telefone" name="telefone" type="tel" placeholder="(99) 99999-9999" className="md:col-span-4" />
                  
                  <InputField label="E-mail" id="email" name="email" type="email" placeholder="Ex: example@email.com" className="md:col-span-4" />
                  

              </FormSection>
              <FormSection title="Endereço da empresa">
                  <InputField label="Logradouro" placeholder="Digite o logradouro..." name="logradouro" className="md:col-span-8" />
                  <InputField label="Número" placeholder="Num..." name="numero" className="md:col-span-1" />
                  <InputField label="Bairro" placeholder="Digite o bairro..." name="bairro" className="md:col-span-4" />
                  <InputField label="Cidade" placeholder="Digite a cidade..." name="cidade" className="md:col-span-4" />
                  <InputField label="Estado" placeholder="Digite o estado..." name="estado" className="md:col-span-4" />
                  <InputField label="CEP" name="cep" className="md:col-span-3" placeholder="00000-000" />
                  <InputField label="Complemento" placeholder="Digite o complemento do endereço..." name="complemento" className="md:col-span-9" />
              </FormSection>
            <SaveCancelButtonsArea textButton1="Cancelar" textButton2="Salvar" cancelButtonPath="/"/>
          </form>
        </div>
    </div>
  );
};

export default Home;