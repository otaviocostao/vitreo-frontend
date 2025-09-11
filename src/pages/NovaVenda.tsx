import { PlusCircle } from "lucide-react";
import HeaderTitlePage from "../components/HeaderTitlePage";
import ReceituarioMedidas from "../components/ReceituarioMedidas";
import ReceituarioInfoArea from "../components/ReceituarioInfoArea";
import VendaPagamento from "../components/VendaPagamento";
import Button from "../components/ui/Button";
import InfoSection from "../components/InfoSection";
import InputField from "../components/ui/InputField";
import SaveCancelButtonsArea from "../components/SaveCancelButtonsArea";

function NovaVenda() {

  return (
    <div className="flex flex-col w-fit box-border">
        <HeaderTitlePage page_name="Nova venda"/>
        <div className="w-full flex flex-1 flex-col p-4 box-border">
                
            {/* Div para Cliente e ordem de servico */}
            <div className="flex divide-x divide-gray-200 border-y border-gray-200 bg-white">
                <InfoSection title="Cliente" className="w-2/3">
                    <div className="flex items-end gap-2">
                        <InputField
                            id="client-search"
                            type="text"
                            placeholder="Buscar por nome ou CPF..."
                            className="flex-1" 
                            labelClassName="sr-only" 
                        />
                        <Button variant="primary">
                            <PlusCircle size={18} />
                            <span>Cadastrar</span>
                        </Button>
                    </div>
                </InfoSection>

                <InfoSection title="Ordem de serviço" className="w-1/3">
                    <div className="flex items-end"> 
                        <InputField
                            id="os-number"
                            type="text"
                            placeholder="O.S"
                            className="w-24"
                            labelClassName="sr-only"
                        />
                    </div>
                </InfoSection>
            </div>
            <div className="flex w-full border-b border-gray-200 divide-x-1 divide-gray-200">
                {/* Receituario e medidas */}
                <div className="flex flex-col w-2/3 " >
                    <ReceituarioMedidas />
                    <ReceituarioInfoArea />
                </div>
                <div className="flex flex-col w-1/3">
                    <VendaPagamento />
                </div>
            </div>
                <SaveCancelButtonsArea textButton1='Cancelar' textButton2='Finalizar Venda' />
            </div>
        </div>          

  )
}

export default NovaVenda;