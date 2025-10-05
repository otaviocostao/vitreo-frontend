import React, { useState } from 'react';
import { PlusCircle, Tag, Trash2 } from 'lucide-react';
import { createMarca } from '../services/marcaService';
import type { MarcaResponse } from '../types/marca';
import InputField from './ui/InputField';
import Button from './ui/Button';

interface AssociatedBrandsManagerProps {
  selectedBrands: MarcaResponse[]; 
  onChange: (newBrands: MarcaResponse[]) => void; 
}

const AssociatedBrandsManager: React.FC<AssociatedBrandsManagerProps> = ({ selectedBrands, onChange }) => {
  const [newBrandName, setNewBrandName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddBrand = async () => {
    const brandName = newBrandName.trim();
    
    if (!brandName || selectedBrands.some(brand => brand.nome.toLowerCase() === brandName.toLowerCase())) {
      setNewBrandName('');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newMarca = await createMarca({ nome: brandName });
      
      onChange([...selectedBrands, newMarca]);
      
      setNewBrandName('');
    } catch (err) {
      setError(`Falha ao adicionar a marca "${brandName}". Ela já pode existir.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBrand = (brandIdToRemove: string) => {
    onChange(selectedBrands.filter(brand => brand.id !== brandIdToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      handleAddBrand();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <InputField
            label="Digite o nome da marca para adicionar"
            id="brand-input"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Ray-Ban"
          />
        </div>
        <Button onClick={handleAddBrand} disabled={!newBrandName.trim() || isLoading}>
          {isLoading ? 'Adicionando...' : <PlusCircle size={16} />}
        </Button>
      </div>
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Marcas Associadas:</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {selectedBrands.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhuma marca associada.</p>
          ) : (
            selectedBrands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Tag size={16} className="text-gray-500" />
                  <p className="font-medium text-sm text-gray-800">{brand.nome}</p>
                </div>
                <button onClick={() => handleRemoveBrand(brand.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociatedBrandsManager;