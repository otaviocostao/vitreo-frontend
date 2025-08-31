import LabelInput from './ui/LabelInput'
import DateInput from './ui/DateInput'
import TextBoxInput from './TextBoxInput'

function ReceituarioInfoArea() {
  return (
    <div className="flex flex-col border-gray-200 gap-2 box-border p-4 ">
        <LabelInput label={"Médico:"} placeholder='Dr.' />
        <LabelInput label={"Marca da armação:"} placeholder='Busque a marca da armação...' />
        <LabelInput label={"Referência da armação:"} placeholder='Busque a referência da armação...' />
        <LabelInput label={"Lentes:"} placeholder='Busque o modelo das lentes...' />
        <div className='flex justify-between'>
            <DateInput label='Data do pedido'/>
            <DateInput label='Previsão de entrega'/>
            <DateInput label='Data de entrega'/>
        </div>
        <TextBoxInput label="Observações:" placeholder="Observações sobre o pedido..."/>
    </div>
  )
}

export default ReceituarioInfoArea