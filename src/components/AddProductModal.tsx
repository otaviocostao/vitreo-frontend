import React, { useState, useEffect } from 'react';

import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import Button from './ui/Button';
import type { SupplierOption, BrandOption, ProductPayload, ProductResponse, ProductType } from '../types/product';
import { createProduct } from '../services/productService';
import { getFornecedoresOptions } from '../services/supplierService';
import { getMarcasOptions } from '../services/marcaService';
import ErrorPopup from './ErrorPopup';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductResponse) => void;
  initialType: ProductType;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit, initialType }) => {
  const [formData, setFormData] = useState({
    productType: initialType,
    supplierId: '', brandId: '', name: '', reference: '', barcode: '',
    cost: '', salePrice: '', profitMargin: '', stockQuantity: '', isActive: true,
    color: '', material: '', size: '',
    lensMaterial: '', treatment: '', lensType: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fornecedores, setFornecedores] = useState<SupplierOption[]>([]);
  const [marcas, setMarcas] = useState<BrandOption[]>([]);

  useEffect(() => {
    const loadPageData = async () => {
      setError(null);
      try {
        const [fornecedoresData, marcasData] = await Promise.all([
          getFornecedoresOptions(),
          getMarcasOptions(),
        ]);
        setFormData(prev => ({ ...prev, productType: initialType }));
        setFornecedores(fornecedoresData);
        setMarcas(marcasData);
      } catch (err) {
        setError("Falha ao carregar os dados. Verifique a conexão e tente novamente.");
        console.error(err);
      }
    };
    if (isOpen) {
      loadPageData();
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ProductType;
    setFormData(prev => ({
      ...prev,
      productType: newType,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const productPayload: ProductPayload = {
      productType: formData.productType,
      supplierId: formData.supplierId,
      brandId: formData.brandId || undefined,
      name: formData.name,
      reference: formData.reference,
      barcode: formData.barcode,
      cost: formData.cost ? parseFloat(formData.cost.replace(',', '.')) : 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice.replace(',', '.')) : 0,
      profitMargin: formData.profitMargin ? parseFloat(formData.profitMargin.replace(',', '.')) : 0,
      stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity, 10) : 0,
      isActive: formData.isActive,
      color: formData.color,
      material: formData.material,
      size: formData.size,
      lensMaterial: formData.lensMaterial,
      treatment: formData.treatment,
      lensType: formData.lensType,
    };

    try {
      const novoProduto = await createProduct(productPayload);
      onSubmit(novoProduto);
      onClose();
    } catch (err) {
      setError('Falha ao cadastrar o produto. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const productTypeOptions = [{ value: 'frame', label: 'Armação' }, { value: 'lens', label: 'Lente' }];
  const supplierOptions = fornecedores.map(f => ({ value: f.id, label: f.corporateName }));
  const brandOptions = marcas.map(m => ({ value: m.id, label: m.name }));

  return (
    <div onClick={onClose} className="fixed inset-0 p-4 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl text-gray-800"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Adicionar Novo Produto</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <SelectField label="Tipo do Produto" name="productType" value={formData.productType} onChange={handleTypeChange} options={productTypeOptions} disabled />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Fornecedor *" name="supplierId" value={formData.supplierId} onChange={handleChange} options={supplierOptions} required />
              <SelectField label="Marca" name="brandId" value={formData.brandId} onChange={handleChange} options={brandOptions} />
            </div>
            <InputField label="Nome / Descrição *" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Ray-Ban Aviator" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Referência" name="reference" value={formData.reference} onChange={handleChange} placeholder="Ex: RB3025" />
              <InputField label="Código de Barras" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="789..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Custo (R$)" name="cost" type="number" value={formData.cost} onChange={handleChange} placeholder="0.00" />
              <InputField label="Valor de venda (R$) *" name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} placeholder="0.00" required />
              <InputField label="Estoque Inicial" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} placeholder="0" />
            </div>

            {formData.productType === 'frame' && (
              <div className="p-4 bg-gray-50 rounded-md space-y-4">
                <h3 className="font-semibold text-gray-600">Detalhes da Armação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="Cor" name="color" value={formData.color} onChange={handleChange} placeholder="Preto, Dourado..." />
                  <InputField label="Material" name="material" value={formData.material} onChange={handleChange} placeholder="Acetato, Metal..." />
                  <InputField label="Tamanho" name="size" value={formData.size} onChange={handleChange} placeholder="58-14-140" />
                </div>
              </div>
            )}

            {formData.productType === 'lens' && (
              <div className="p-4 bg-gray-50 rounded-md space-y-4">
                <h3 className="font-semibold text-gray-600">Detalhes da Lente</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="Material" name="lensMaterial" value={formData.lensMaterial} onChange={handleChange} placeholder="Poli, Orma..." />
                  <InputField label="Tratamento" name="treatment" value={formData.treatment} onChange={handleChange} placeholder="Antirreflexo, Blue Light..." />
                  <InputField label="Tipo da Lente" name="lensType" value={formData.lensType} onChange={handleChange} placeholder="Visão Simples, Multifocal..." />
                </div>
              </div>
            )}
          </div>

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
      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default AddProductModal;