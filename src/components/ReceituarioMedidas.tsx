import StyledInput from './ui/StyledInput';
import MedidaInput from './ui/MedidaInput';

const ReceituarioMedidas = () => {

    return (
        <div className="flex w-2/3 divide-x divide-gray-200">
            {/* Receita */}
            <div className="w-2/3 p-4">
                <h2 className="text-lg font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200">
                    Receita
                </h2>

                <div className="grid grid-cols-4 items-center gap-x-5 gap-y-3">
                    
                <div /> 
                        <span className="font-normal text-gray-700 text-sm text-center">
                            Esférico
                        </span>
                        <span className="font-normal text-gray-700 text-sm text-center">
                            Cilíndrico
                        </span>
                        <span className="font-normal text-gray-700 text-sm text-center">
                            Eixo
                        </span>

                    <label className="font-normal text-gray-700 text-sm">OD:</label>
                    <StyledInput />
                    <StyledInput />
                    <StyledInput />
                    <label className="font-normal text-gray-700 text-sm">OE:</label>
                    <StyledInput />
                    <StyledInput />
                    <StyledInput />
                    <label className="font-normal text-gray-700 text-sm">AD:</label>
                    <StyledInput />
                </div>
            </div>

            {/* Seção Medidas */}
            <div className="w-1/3 p-4">
                <h2 className="text-lg font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200">
                    Medidas
                </h2>

                <div className="flex gap-8">
                    <div className="flex flex-1 flex-col gap-3">
                        <MedidaInput label="COD" />
                        <MedidaInput label="DNPD" />
                        <MedidaInput label="DP" />
                        <MedidaInput label="AM" />
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                        <MedidaInput label="COE" />
                        <MedidaInput label="DNPE" />
                        <MedidaInput label="AV" />
                        <MedidaInput label="PA" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceituarioMedidas;