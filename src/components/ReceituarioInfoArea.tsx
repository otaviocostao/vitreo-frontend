import TextareaField from './ui/TextareaField';
import InputField from './ui/InputField';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import AddProductModal, { type NewProductFormData } from './AddProductModal';
import InputWithButton from './ui/InputWithButton';

function ReceituarioInfoArea() {

  const[isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saleData, setSaleData] = useState({ ref_armacao: '', lentes: '' });

  const handleOpenAddModal = () => setIsAddModalOpen(true);

  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleProductCreated = (newProduct: NewProductFormData) => {
    console.log('Produto criado no modal:', newProduct);
    setSaleData(prev => ({ ...prev, ref_armacao: newProduct.referencia || newProduct.nome }));
  };

  const handleProductSubmit = async (data: NewProductFormData) => {
    console.log("Enviando para a API:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    handleProductCreated(data);
  };


  return (
    <div className=" p-4 border-t border-gray-200">
      <h3 className="text-md font-semibold text-gray-700 mb-4">Informações Adicionais da Venda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <InputField
          id="medico"
          name="medico"
          label="Médico:"
          placeholder="Dr. Nome Sobrenome"
        />
        
        <InputWithButton
          label="Lentes:"
          id="lentes"
          name="lentes"
          placeholder="Busque ou cadastre as lentes..."
          value={saleData.lentes}
          onChange={(e) => setSaleData(prev => ({ ...prev, lentes: e.target.value }))}
          onButtonClick={handleOpenAddModal}
          buttonIcon={<PlusCircle size={20} />}
        />

        <InputField
          id="marca_armacao"
          name="marca_armacao"
          label="Marca da armação:"
          placeholder="Busque a marca da armação..."
        />

        <InputWithButton
          label="Referência da armação:"
          id="ref_armacao"
          name="ref_armacao"
          placeholder="Busque ou cadastre a referência..."
          value={saleData.ref_armacao}
          onChange={(e) => setSaleData(prev => ({ ...prev, ref_armacao: e.target.value }))}
          onButtonClick={handleOpenAddModal}
          buttonIcon={<PlusCircle size={20} />}
        />

        <div className="md:col-span-2 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
            <InputField
              id="data_pedido"
              name="data_pedido"
              label="Data do pedido"
              type="date"
            />
            <InputField
              id="previsao_entrega"
              name="previsao_entrega"
              label="Previsão de entrega"
              type="date"
            />
            <InputField
              id="data_entrega"
              name="data_entrega"
              label="Data de entrega"
              type="date"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <TextareaField
            id="observacoes"
            name="observacoes"
            label="Observações:"
            placeholder="Observações sobre o pedido..."
          />
        </div>
      </div>
      <AddProductModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSubmit={function (data: NewProductFormData): Promise<void> {
              throw new Error('Function not implemented.');
          } } suppliers={[]} brands={[]} />
    </div>
  );
}

export default ReceituarioInfoArea