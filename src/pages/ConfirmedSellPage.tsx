

import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Edit, CheckCircle, CircleDollarSign, Landmark, CreditCard, Banknote, CircleDashed, Scissors } from 'lucide-react';

import { getPedidoById } from '../services/pedidoService';
import type { PedidoResponse } from '../types/pedido';

import HeaderTitlePage from '../components/HeaderTitlePage';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import DetailSection from '../components/DetailSection';
import DetailItem from '../components/DetailItem';
import StatusBadge from '../components/ui/StatusBadge';
import ClientReceipt from '../components/ClientReceipt';
import SelectField from '../components/ui/SelectField';

const formatarMoeda = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const SaleConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<PedidoResponse | null>(null);
  const [selectedPrintOption, setSelectedPrintOption] = useState<'AMBAS' | 'OTICA' | 'CLIENTE'>('AMBAS');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do pedido não encontrado na URL.");
      setIsLoading(false);
      return;
    }

    const fetchPedido = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPedidoById(id);
        setPedido(data);
      } catch (err) {
        setError("Falha ao carregar os detalhes do pedido.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  const valorTotalPago = useMemo(() => {
    if (!pedido || !pedido.pagamentos) {
      return 0;
    }
    return pedido.pagamentos.reduce((total, pagamento) => total + pagamento.valorPago, 0);
  }, [pedido]);

  const valorRestante = useMemo(() => {
    if (!pedido || !pedido.pagamentos) {
      return 0;
    }

    return pedido.valorFinal - valorTotalPago;
  }, [pedido]);

  type PrintOption = 'AMBAS' | 'OTICA' | 'CLIENTE';

  const printOptions = [
    { value: 'AMBAS', label: 'Ambas as vias' },
    { value: 'OTICA', label: 'Via da Ótica' },
    { value: 'CLIENTE', label: 'Via do Cliente' }
  ];

  const handlePrintOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as PrintOption;
    setSelectedPrintOption(newValue);
};

  if (isLoading) {
    return <LoadingSpinner text="Carregando detalhes da venda..." />;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!pedido) {
    return <div className="p-8 text-center text-gray-500">Pedido não encontrado.</div>;
  }

  return (
    <div className="flex flex-col w-full">
        <div className='print:hidden'>
          <HeaderTitlePage page_name={`Detalhes do Pedido #${pedido.ordemServico || pedido.id.substring(0, 8)}`} />
        </div>
      
      <div className="px-4 py-6">
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 print:hidden" role="alert">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">Venda Finalizada com Sucesso!</p>
              <p className="text-sm">Os detalhes do pedido estão listados abaixo.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 mb-6 print:hidden">
          <SelectField label="" className="w-38" value={selectedPrintOption} options={printOptions} defaultValue="AMBAS" onChange={handlePrintOptionChange}/>
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer size={16} />
            Imprimir
          </Button>
          <Link to={`/vendas/${pedido.id}`}>
            <Button variant="primary">
              <Edit size={16} />
              Editar Pedido
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden print:border-none print:shadow-none">
          
          {(selectedPrintOption === 'AMBAS' || selectedPrintOption === 'OTICA') && (
             <>
             
              <DetailSection title="Informações do Pedido">
                <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                  <DetailItem label="Ordem de Serviço:" value={pedido.ordemServico || 'N/A'} />
                  <DetailItem label="Data do Pedido:" value={new Date(pedido.dataPedido).toLocaleDateString('pt-BR')} />
                  <DetailItem label="Data Prevista:" value={new Date(pedido.dataPrevisaoEntrega).toLocaleDateString('pt-BR')} />
                  <div className='print:hidden'>
                    <DetailItem label="Status:" value={<StatusBadge status={pedido.status} />} />
                  </div>
                </div>
              </DetailSection>

              <DetailSection title="Cliente">
                <DetailItem label="Nome:" value={pedido.cliente.nomeCompleto} />
              </DetailSection>

              <div className='flex flex-col lg:flex-row divide-x divide-y divide-gray-200 print:flex-row print:divide-x print:divide-gray-200'>
                
                <div className='w-3/4 print:w-[65%]'>
                  {pedido.receituario && (
                    <DetailSection title="Receituário">
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
                              <td className="px-4 py-2 text-center text-gray-800 ">{pedido.receituario.esfericoOd}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.cilindricoOd}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.eixoOd}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.dnpOd}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.centroOpticoOd}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.distanciaPupilar}</td>
                            </tr>
                            <tr className='divide-x divide-gray-200'>
                              <td className="px-4 py-2 font-medium text-gray-600 text-right">OE</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.esfericoOe}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.cilindricoOe}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.eixoOe}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.dnpOe}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{pedido.receituario.centroOpticoOe}</td>
                              <td className="px-4 py-2 text-center text-gray-800">{}</td>
                            </tr>
                            <tr className='divide-x divide-gray-200'>
                              <td className="px-4 py-2 font-medium text-gray-600 text-right">AD</td>
                              <td className="px-4 py-2 text-center text-gray-800 border-r-1 border-gray-200">{pedido.receituario.adicao}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                  
                      <div className='flex gap-2 items-center align-middle mt-2'>
                        <h2 className="text-lg font-semibold text-gray-800">Médico:</h2>
                        <DetailItem label="Dr." value={pedido.receituario?.nomeMedico || 'N/A'} />
                      </div>
                    </DetailSection>
                  )}


                  <DetailSection title="Itens do Pedido" className='border-none'>
                    {pedido.itens.map(item => (
                      <div key={item.produtoId} className="flex gap-1 items-center py-1">
                        {item.tipoProduto === 'ARMACAO' ? (
                          <p className="text-sm text-gray-700">Armação:</p>
                          
                        ) : (
                          <p className="text-sm text-gray-700">Lentes:</p>
                        )}
                        <p className="text-sm text-gray-700 font-semibold">{item.nomeProduto}</p>
                      </div>
                    ))}
                  </DetailSection>
                </div>

                <div className='w-1/4 print:w-[35%]'>
                  <DetailSection title="Orçamento do pedido">
                    <DetailItem label="Valor da armação" value={formatarMoeda(pedido.valorArmacao)} />
                    <DetailItem label="Valor das lentes" value={formatarMoeda(pedido.valorLentes)} />
                    <DetailItem label="Desconto aplicado" value={formatarMoeda(pedido.desconto)} />

                      <h2 className="text-md font-semibold text-gray-800 my-3 border-b-1 border-gray-200">Financeiro:</h2>

                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>Valor Final:</span>
                      <span>{formatarMoeda(pedido.valorFinal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>Valor Pago:</span>
                      <span className="text-green-600">{formatarMoeda(valorTotalPago)}</span>
                    </div>
                    <div className={`flex justify-between text-sm font-bold ${valorRestante <= 0 ? 'text-green-600' : 'text-red-600'} print:text-black`}>
                      <span>Valor Restante:</span>
                      <span>{formatarMoeda(valorRestante)}</span>
                    </div>

                    <h2 className="text-md font-semibold text-gray-800 my-3 border-b-1 border-gray-200">Observações:</h2>
                    <p className="text-sm text-gray-700 line-clamp-4">{pedido.observacoes || 'Nenhuma observação registrada.'}</p>
                        
                  </DetailSection>
                </div>
              </div>
             </> 
          )}

          {(selectedPrintOption === 'AMBAS') && (
            <div className="border-t-2 border-dashed border-gray-300 mx-2 my-3">
                <div className="flex justify-center items-center -mt-3">
                    <Scissors className="bg-white px-2 text-gray-400" size={24}/>
                </div>
            </div>
          )}


          {(selectedPrintOption === 'AMBAS' || selectedPrintOption === 'CLIENTE') && (
            <ClientReceipt pedido={pedido} valorTotalPago={valorTotalPago} valorRestante={valorRestante} />
          )}

        </div>
      </div>
    </div>
  );
};

export default SaleConfirmationPage;