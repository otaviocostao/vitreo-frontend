import HeaderTitlePage from "../components/HeaderTitlePage";
import ReceituarioMedidas from "../components/ReceituarioMedidas";
import ReceituarioInfoArea from "../components/ReceituarioInfoArea";
import VendaPagamento from "../components/VendaPagamento";
import InfoSection from "../components/InfoSection";
import InputField from "../components/ui/InputField";
import SaveCancelButtonsArea from "../components/SaveCancelButtonsArea";
import { useEffect, useState } from "react";
import AddClientModal from "../components/AddClientModal";
import type { ItemPedidoPayload, PagamentoPayload, PedidoPayload, PedidoUpdatePayload, StatusPedido } from "../types/pedido";
import { createPedido, getPedidoById, updatePedido } from "../services/pedidoService";
import type { ReceituarioPayload } from "../types/receituario";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ClienteResponse } from "../types/cliente";
import type { ProdutoResponse } from "../types/produto";
import { getProducts } from "../services/productService";
import ClienteSearch from "../components/ClienteSearch";
import ErrorPopup from "../components/ErrorPopup";
import AddProductModal from "../components/AddProductModal";
import { getClienteById } from "../services/clienteService";
import StatusSelector from "../components/StatusSelector";
import Button from "../components/ui/Button";
import { FileText } from "lucide-react";

interface VendaFormData {
    cliente: ClienteResponse | null;
    receituario: ReceituarioPayload;
    itens: ItemPedidoPayload[];
    pagamentos: PagamentoPayload[];
    ordemServico: string;
    dataPedido: string;
    dataPrevisaoEntrega: string;
    dataEntrega: string;
    desconto: number;
    valorLentes: number;
    valorArmacao: number;
    status: StatusPedido;
    observacoes: string;
}

const initialFormData = {
    cliente: null, receituario: {} as ReceituarioPayload, itens: [], pagamentos: [], ordemServico: '',
    dataPedido: '', dataPrevisaoEntrega: '', dataEntrega: '', desconto: 0, valorLentes: 0, valorArmacao: 0, status: '' as StatusPedido, observacoes: ''
}

function RegisterSellPage() {
    const { id: pedidoId } = useParams<{ id: string }>();
    const isEditMode = !!pedidoId;
    const [produtosDisponiveis, setProdutosDisponiveis] = useState<ProdutoResponse[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [productModalType, setProductModalType] = useState<'ARMACAO' | 'LENTE' | null>(null);
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(isEditMode);

    const [formData, setFormData] = useState<VendaFormData>(initialFormData);    
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      useEffect(() => {
        const loadPageData = async () => {
            if (!isEditMode || !pedidoId || produtosDisponiveis.length === 0) {
                if (!isEditMode) setFormData(initialFormData);
                return;
            }

            setIsFetching(true);
            setError(null);
            try {
                const pedidoData = await getPedidoById(pedidoId);
                console.log(pedidoData);

                let clienteCompleto: ClienteResponse | null = null;
                if (pedidoData.cliente && pedidoData.cliente.id) {
                    clienteCompleto = await getClienteById(pedidoData.cliente.id);
                }

                const itensDoFormulario = pedidoData.itens.map(itemAPI => {
                    const produtoCorrespondente = produtosDisponiveis.find(
                        p => p.nome === itemAPI.nomeProduto && p.tipoProduto === itemAPI.tipoProduto
                    );

                    return {
                        produtoId: produtoCorrespondente ? produtoCorrespondente.id : '', 
                        quantidade: itemAPI.quantidade
                    };
                }).filter(item => item.produtoId);

                const dadosDoFormulario: VendaFormData = {
                    cliente: clienteCompleto,
                    receituario: pedidoData.receituario ?? {},
                    itens: itensDoFormulario,
                    pagamentos: pedidoData.pagamentos ?? [],
                    ordemServico: pedidoData.ordemServico?.toString() ?? '',
                    dataPedido: formatarParaInputDate(pedidoData.dataPedido) ?? '',
                    dataPrevisaoEntrega: pedidoData.dataPrevisaoEntrega ?? '',
                    dataEntrega: pedidoData.dataEntrega ?? '',
                    valorLentes: pedidoData.valorLentes ?? 0,
                    valorArmacao: pedidoData.valorArmacao ?? 0,
                    desconto: pedidoData.desconto ?? 0,
                    status: pedidoData.status ?? '',
                    observacoes: pedidoData.observacoes || '',
                };

                setFormData(dadosDoFormulario);

            } catch (err) {
                setError("Falha ao carregar os dados do pedido.");
                console.error(err);
            } finally {
                setIsFetching(false);
            }
        };
        loadPageData();
    }, [pedidoId, isEditMode, produtosDisponiveis]);

      const formatarParaInputDate = (dataHoraString: string | null | undefined): string => {
        if (!dataHoraString) {
            return '';
        }
        return dataHoraString.substring(0, 10);
      };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleReceituarioChange = (data: Partial<ReceituarioPayload>) => {
        setFormData(prev => ({ ...prev, receituario: { ...prev.receituario, ...data }}));
    };
    
    const handlePagamentosChange = (novosPagamentos: PagamentoPayload[]) => {
        setFormData(prev => ({ ...prev, pagamentos: novosPagamentos }));
    };

    const handleValorChange = (campo: 'lentes' | 'armacao' | 'desconto', valor: number) => {
        const nomeDaPropriedade = campo === 'desconto'
        ? 'desconto'
        : `valor${campo.charAt(0).toUpperCase() + campo.slice(1)}`;

        setFormData(prev => ({ ...prev, [nomeDaPropriedade]: valor }));
    };
    
    const handleClienteSelect = (cliente: ClienteResponse | null) => {
        setFormData(prev => ({ ...prev, cliente }));
    };

    const handleClientSubmit = (novoCliente: ClienteResponse) => {

        handleClienteSelect(novoCliente);

        setIsClientModalOpen(false);
    };

    const handleProductSubmit = (novoProduto: ProdutoResponse) => {


        if (!novoProduto || !novoProduto.id || !novoProduto.tipoProduto) {
            console.error("Produto inválido recebido do modal!");
            setProductModalType(null);
            return;
        }

        setProdutosDisponiveis(prev => {
            const novaLista = [novoProduto, ...prev];
            return novaLista;
        });

        if (novoProduto.tipoProduto === 'LENTE') {
            handleLenteSelect(novoProduto);
        }

        if (novoProduto.tipoProduto === 'ARMACAO') {
            handleArmacaoSelect(novoProduto);
        }

        setProductModalType(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.cliente) {
            setError("Por favor, selecione um cliente.");
            setIsLoading(false);
            return;
        }

        const parseCurrency = (value: string | number | undefined): number | undefined => {
            if (value === undefined || value === '') return undefined;
            return parseFloat(String(value).replace(',', '.'));
        };

        const formatarDataParaLocalDateTime = (dateString: string | undefined): string | undefined => {
            if (!dateString) {
                return undefined;
            }
            return `${dateString}T00:00:00`;
        };

        try {

            const receituarioPayload = Object.keys(formData.receituario).length > 0 ? {
                ...formData.receituario,
                esfericoOd: parseCurrency(formData.receituario.esfericoOd),
                cilindricoOd: parseCurrency(formData.receituario.cilindricoOd),
                eixoOd: parseCurrency(formData.receituario.eixoOd),
                esfericoOe: parseCurrency(formData.receituario.esfericoOe),
                cilindricoOe: parseCurrency(formData.receituario.cilindricoOe),
                eixoOe: parseCurrency(formData.receituario.eixoOe),
                adicao: parseCurrency(formData.receituario.adicao),
                dnpOd: parseCurrency(formData.receituario.dnpOd),
                dnpOe: parseCurrency(formData.receituario.dnpOe),
                centroOpticoOd: parseCurrency(formData.receituario.centroOpticoOd),
                centroOpticoOe: parseCurrency(formData.receituario.centroOpticoOe),
                distanciaPupilar: parseCurrency(formData.receituario.distanciaPupilar),
                anguloMaior: parseCurrency(formData.receituario.anguloMaior),
                ponteAro: parseCurrency(formData.receituario.ponteAro),
                anguloVertical: parseCurrency(formData.receituario.anguloVertical),
            } : undefined;

            
            if (isEditMode && pedidoId) {
                const updatePayload: PedidoUpdatePayload = {
                    receituario: receituarioPayload,
                    ordemServico: formData.ordemServico ? parseInt(formData.ordemServico) : undefined,
                    itens: formData.itens,
                    pagamentos: formData.pagamentos.map(({ id, ...resto }) => resto),
                    desconto: parseCurrency(formData.desconto),
                    valorLentes: parseCurrency(formData.valorLentes),
                    valorArmacao: parseCurrency(formData.valorArmacao),
                    dataPedido: formatarDataParaLocalDateTime(formData.dataPedido),
                    dataPrevisaoEntrega: formData.dataPrevisaoEntrega || undefined,
                    dataEntrega: formData.dataEntrega || undefined,
                    status: formData.status,
                    observacoes: formData.observacoes,
                };

                await updatePedido(pedidoId, updatePayload)
                console.log("PAYLOAD ENVIADO:", JSON.stringify(updatePayload, null, 2));
                navigate(`/vendas/${pedidoId}/detalhes`);
            } else {
                
                const pedidoPayload: PedidoPayload = {
                    clienteId: formData.cliente.id,
                    receituario: receituarioPayload,
                    itens: formData.itens.map(item => ({
                        produtoId: item.produtoId, 
                        quantidade: item.quantidade,
                    })),
                    pagamentos: formData.pagamentos.map(p => ({
                        formaPagamento: p.formaPagamento,
                        valorPago: p.valorPago,
                        numeroParcelas: p.numeroParcelas,
                    })),
                    desconto: parseCurrency(formData.desconto),
                    valorLentes: parseCurrency(formData.valorLentes),
                    valorArmacao: parseCurrency(formData.valorArmacao),
                    dataPrevisaoEntrega: formData.dataPrevisaoEntrega || undefined,
                    dataPedido: formatarDataParaLocalDateTime(formData.dataPedido) || undefined,
                    ordemServico: formData.ordemServico ? parseInt(formData.ordemServico) : undefined,
                    observacoes: formData.observacoes,
                };

                const novoPedido = await createPedido(pedidoPayload);
                console.log("Resposta da API de criação:", novoPedido);
                navigate(`/vendas/${novoPedido.id}/detalhes`); 
            }

        } catch (err: any) {
            if (err.response?.data) {
                const errorData = err.response.data;
                const messages = typeof errorData === 'object' ? Object.values(errorData).join('; ') : errorData.message;
                setError(`Erro ao salvar: ${messages}`);
            } else {
                setError('Ocorreu um erro de rede ou no servidor.');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const data = await getProducts({ size: 2000 });
                setProdutosDisponiveis(data.content);
            } catch (error) {
                console.error("Erro ao buscar lista de produtos", error);
            }
        };
        fetchAllProducts();
    }, []);


    const handleArmacaoSelect = (produto: ProdutoResponse | null) => {
        setFormData(prev => {
            const armacaoAtualId = prev.itens.find(item => 
                produtosDisponiveis.some(p => p.id === item.produtoId && p.tipoProduto === 'ARMACAO')
            )?.produtoId;

            const outrosItens = armacaoAtualId 
                ? prev.itens.filter(item => item.produtoId !== armacaoAtualId) 
                : prev.itens;
            
            let novosItens = outrosItens;
            if (produto) {
                novosItens = [...outrosItens, { produtoId: produto.id, quantidade: 1 }];
            }

            return {
                ...prev,
                itens: novosItens,
                valorArmacao: produto ? produto.valorVenda : 0
            }
        });
    };


     const handleLenteSelect = (produto: ProdutoResponse | null) => {
         setFormData(prev => {
            const lenteAtualId = prev.itens.find(item => 
                produtosDisponiveis.some(p => p.id === item.produtoId && p.tipoProduto === 'LENTE')
            )?.produtoId;

            const outrosItens = lenteAtualId 
                ? prev.itens.filter(item => item.produtoId !== lenteAtualId) 
                : prev.itens;
            
            let novosItens = outrosItens;
            if (produto) {
                novosItens = [...outrosItens, { produtoId: produto.id, quantidade: 1 }];
            }

            return {
                ...prev,
                itens: novosItens,
                valorLentes: produto ? produto.valorVenda : 0
            }
        });
    };

    const handleStatusChange = (newStatus: StatusPedido) => {
        setFormData(prev => ({ ...prev, status: newStatus }));
    };

    const handleOpenProductModal = (tipo: 'ARMACAO' | 'LENTE') => {
        setProductModalType(tipo);
    };

    const handleCloseProductModal = () => {
        setProductModalType(null);
    };
    
    return (
        <div className=" flex flex-col w-fit box-border">
        <div className="flex justify-between items-center print:hidden">
            <HeaderTitlePage page_name={isEditMode ? 'Editar Venda' : 'Nova Venda'} />

            {/* O botão só aparece no modo de edição */}
            {isEditMode && (
                <div className="p-4">
                    <Link to={`/vendas/${pedidoId}/detalhes`}>
                        <Button variant="secondary" >
                            <FileText size={16} />
                            <span>Ver Comprovante</span>
                        </Button>
                    </Link>
                </div>
            )}
        </div>
        <div className="w-full flex flex-1 flex-col px-4 box-border">
            <form onSubmit={handleSubmit}>
                <div className="flex divide-x divide-gray-200 border-y border-gray-200">
                    <InfoSection title="Cliente" className="w-2/3">
                        <ClienteSearch
                            selectedCliente={formData.cliente}
                            onClienteSelect={handleClienteSelect}
                            onOpenClientModal={() => setIsClientModalOpen(true)}
                            isEditMode={isEditMode}
                        />
                    </InfoSection>

                    <div  className="w-1/3 flex divide-x divide-gray-200 ">
                        <InfoSection title="Ordem de serviço" className="w-full">
                            <div className="flex items-end"> 
                                <InputField
                                    id="os-number"
                                    type="number"
                                    name="ordemServico"
                                    placeholder="O.S"
                                    className="w-24"
                                    labelClassName="sr-only"
                                    value={formData.ordemServico}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </InfoSection>

                        {isEditMode &&
                            <InfoSection title="Status" className="w-full">
                                <StatusSelector
                                    currentStatus={formData.status}
                                    onStatusChange={handleStatusChange}
                                    disabled={formData.status === 'ENTREGUE' || formData.status === 'CANCELADO'}
                                />
                            </InfoSection>
                        }
                    </div>

                </div>
                <div className="flex w-full border-b border-gray-200 divide-x-1 divide-gray-200">
                    <div className="flex flex-col w-2/3 " >
                        <ReceituarioMedidas  data={formData.receituario} onChange={handleReceituarioChange} />
                        <ReceituarioInfoArea 
                                receituarioData={formData.receituario}
                                pedidoData={formData}
                                onReceituarioChange={handleReceituarioChange}
                                onPedidoChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                onArmacaoSelect={handleArmacaoSelect}
                                onLenteSelect={handleLenteSelect}
                                itens={formData.itens}
                                produtosDisponiveis={produtosDisponiveis}
                                onOpenProductModal={handleOpenProductModal}/>
                    </div>
                    <div className="flex flex-col w-1/3">
                        <VendaPagamento 
                            valorLentes={formData.valorLentes}
                        valorArmacao={formData.valorArmacao}
                        desconto={formData.desconto}
                        pagamentos={formData.pagamentos}
                        onValorChange={handleValorChange}
                        onPagamentosChange={handlePagamentosChange}
                        onError={setError} 
                        />
                    </div>
                </div>
                    <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath="/vendas" textButton2={isEditMode && 'Salvar alterações' || 'Finalizar Venda'} isLoading={isLoading} />
            </form>
            </div>
            <AddClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSubmit={handleClientSubmit} 
                />
            {error && (
                <ErrorPopup message={error} onClose={() => setError(null)} />
            )}
            {productModalType !== null && (
                <AddProductModal isOpen={!!productModalType} onClose={handleCloseProductModal} onSubmit={handleProductSubmit} initialType={productModalType} />
            )}
        </div>          

    )
};


export default RegisterSellPage;