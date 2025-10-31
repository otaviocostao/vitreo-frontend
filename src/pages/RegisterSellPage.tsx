import HeaderTitlePage from "../components/HeaderTitlePage";
import ReceituarioMedidas from "../components/ReceituarioMedidas";
import ReceituarioInfoArea from "../components/ReceituarioInfoArea";
import VendaPagamento from "../components/VendaPagamento";
import InfoSection from "../components/InfoSection";
import InputField from "../components/ui/InputField";
import SaveCancelButtonsArea from "../components/SaveCancelButtonsArea";
import { useEffect, useState } from "react";
import AddClientModal from "../components/AddClientModal";
import type { ItemPedidoPayload, PagamentoPayload, PedidoPayload } from "../types/pedido";
import { createPedido } from "../services/pedidoService";
import type { ReceituarioPayload } from "../types/receituario";
import { useNavigate } from "react-router-dom";
import type { ClienteResponse } from "../types/cliente";
import type { ProdutoResponse } from "../types/produto";
import { getProducts } from "../services/productService";
import ClienteSearch from "../components/ClienteSearch";
import ErrorPopup from "../components/ErrorPopup";
import AddProductModal from "../components/AddProductModal";

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
}

const initialFormData = {
    cliente: null, receituario: {} as ReceituarioPayload, itens: [], pagamentos: [], ordemServico: '', dataReceita: '',
    dataPedido: '', dataPrevisaoEntrega: '', dataEntrega: '', desconto: 0, valorLentes: 0, valorArmacao: 0
}

function RegisterSellPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [productModalType, setProductModalType] = useState<'ARMACAO' | 'LENTE' | null>(null);
    const navigate = useNavigate();

    const [venda, setVenda] = useState<VendaFormData>(initialFormData);
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVenda(prev => ({ ...prev, [name]: value }));
    };
    
    const handleReceituarioChange = (data: Partial<ReceituarioPayload>) => {
        setVenda(prev => ({ ...prev, receituario: { ...prev.receituario, ...data }}));
    };
    
    const handlePagamentosChange = (novosPagamentos: PagamentoPayload[]) => {
        setVenda(prev => ({ ...prev, pagamentos: novosPagamentos }));
    };

    const handleValorChange = (campo: 'lentes' | 'armacao' | 'desconto', valor: number) => {
        const nomeDaPropriedade = campo === 'desconto'
        ? 'desconto'
        : `valor${campo.charAt(0).toUpperCase() + campo.slice(1)}`;

        setVenda(prev => ({ ...prev, [nomeDaPropriedade]: valor }));
    };
    
    const handleClienteSelect = (cliente: ClienteResponse | null) => {
        setVenda(prev => ({ ...prev, cliente }));
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

        if (!venda.cliente) {
            setError("Por favor, selecione um cliente.");
            setIsLoading(false);
            return;
        }

        const parseCurrency = (value: string | number | undefined): number | undefined => {
            if (value === undefined || value === '') return undefined;
            return parseFloat(String(value).replace(',', '.'));
        };

        const pedidoPayload: PedidoPayload = {
            clienteId: venda.cliente.id,
            receituario: Object.keys(venda.receituario).length > 0 ? 
            {
                ...venda.receituario,
                esfericoOd: parseCurrency(venda.receituario.esfericoOd),
                cilindricoOd: parseCurrency(venda.receituario.cilindricoOd),
                eixoOd: parseCurrency(venda.receituario.eixoOd),
                esfericoOe: parseCurrency(venda.receituario.esfericoOe),
                cilindricoOe: parseCurrency(venda.receituario.cilindricoOe),
                eixoOe: parseCurrency(venda.receituario.eixoOe),
                adicao: parseCurrency(venda.receituario.adicao),
                dnpOd: parseCurrency(venda.receituario.dnpOd),
                dnpOe: parseCurrency(venda.receituario.dnpOe),
                centroOpticoOd: parseCurrency(venda.receituario.centroOpticoOd),
                centroOpticoOe: parseCurrency(venda.receituario.centroOpticoOe),
                distanciaPupilar: parseCurrency(venda.receituario.distanciaPupilar),
                anguloMaior: parseCurrency(venda.receituario.anguloMaior),
                ponteAro: parseCurrency(venda.receituario.ponteAro),
                anguloVertical: parseCurrency(venda.receituario.anguloVertical),
            } 
            : undefined,
            itens: venda.itens.map(item => ({
                produtoId: item.produtoId, 
                quantidade: item.quantidade,
            })),
            pagamentos: venda.pagamentos.map(p => ({
                formaPagamento: p.formaPagamento,
                valorPago: p.valorPago,
                numeroParcelas: p.numeroParcelas,
            })),
            desconto: parseCurrency(venda.desconto),
            valorLentes: parseCurrency(venda.valorLentes),
            valorArmacao: parseCurrency(venda.valorArmacao),
            dataPrevisaoEntrega: venda.dataPrevisaoEntrega || undefined,
            ordemServico: venda.ordemServico ? parseInt(venda.ordemServico) : undefined,
        };

        // console.log("PAYLOAD ENVIADO:", JSON.stringify(pedidoPayload, null, 2));

        try {
            await createPedido(pedidoPayload);
            navigate('/vendas');
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


    const [produtosDisponiveis, setProdutosDisponiveis] = useState<ProdutoResponse[]>([]);
    

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
        setVenda(prev => {
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
         setVenda(prev => {
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

    const handleOpenProductModal = (tipo: 'ARMACAO' | 'LENTE') => {
        setProductModalType(tipo);
    };

    const handleCloseProductModal = () => {
        setProductModalType(null);
    };
    
    return (
        <div className=" flex flex-col w-fit box-border">
        <HeaderTitlePage page_name="Nova venda"/>
        <div className="w-full flex flex-1 flex-col px-4 box-border">
            <form onSubmit={handleSubmit}>
                <div className="flex divide-x divide-gray-200 border-y border-gray-200">
                    <InfoSection title="Cliente" className="w-2/3">
                        <ClienteSearch
                            selectedCliente={venda.cliente}
                            onClienteSelect={handleClienteSelect}
                            onOpenClientModal={() => setIsClientModalOpen(true)}
                        />
                    </InfoSection>

                    <InfoSection title="Ordem de serviço" className="w-1/3">
                        <div className="flex items-end"> 
                            <InputField
                                id="os-number"
                                type="number"
                                name="ordemServico"
                                placeholder="O.S"
                                className="w-24"
                                labelClassName="sr-only"
                                value={venda.ordemServico}
                                onChange={handleFormChange}
                            />
                        </div>
                    </InfoSection>
                </div>
                <div className="flex w-full border-b border-gray-200 divide-x-1 divide-gray-200">
                    <div className="flex flex-col w-2/3 " >
                        <ReceituarioMedidas  data={venda.receituario} onChange={handleReceituarioChange} />
                        <ReceituarioInfoArea 
                                receituarioData={venda.receituario}
                                pedidoData={venda}
                                onReceituarioChange={handleReceituarioChange}
                                onPedidoChange={(data) => setVenda(prev => ({ ...prev, ...data }))}
                                onArmacaoSelect={handleArmacaoSelect}
                                onLenteSelect={handleLenteSelect}
                                itens={venda.itens}
                                produtosDisponiveis={produtosDisponiveis}
                                onOpenProductModal={handleOpenProductModal}/>
                    </div>
                    <div className="flex flex-col w-1/3">
                        <VendaPagamento 
                            valorLentes={venda.valorLentes}
                        valorArmacao={venda.valorArmacao}
                        desconto={venda.desconto}
                        pagamentos={venda.pagamentos}
                        onValorChange={handleValorChange}
                        onPagamentosChange={handlePagamentosChange}
                        onError={setError} 
                        />
                    </div>
                </div>
                    <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath="/" textButton2='Finalizar Venda' />
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