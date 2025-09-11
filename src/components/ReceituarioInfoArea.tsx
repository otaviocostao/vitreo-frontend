import TextareaField from './ui/TextareaField';
import InputField from './ui/InputField';

function ReceituarioInfoArea() {
  return (
    <div className="bg-white p-4 border-t border-gray-200">
      <h3 className="text-md font-semibold text-gray-700 mb-4">Informações Adicionais da Venda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <InputField
          id="medico"
          name="medico"
          label="Médico:"
          placeholder="Dr. Nome Sobrenome"
        />
        
        <InputField
          id="lentes"
          name="lentes"
          label="Lentes:"
          placeholder="Busque o modelo das lentes..."
        />

        <InputField
          id="marca_armacao"
          name="marca_armacao"
          label="Marca da armação:"
          placeholder="Busque a marca da armação..."
        />

        <InputField
          id="ref_armacao"
          name="ref_armacao"
          label="Referência da armação:"
          placeholder="Busque a referência da armação..."
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
    </div>
  );
}

export default ReceituarioInfoArea