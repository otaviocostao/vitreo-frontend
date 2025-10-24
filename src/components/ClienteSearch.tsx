import React, { useState, useEffect } from 'react';
import { PlusCircle, User, X } from 'lucide-react';
import type { ClienteResponse } from '../types/cliente';
import { getClientes } from '../services/clienteService';
import SearchableSelectWithButton from './SearchableSelectWithButton';

interface ClienteSearchProps {
  selectedCliente: ClienteResponse | null;
  onClienteSelect: (cliente: ClienteResponse | null) => void;
  onOpenClientModal: () => void;
}

const ClienteSearch: React.FC<ClienteSearchProps> = ({
  selectedCliente,
  onClienteSelect,
  onOpenClientModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    if (searchTerm.length < 2) {
      setOptions([]);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await getClientes({ nome: searchTerm, size: 10 });
        const clientOptions = data.content.map(cliente => ({
          value: cliente.id,
          label: `${cliente.nomeCompleto} - ${cliente.cpf}`,
        }));
        setOptions(clientOptions);
      } catch (error) {
        console.error("Erro na busca de clientes:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleSelectChange = async (selectedOption: any) => {
    if (selectedOption) {
      const fullClientData = (await getClientes({ nome: selectedOption.label.split(' - ')[0], size: 1 })).content[0];
      onClienteSelect(fullClientData);
    } else {
      onClienteSelect(null);
    }
  };

  return (
    <div>
      {selectedCliente ? (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-3">
            <User className="text-blue-600" />
            <div className='flex gap-2'>
              <p className="font-semibold text-blue-800">{selectedCliente.nomeCompleto}</p>
              <p className="flex items-center text-xs text-gray-600">• CPF: {selectedCliente.cpf}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => onClienteSelect(null)} 
            className="text-gray-600 hover:text-red-600 cursor-pointer transition-discrete duration-200 text-xs"
          >
            <X />
          </button>
        </div>
      ) : (
        <SearchableSelectWithButton
          label=""
          options={options}
          value={null}
          onChange={handleSelectChange}
          onInputChange={(inputValue) => setSearchTerm(inputValue)}
          onButtonClick={onOpenClientModal}
          buttonIcon={<PlusCircle size={20} />}
          placeholder="Buscar por nome ou CPF..."
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ClienteSearch;