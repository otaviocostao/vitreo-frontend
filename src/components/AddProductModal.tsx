import React, { useState, useEffect } from 'react';

import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import Button from './ui/Button';
import type { FornecedorOption, MarcaOption, ProdutoPayload, ProdutoResponse } from '../types/produto';
import { createProduct } from '../services/productService';
import { getFornecedoresOptions } from '../services/fornecedorService';
import { getMarcasOptions } from '../services/marcaService';
import ErrorPopup from './ErrorPopup';

type ProductType = 'LENTE' | 'ARMACAO';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (produto: ProdutoResponse) => void;
  initialType: ProductType;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit, initialType }) => {
    const [formData, setFormData] = useState({
      tipoProduto: initialType,
      fornecedorId: '', marcaId: '', nome: '', referencia: '', codigoBarras: '',
      custo: '', valorVenda: '', margemLucroPercentual: '', quantidadeEstoque: '', ativo: true,
      cor: '', material: '', tamanho: '',
      materialLente: '', tratamento: '', tipoLente: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fornecedores, setFornecedores] = useState<FornecedorOption[]>([]);
    const [marcas, setMarcas] = useState<MarcaOption[]>([]);
    
    
    useEffect(() => {
      const loadPageData = async () => {
        setError(null);
        
        try{
          const [fornecedoresData, marcasData] = await Promise.all([
            getFornecedoresOptions(),
            getMarcasOptions(),
          ]);
          setFormData(formData);
          setFornecedores(fornecedoresData);
          setMarcas(marcasData);
        }catch (err) {
        setError("Falha ao carregar os dados. Verifique a conexão e tente novamente.");
        console.error(err);
        }
      }
      loadPageData();
    }, []);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value as ProductType;
      setFormData({
        ...formData, 
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
      
      const productPayload: ProdutoPayload = {
        tipoProduto: formData.tipoProduto,
        fornecedorId: formData.fornecedorId,
        marcaId: formData.marcaId || undefined,
        nome: formData.nome,
        referencia: formData.referencia,
        codigoBarras: formData.codigoBarras,
        custo: formData.custo ? parseFloat(formData.custo.replace(',', '.')) : 0,
        valorVenda: formData.valorVenda ? parseFloat(formData.valorVenda.replace(',', '.')) : 0,
        margemLucroPercentual: formData.margemLucroPercentual ? parseFloat(formData.margemLucroPercentual.replace(',', '.')) : 0,
        quantidadeEstoque: formData.quantidadeEstoque ? parseInt(formData.quantidadeEstoque, 10) : 0,
        ativo: formData.ativo,
        cor: formData.cor,
        material: formData.material,
        tamanho: formData.tamanho,
        materialLente: formData.materialLente,
        tratamento: formData.tratamento,
        tipoLente: formData.tipoLente,
      };
  
      try {
        const novoProduto = await createProduct(productPayload);
        onSubmit(novoProduto)
        onClose();
      } catch (err) {
        setError('Falha ao cadastrar o produto. Verifique os dados e tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const productTypeOptions = [{ value: 'ARMACAO', label: 'Armação' }, { value: 'LENTE', label: 'Lente' }];
    const supplierOptions = fornecedores.map(f => ({ value: f.id, label: f.razaoSocial }));
    const brandOptions = marcas.map(m => ({ value: m.id, label: m.nome }));

  return (
    <div onClick={onClose} className="fixed inset-0 p-4 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
        <div onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl text-gray-800"
            >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Adicionar Novo Produto</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    <SelectField label="Tipo do Produto" name="tipoProduto" value={formData.tipoProduto} onChange={handleTypeChange} options={productTypeOptions} disabled />

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
                        <InputField label="Valor de venda (R$)" name="valorVenda" type="number" value={formData.valorVenda} onChange={handleChange} placeholder="0.00" />
                        <InputField label="Estoque Inicial *" name="quantidadeEstoque" type="number" value={formData.quantidadeEstoque} onChange={handleChange} placeholder="0" />
                    </div>

                    {formData.tipoProduto === 'ARMACAO' && (
                        <div className="p-4 bg-gray-50 rounded-md space-y-4">
                            <h3 className="font-semibold text-gray-600">Detalhes da Armação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Cor" name="cor" value={formData.cor} onChange={handleChange} placeholder="Preto, Dourado..." />
                                <InputField label="Material" name="material" value={formData.material} onChange={handleChange} placeholder="Acetato, Metal..." />
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
  )
}

export default AddProductModal;