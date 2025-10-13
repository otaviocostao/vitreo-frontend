import React, { useState, useEffect } from 'react';
import InputField from './ui/InputField';
import FormSection from './FormSection';
import TextareaField from './ui/TextareaField';
import Button from './ui/Button';
import SelectField from './ui/SelectField';
import { createCliente } from '../services/clienteService';
import type { ClientePayload } from '../types/cliente';
import ErrorPopup from './ErrorPopup';


interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void; 
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  
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


  useEffect(() => {
    if (isOpen) {
      setFormData(formData);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;


  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      const cleanedCpf = formData.cpf.replace(/[^\d]/g, '');
  
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
        onClose();
      } catch (err) {
        setError('Falha ao cadastrar o cliente. Verifique os dados e tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div onClick={onClose} className="fixed inset-0 p-4 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl text-gray-800"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Novo Cliente</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            <FormSection title="Dados pessoais">
                <InputField label="Nome *" name="nome" value={formData.nome} onChange={handleChange} className="md:col-span-12 lg:col-span-6" required />
                <InputField label="Sobrenome *" name="sobrenome" value={formData.sobrenome} onChange={handleChange} className="md:col-span-12 lg:col-span-6" required />
                <InputField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} className="md:col-span-6 lg:col-span-3" />
                <InputField label="RG" name="rg" value={formData.rg} onChange={handleChange} className="md:col-span-6 lg:col-span-3" />
                <SelectField label="Gênero" name="genero" value={formData.genero} onChange={handleChange} options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }, { value: 'O', label: 'Outro' }]} className="md:col-span-4" />
                <InputField label="Nascimento" name="nascimento" type="date" value={formData.nascimento} onChange={handleChange} className="md:col-span-4" />
                <InputField label="Naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} className="md:col-span-4" />
            </FormSection>

            <FormSection title="Endereço">
                <InputField label="CEP" name="cep" value={formData.cep} onChange={handleChange} className="md:col-span-4" />
                <InputField label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} className="md:col-span-8" />
                <InputField label="Número" name="numero" value={formData.numero} onChange={handleChange} className="md:col-span-3" />
                <InputField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} className="md:col-span-5" />
                <InputField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} className="md:col-span-4" />
                <InputField label="Estado" name="estado" value={formData.estado} onChange={handleChange} className="md:col-span-3" />
                <InputField label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} className="md:col-span-9" />
            </FormSection>

            <FormSection title="Informações de contato">
                <InputField label="Telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} className="md:col-span-4"/>
                <InputField label="Tel. secundário" name="telSecundario" type="tel" value={formData.telSecundario} onChange={handleChange} className="md:col-span-4" />
                <InputField label="E-mail (opcional)" name="email" type="email" value={formData.email} onChange={handleChange} className="md:col-span-4" />
            </FormSection>

            <FormSection title="Informações adicionais">
                <TextareaField label="Observações" name="observacoes" value={formData.observacoes} onChange={handleChange} className="md:col-span-8" id={''} />
            </FormSection>
          </div>
          {/* Botões de Ação */}
          <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default AddClientModal;