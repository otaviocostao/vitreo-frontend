import React, { useState, type KeyboardEvent } from 'react';
import { PlusCircle, Trash2, Tag } from 'lucide-react';
import InputField from './ui/InputField';
import Button from './ui/Button';



interface AssociatedBrandsManagerProps {
  selectedBrands: string[]; 
  onChange: (newBrands: string[]) => void; 
}

const AssociatedBrandsManager: React.FC<AssociatedBrandsManagerProps> = ({ selectedBrands, onChange }) => {

  const [currentBrand, setCurrentBrand] = useState<string>('');

  const handleAddBrand = () => {
    const brandToAdd = currentBrand.trim();

    if (!brandToAdd || selectedBrands.some(brand => brand.toLowerCase() === brandToAdd.toLowerCase())) {
      setCurrentBrand(''); 
      return;
    }

    onChange([...selectedBrands, brandToAdd]);
    
    setCurrentBrand('');
  };

  const handleRemoveBrand = (brandToRemove: string) => {
    onChange(selectedBrands.filter(brand => brand !== brandToRemove));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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
            value={currentBrand}
            onChange={(e) => setCurrentBrand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Ray-Ban"
          />
        </div>
        <Button onClick={handleAddBrand} disabled={!currentBrand.trim()}>
          <PlusCircle size={16} />
        </Button>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Marcas Associadas:</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {selectedBrands.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhuma marca associada.</p>
          ) : (
            selectedBrands.map((brand, index) => (
              <div key={`${brand}-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-md animate-in fade-in-0 duration-300">
                <div className="flex items-center gap-3">
                  <Tag size={16} className="text-gray-500" />
                  <p className="font-medium text-sm text-gray-800">{brand}</p>
                </div>
                <button onClick={() => handleRemoveBrand(brand)} className="text-gray-400 hover:text-red-500 transition-colors">
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