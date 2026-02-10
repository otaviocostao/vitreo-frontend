import StyledInput from './ui/StyledInput';
import MedidaInput from './ui/MedidaInput';
import type { ReceituarioPayload } from '../types/receituario';

interface ReceituarioMedidasProps {
  data: ReceituarioPayload;
  onChange: (newData: Partial<ReceituarioPayload>) => void;
}


const ReceituarioMedidas: React.FC<ReceituarioMedidasProps> = ({ data, onChange }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    return (
        <div className="flex w-full divide-x divide-gray-200">
            <div className="flex-1 p-4 flex justify-start">
                <div className="w-full max-w-xl">
                    <h2 className="text-lg font-semibold text-gray-800 pb-2 mb-4 border-gray-200">
                        Receita e medidas
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-[60%] divide-y divide-gray-200 border border-gray-200 text-sm">
                          <thead className="bg-gray-50 print:bg-gray-100 divide-y divide-gray-300">
                            <tr className='divide-x divide-gray-200'>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 w-1/6 divide-x divide-gray-200"></th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500 divide-x divide-gray-200">ESF</th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500">CIL</th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500">EIXO</th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500">DNP</th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500">CO</th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500">DP</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr className='divide-x divide-gray-200'>
                              <td className="px-4 py-2 font-medium text-gray-600 text-right">OD</td>
                              <td className="min-w-18 text-center text-gray-800 ">
                                <input type="text" name="esfericoOd" value={data.esfericoOd} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name="cilindricoOd" value={data.cilindricoOd} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name="eixoOd" value={data.eixoOd} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name='dnpOd' value={data.dnpOd} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name='centroOpticoOd' value={data.centroOpticoOd} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name='distanciaPupilar' value={data.distanciaPupilar} onChange={handleChange} className='w-full py-2 px-1 text-center'/>
                              </td>
                            </tr>
                            <tr className='divide-x divide-gray-200'>
                              <td className="px-4 py-2 font-medium text-gray-600 text-right">OE</td>
                              <td className="min-w-18 text-center text-gray-800 ">
                                <input type="text" name="esfericoOe" value={data.esfericoOe} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name="cilindricoOe" value={data.cilindricoOe} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name="eixoOe" value={data.eixoOe} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name='dnpOe' value={data.dnpOe} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name='centroOpticoOe' value={data.centroOpticoOe} onChange={handleChange} className='w-full py-2 px-1 text-center'/>
                              </td>
                              <td className="min-w-18 text-center text-gray-800">
                                <input type="text" name='distanciaPupilar' value={data.distanciaPupilar} disabled={true} onChange={handleChange} className='w-full py-2 px-1 text-center'/>
                              </td>
                              
                            </tr>
                            <tr className='divide-x divide-gray-200'>
                              <td className="px-4 py-2 font-medium text-gray-600 text-right">AD</td>
                              <td className="min-w-18 text-center text-gray-800 border-r-1 border-gray-200">
                                <input type="text" name="adicao" value={data.adicao} onChange={handleChange} className='w-full py-2 px-1 text-center '/>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    {/* <div className="space-y-3">
                        
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-3 pl-[3rem]"> 
                            <span className="font-normal text-gray-700 text-sm text-center">Esférico</span>
                            <span className="font-normal text-gray-700 text-sm text-center">Cilíndrico</span>
                            <span className="font-normal text-gray-700 text-sm text-center">Eixo</span>
                            <span className="font-normal text-gray-700 text-sm text-center">DNP</span>
                        </div>

                        <div className="flex items-center gap-x-3">
                            <label className="font-normal text-gray-700 text-sm w-10 text-right flex-shrink-0">OD:</label>
                            <div className="grid grid-cols-4 gap-x-3 w-full">
                                <StyledInput name="esfericoOd" value={data.esfericoOd} onChange={handleChange} step="0.25"/>
                                <StyledInput name="cilindricoOd" value={data.cilindricoOd} onChange={handleChange} step="0.25"/>
                                <StyledInput name="eixoOd" value={data.eixoOd} onChange={handleChange} step="1"/>
                                <StyledInput name='dnpOd' value={data.dnpOd} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex items-center gap-x-3">
                            <label className="font-normal text-gray-700 text-sm w-10 text-right flex-shrink-0">OE:</label>
                            <div className="grid grid-cols-4 gap-x-3 w-full">
                                <StyledInput name="esfericoOe" value={data.esfericoOe} onChange={handleChange} step="0.25" />
                                <StyledInput name="cilindricoOe" value={data.cilindricoOe} onChange={handleChange} step="0.25"/>
                                <StyledInput name="eixoOe" value={data.eixoOe} onChange={handleChange} step="1" />
                                <StyledInput name='dnpOe' value={data.dnpOe} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex items-center gap-x-3">
                            <label className="font-normal text-gray-700 text-sm w-10 text-right flex-shrink-0">AD:</label>
                            <div className="w-1/4 pr-5"> 
                                <StyledInput name="adicao" value={data.adicao} onChange={handleChange} step="0.25" />
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* <div className="flex-1 p-4 flex flex-col justify-start items-start" style={{ minWidth: '240px' }}>
                <h2 className="w-full text-lg font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200">
                    Medidas 
                </h2>
                <div className="space-y-3">
                    <div className="flex gap-x-4">
                        <MedidaInput label="COD" name='centroOpticoOd' value={data.centroOpticoOd} onChange={handleChange} />
                        <MedidaInput label="COE" name='centroOpticoOe' value={data.centroOpticoOe} onChange={handleChange} />
                    </div>
                    <div className="flex gap-x-4">
                        <MedidaInput label="DP" name='distanciaPupilar' value={data.distanciaPupilar} onChange={handleChange}/>
                        <MedidaInput label="AV" name='anguloVertical' value={data.anguloVertical} onChange={handleChange}/>
                    </div>
                    <div className="flex gap-x-4">
                        <MedidaInput label="AM" name='anguloMaior' value={data.anguloMaior} onChange={handleChange}/>
                        <MedidaInput label="PA" name='ponteAro' value={data.ponteAro} onChange={handleChange}/>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default ReceituarioMedidas;