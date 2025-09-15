import React, { useState, useEffect } from 'react';

import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import Button from './ui/Button';

type ProductType = 'LENTE' | 'ARMACAO';

export interface NewProductFormData {
  tipoProduto: ProductType;
  fornecedorId: string;
  marcaId: string;
  nome: string;
  referencia: string;
  codigoBarras: string;
  custo: number | '';
  margemLucroPercentual: number | '';
  quantidadeEstoque: number | '';
  ativo: boolean;
  cor: string;
  materialArmacao: string;
  tamanho: string;
  materialLente: string;
  tratamento: string;
  tipoLente: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewProductFormData) => Promise<void>;
  suppliers: { id: string; name: string }[]; 
  brands: { id: string; name: string }[];
}

const initialFormData: NewProductFormData = {
  tipoProduto: 'ARMACAO',
  fornecedorId: '', marcaId: '', nome: '', referencia: '', codigoBarras: '',
  custo: '', margemLucroPercentual: '', quantidadeEstoque: '', ativo: true,
  cor: '', materialArmacao: '', tamanho: '',
  materialLente: '', tratamento: '', tipoLente: '',
};

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit, suppliers, brands }) => {
    const [formData, setFormData] = useState<NewProductFormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (isOpen) {
        setFormData(initialFormData);
        setError(null);
      }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const isCheckbox = type === 'checkbox';
      // @ts-ignore
      const isChecked = e.target.checked;

      setFormData(prev => ({
        ...prev,
        [name]: isCheckbox ? isChecked : value,
      }));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value as ProductType;
      setFormData({
        ...initialFormData, 
        tipoProduto: newType,
        fornecedorId: formData.fornecedorId,
        marcaId: formData.marcaId,
        nome: formData.nome,
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      try {
        await onSubmit(formData);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao salvar o produto.');
      } finally {
        setIsLoading(false);
      }
    };

    const productTypeOptions = [{ value: 'ARMACAO', label: 'Armação' }, { value: 'LENTE', label: 'Lente' }];
    const supplierOptions = suppliers.map(s => ({ value: s.id, label: s.name }));
    const brandOptions = brands.map(b => ({ value: b.id, label: b.name }));

  return (
    <div onClick={onClose} className="fixed inset-0 p-4 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
        <div onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl text-gray-800"
            >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Adicionar Novo Produto</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    <SelectField label="Tipo do Produto" name="tipoProduto" value={formData.tipoProduto} onChange={handleTypeChange} options={productTypeOptions} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField label="Fornecedor *" name="fornecedorId" value={formData.fornecedorId} onChange={handleChange} options={supplierOptions} />
                        <SelectField label="Marca" name="marcaId" value={formData.marcaId} onChange={handleChange} options={brandOptions} />
                    </div>
                    <InputField label="Nome / Descrição *" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Ray-Ban Aviator" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Referência" name="referencia" value={formData.referencia} onChange={handleChange} placeholder="Ex: RB3025" />
                        <InputField label="Código de Barras" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="789..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Custo (R$)" name="custo" type="number" value={formData.custo} onChange={handleChange} placeholder="0.00" />
                        <InputField label="Margem de Lucro (%)" name="margemLucroPercentual" type="number" value={formData.margemLucroPercentual} onChange={handleChange} placeholder="100" />
                        <InputField label="Estoque Inicial *" name="quantidadeEstoque" type="number" value={formData.quantidadeEstoque} onChange={handleChange} placeholder="0" />
                    </div>

                    {formData.tipoProduto === 'ARMACAO' && (
                        <div className="p-4 bg-gray-50 rounded-md space-y-4">
                            <h3 className="font-semibold text-gray-600">Detalhes da Armação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Cor" name="cor" value={formData.cor} onChange={handleChange} placeholder="Preto, Dourado..." />
                                <InputField label="Material" name="materialArmacao" value={formData.materialArmacao} onChange={handleChange} placeholder="Acetato, Metal..." />
                                <InputField label="Tamanho" name="tamanho" value={formData.tamanho} onChange={handleChange} placeholder="58-14-140" />
                            </div>
                        </div>
                    )}

                    {formData.tipoProduto === 'LENTE' && (
                        <div className="p-4 bg-gray-50 rounded-md space-y-4">
                            <h3 className="font-semibold text-gray-600">Detalhes da Lente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Material" name="materialLente" value={formData.materialLente} onChange={handleChange} placeholder="Poli, Orma..." />
                                <InputField label="Tratamento" name="tratamento" value={formData.tratamento} onChange={handleChange} placeholder="Antirreflexo, Blue Light..." />
                                <InputField label="Tipo da Lente" name="tipoLente" value={formData.tipoLente} onChange={handleChange} placeholder="Visão Simples, Multifocal..." />
                            </div>
                        </div>
                    )}
                </div>

                {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

                <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar Produto'}
                    </Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddProductModal;