import { PlusCircle } from "lucide-react";
import Header from "../components/Header";
import HeaderTitlePage from "../components/HeaderTitlePage";
import Sidebar from "../components/Sidebar";
import PrimaryButton from "../components/ui/PrimaryButton";
import ReceituarioMedidas from "../components/ReceituarioMedidas";
import ReceituarioInfoArea from "../components/ReceituarioInfoArea";
import TextBoxInput from "../components/TextBoxInput";

function NovaVenda() {

  return (
    <div className="w-full h-screen overflow-hidden" >
        <Header />
        <div className="w-full flex h-full">
          <Sidebar />
          <div className="flex flex-1 flex-col w-fit box-border">
            <HeaderTitlePage page_name="Nova venda"/>
            <div className="w-full flex flex-1 flex-col p-4 box-border">
                
                {/* Div para Cliente e ordem de servico */}
                <div className="flex divide-x divide-gray-200 border-y-1 border-gray-200">                    
                    {/* Cliente */}
                    <div className="w-2/3 p-4">
                    <h2 className="text-lg font-semibold text-gray-800 pb-2 mb-3 border-b border-gray-200">
                        Cliente
                    </h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou CPF..."
                            className="
                                flex-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md
                                text-sm text-gray-700 placeholder-gray-400
                                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                            "
                        />
                        <PrimaryButton title="Cadastrar" icon={<PlusCircle size={18} />} />
                    </div>
                    </div>
                    
                    {/* Ordem de servico */}
                    <div className="w-1/3 p-4">
                    <h2 className="text-lg font-semibold text-gray-800 pb-2 mb-3 border-b border-gray-200">
                        Ordem de serviço
                    </h2>
                    <input
                        type="text"
                        placeholder="O.S"
                        className="
                            block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md
                            text-sm text-gray-700 placeholder-gray-400
                            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        "
                    />
                    </div>
                </div>
                <div className="flex w-full border-b border-gray-200 gap-1 divide-x-1 divide-gray-200">
                    {/* Receituario e medidas */}
                    <div className="flex flex-col w-2/3  gap-1" >
                        <ReceituarioMedidas />
                        <ReceituarioInfoArea />
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
          </div>          
        </div>
    </div>
  )
}

export default NovaVenda;