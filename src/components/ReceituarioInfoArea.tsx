import LabelInput from './ui/LabelInput'
import DateInput from './ui/DateInput'
import TextBoxInput from './TextBoxInput'
import TextareaField from './ui/TextareaField';
import InputField from './ui/InputField';

function ReceituarioInfoArea() {
  return (
    // Container principal com um estilo consistente
    <div className="bg-white p-4 border-t border-gray-200">
      <h3 className="text-md font-semibold text-gray-700 mb-4">Informações Adicionais da Venda</h3>

      {/* 
        Usando um grid responsivo: 1 coluna em telas pequenas, 2 em médias e maiores.
        'gap-x-6' para espaçamento horizontal e 'gap-y-4' para vertical.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Campo do Médico */}
        <InputField
          id="medico"
          name="medico"
          label="Médico:"
          placeholder="Dr. Nome Sobrenome"
        />
        
        {/* Campo das Lentes */}
        <InputField
          id="lentes"
          name="lentes"
          label="Lentes:"
          placeholder="Busque o modelo das lentes..."
        />

        {/* Campo da Marca da Armação */}
        <InputField
          id="marca_armacao"
          name="marca_armacao"
          label="Marca da armação:"
          placeholder="Busque a marca da armação..."
        />

        {/* Campo da Referência da Armação */}
        <InputField
          id="ref_armacao"
          name="ref_armacao"
          label="Referência da armação:"
          placeholder="Busque a referência da armação..."
        />

        {/* Container para os campos de data, que ocupará a largura total */}
        <div className="md:col-span-2 mt-2">
          {/* Grid interno para alinhar os 3 campos de data */}
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
        
        {/* Campo de Observações, ocupando a largura total */}
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