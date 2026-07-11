import HeaderTitlePage from "../components/HeaderTitlePage";
import ReceituarioMedidas from "../components/ReceituarioMedidas";
import ReceituarioInfoArea from "../components/ReceituarioInfoArea";
import VendaPagamento from "../components/VendaPagamento";
import InfoSection from "../components/InfoSection";
import InputField from "../components/ui/InputField";
import SaveCancelButtonsArea from "../components/SaveCancelButtonsArea";
import { useEffect, useState } from "react";
import AddClientModal from "../components/AddClientModal";
import type { OrderItemPayload, PaymentPayload, OrderPayload, OrderUpdatePayload, OrderStatus, OrderResponse } from "../types/order";
import { createOrder, getOrderById, updateOrder } from "../services/orderService";
import type { ReceituarioPayload } from "../types/receituario";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { CustomerResponse } from "../types/customer";
import type { ProductResponse } from "../types/product";
import { getProducts } from "../services/productService";
import ClienteSearch from "../components/ClienteSearch";
import ErrorPopup from "../components/ErrorPopup";
import AddProductModal from "../components/AddProductModal";
import { getClienteById } from "../services/clienteService";
import StatusSelector from "../components/StatusSelector";
import Button from "../components/ui/Button";
import { FileText } from "lucide-react";
import api from "../services/api";

interface OrderFormData {
    customer: CustomerResponse | null;
    prescription: ReceituarioPayload;
    items: OrderItemPayload[];
    payments: PaymentPayload[];
    serviceOrder: string;
    orderDate: string;
    deliveryForecastDate: string;
    deliveryDate: string;
    discount: number;
    lensValue: number;
    frameValue: number;
    status: OrderStatus;
    observations: string;
}

const initialFormData = {
    customer: null,
    prescription: {} as ReceituarioPayload,
    items: [],
    payments: [],
    serviceOrder: '',
    orderDate: '',
    deliveryForecastDate: '',
    deliveryDate: '',
    discount: 0,
    lensValue: 0,
    frameValue: 0,
    status: 'PENDING' as OrderStatus,
    observations: ''
};

function RegisterSellPage() {
    const { id: pedidoId } = useParams<{ id: string }>();
    const isEditMode = !!pedidoId;
    const [produtosDisponiveis, setProdutosDisponiveis] = useState<ProductResponse[]>([]);
    const [fetchedOrder, setFetchedOrder] = useState<OrderResponse | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [productModalType, setProductModalType] = useState<'frame' | 'lens' | null>(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<OrderFormData>(initialFormData);
    const [selectedFrame, setSelectedFrame] = useState<ProductResponse | null>(null);
    const [selectedLens, setSelectedLens] = useState<ProductResponse | null>(null);

    const mapPrescriptionToPortuguese = (prescription: any): ReceituarioPayload => {
        if (!prescription) return {} as ReceituarioPayload;
        return {
            esfericoOd: prescription.sphericalOd,
            cilindricoOd: prescription.cylindricalOd,
            eixoOd: prescription.axisOd,
            esfericoOe: prescription.sphericalOe,
            cilindricoOe: prescription.cylindricalOe,
            eixoOe: prescription.axisOe,
            adicao: prescription.addition,
            distanciaPupilar: prescription.pupillaryDistance,
            dnpOd: prescription.dnpOd,
            dnpOe: prescription.dnpOe,
            centroOpticoOd: prescription.opticalCenterOd,
            centroOpticoOe: prescription.opticalCenterOe,
            anguloMaior: prescription.greaterAngle,
            ponteAro: prescription.bridgeFrame,
            anguloVertical: prescription.verticalAngle,
            nomeMedico: prescription.doctorName,
            crmMedico: prescription.doctorCrm,
            dataReceita: prescription.prescriptionDate ? prescription.prescriptionDate.substring(0, 10) : undefined,
        };
    };

    useEffect(() => {
        if (!isEditMode) {
            setFormData(initialFormData);
            setSelectedFrame(null);
            setSelectedLens(null);
            return;
        }

        const loadPageData = async () => {
            setError(null);
            try {
                const orderData = await getOrderById(pedidoId);
                setFetchedOrder(orderData);
                console.log(orderData);

                const frameItem = orderData.items.find(item => item.product.productType === 'frame');
                const lensItem = orderData.items.find(item => item.product.productType === 'lens');
                setSelectedFrame(frameItem ? frameItem.product : null);
                setSelectedLens(lensItem ? lensItem.product : null);

                let clienteCompleto: CustomerResponse | null = null;
                if (orderData.customer && orderData.customer.id) {
                    clienteCompleto = await getClienteById(orderData.customer.id);
                }

                const itensDoFormulario = orderData.items.map(itemAPI => {
                    return {
                        productId: itemAPI.product.id,
                        quantity: itemAPI.quantity,
                        unitPrice: itemAPI.unitPrice
                    };
                });

                const pagamentosDoFormulario = orderData.payments.map(p => {
                    return {
                        id: p.id,
                        paymentMethod: p.paymentMethod,
                        amountPaid: Number(p.amountPaid),
                        installments: p.installments
                    };
                });

                const dadosDoFormulario: OrderFormData = {
                    customer: clienteCompleto,
                    prescription: mapPrescriptionToPortuguese(orderData.prescription),
                    items: itensDoFormulario,
                    payments: pagamentosDoFormulario,
                    serviceOrder: orderData.serviceOrder?.toString() ?? '',
                    orderDate: formatarParaInputDate(orderData.orderDate) ?? '',
                    deliveryForecastDate: orderData.deliveryForecastDate ? orderData.deliveryForecastDate.substring(0, 10) : '',
                    deliveryDate: orderData.deliveryDate ? orderData.deliveryDate.substring(0, 10) : '',
                    lensValue: orderData.lensValue ?? 0,
                    frameValue: orderData.frameValue ?? 0,
                    discount: orderData.discount ?? 0,
                    status: orderData.status ?? 'PENDING',
                    observations: orderData.observations || '',
                };

                setFormData(dadosDoFormulario);

            } catch (err) {
                setError("Falha ao carregar os dados do pedido.");
                console.error(err);
            }
        };

        if (pedidoId) {
            loadPageData();
        }
    }, [pedidoId, isEditMode]);

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
        setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, ...data } }));
    };

    const handlePagamentosChange = (novosPagamentos: PaymentPayload[]) => {
        setFormData(prev => ({ ...prev, payments: novosPagamentos }));
    };

    const handleValorChange = (campo: 'lentes' | 'armacao' | 'desconto', valor: number) => {
        const nomeDaPropriedade = campo === 'desconto'
            ? 'discount'
            : (campo === 'lentes' ? 'lensValue' : 'frameValue');

        setFormData(prev => ({ ...prev, [nomeDaPropriedade]: valor }));
    };

    const handleClienteSelect = (cliente: CustomerResponse | null) => {
        setFormData(prev => ({ ...prev, customer: cliente }));
    };

    const handleClientSubmit = (novoCliente: CustomerResponse) => {
        handleClienteSelect(novoCliente);
        setIsClientModalOpen(false);
    };

    const handleProductSubmit = (novoProduto: ProductResponse) => {
        const productType = novoProduto.productType || productModalType;

        if (!novoProduto || !novoProduto.id || !productType) {
            console.error("Produto inválido recebido do modal!");
            setProductModalType(null);
            return;
        }

        const produtoComTipo = { ...novoProduto, productType };

        setProdutosDisponiveis(prev => {
            const novaLista = [produtoComTipo, ...prev];
            return novaLista;
        });

        if (productType === 'lens') {
            handleLenteSelect(produtoComTipo);
        }

        if (productType === 'frame') {
            handleArmacaoSelect(produtoComTipo);
        }

        setProductModalType(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.customer) {
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
            const hasPrescriptionData = Object.keys(formData.prescription).length > 0;
            const prescriptionPayload = hasPrescriptionData ? {
                customerId: formData.customer.id,
                sphericalOd: parseCurrency(formData.prescription.esfericoOd),
                cylindricalOd: parseCurrency(formData.prescription.cilindricoOd),
                axisOd: parseCurrency(formData.prescription.eixoOd),
                sphericalOe: parseCurrency(formData.prescription.esfericoOe),
                cylindricalOe: parseCurrency(formData.prescription.cilindricoOe),
                axisOe: parseCurrency(formData.prescription.eixoOe),
                addition: parseCurrency(formData.prescription.adicao),
                dnpOd: parseCurrency(formData.prescription.dnpOd),
                dnpOe: parseCurrency(formData.prescription.dnpOe),
                opticalCenterOd: parseCurrency(formData.prescription.centroOpticoOd),
                opticalCenterOe: parseCurrency(formData.prescription.centroOpticoOe),
                pupillaryDistance: parseCurrency(formData.prescription.distanciaPupilar),
                greaterAngle: parseCurrency(formData.prescription.anguloMaior),
                bridgeFrame: parseCurrency(formData.prescription.ponteAro),
                verticalAngle: parseCurrency(formData.prescription.anguloVertical),
                doctorName: formData.prescription.nomeMedico,
                doctorCrm: formData.prescription.crmMedico,
                prescriptionDate: formData.prescription.dataReceita || undefined,
            } : undefined;

            let prescriptionId: string | undefined = undefined;

            if (prescriptionPayload) {
                if (isEditMode && fetchedOrder?.prescription?.id) {
                    await api.patch(`/prescriptions/${fetchedOrder.prescription.id}`, prescriptionPayload);
                    prescriptionId = fetchedOrder.prescription.id;
                } else {
                    const presResp = await api.post<{ id: string }>('/prescriptions', prescriptionPayload);
                    prescriptionId = presResp.data.id;
                }
            }

            if (isEditMode && pedidoId) {
                const updatePayload: OrderUpdatePayload = {
                    customerId: formData.customer.id,
                    prescriptionId: prescriptionId,
                    serviceOrder: formData.serviceOrder ? parseInt(formData.serviceOrder) : undefined,
                    items: formData.items.map(item => ({
                        productId: item.productId,
                        quantity: Number(item.quantity),
                        unitPrice: Number(item.unitPrice),
                    })),
                    payments: formData.payments.map(p => ({
                        paymentMethod: p.paymentMethod,
                        amountPaid: Number(p.amountPaid),
                        installments: p.installments ? Number(p.installments) : 1,
                    })),
                    discount: parseCurrency(formData.discount),
                    lensValue: parseCurrency(formData.lensValue),
                    frameValue: parseCurrency(formData.frameValue),
                    orderDate: formatarDataParaLocalDateTime(formData.orderDate),
                    deliveryForecastDate: formData.deliveryForecastDate || undefined,
                    deliveryDate: formData.deliveryDate || undefined,
                    status: formData.status,
                    observations: formData.observations,
                };

                await updateOrder(pedidoId, updatePayload);
                console.log("PAYLOAD ENVIADO:", JSON.stringify(updatePayload, null, 2));
                navigate(`/vendas/${pedidoId}/detalhes`);
            } else {
                const orderPayload: OrderPayload = {
                    customerId: formData.customer.id,
                    prescriptionId: prescriptionId,
                    items: formData.items.map(item => ({
                        productId: item.productId,
                        quantity: Number(item.quantity),
                        unitPrice: Number(item.unitPrice),
                    })),
                    payments: formData.payments.map(p => ({
                        paymentMethod: p.paymentMethod,
                        amountPaid: Number(p.amountPaid),
                        installments: p.installments ? Number(p.installments) : 1,
                    })),
                    discount: parseCurrency(formData.discount),
                    lensValue: parseCurrency(formData.lensValue),
                    frameValue: parseCurrency(formData.frameValue),
                    deliveryForecastDate: formData.deliveryForecastDate || undefined,
                    orderDate: formatarDataParaLocalDateTime(formData.orderDate) || new Date().toISOString(),
                    serviceOrder: formData.serviceOrder ? parseInt(formData.serviceOrder) : undefined,
                    status: formData.status,
                    observations: formData.observations,
                };

                const novoPedido = await createOrder(orderPayload);
                console.log("Resposta da API de criação:", novoPedido);
                navigate(`/vendas/${novoPedido.id}/detalhes`);
            }

        } catch (err: any) {
            if (err.response?.data) {
                const errorData = err.response.data;
                const messages = typeof errorData === 'object' ? Object.values(errorData).join('; ') : errorData.message;
                setError(messages || 'Ocorreu um erro ao processar sua solicitação.');
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


    const handleArmacaoSelect = (produto: ProductResponse | null) => {
        setSelectedFrame(produto);
        setFormData(prev => {
            const outrosItens = selectedFrame
                ? prev.items.filter(item => item.productId !== selectedFrame.id)
                : prev.items;

            let novosItens = outrosItens;
            if (produto) {
                novosItens = [...outrosItens, { productId: produto.id, quantity: 1, unitPrice: produto.salePrice }];
            }

            return {
                ...prev,
                items: novosItens,
                frameValue: produto ? produto.salePrice : 0
            }
        });
    };


    const handleLenteSelect = (produto: ProductResponse | null) => {
        setSelectedLens(produto);
        setFormData(prev => {
            const outrosItens = selectedLens
                ? prev.items.filter(item => item.productId !== selectedLens.id)
                : prev.items;

            let novosItens = outrosItens;
            if (produto) {
                novosItens = [...outrosItens, { productId: produto.id, quantity: 1, unitPrice: produto.salePrice }];
            }

            return {
                ...prev,
                items: novosItens,
                lensValue: produto ? produto.salePrice : 0
            }
        });
    };

    const handleStatusChange = (newStatus: OrderStatus) => {
        setFormData(prev => ({ ...prev, status: newStatus }));
    };

    const handleOpenProductModal = (tipo: 'frame' | 'lens') => {
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
                                selectedCliente={formData.customer}
                                onClienteSelect={handleClienteSelect}
                                onOpenClientModal={() => setIsClientModalOpen(true)}
                                isEditMode={isEditMode}
                            />
                        </InfoSection>

                        <div className="w-1/3 flex divide-x divide-gray-200 ">
                            <InfoSection title="Ordem de serviço" className="w-full">
                                <div className="flex items-end">
                                    <InputField
                                        id="os-number"
                                        type="number"
                                        name="serviceOrder"
                                        placeholder="O.S"
                                        className="w-24"
                                        value={formData.serviceOrder}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </InfoSection>

                            {isEditMode &&
                                <InfoSection title="Status" className="w-full">
                                    <StatusSelector
                                        currentStatus={formData.status}
                                        onStatusChange={handleStatusChange}
                                        disabled={formData.status === 'COMPLETED' || formData.status === 'CANCELLED'}
                                    />
                                </InfoSection>
                            }
                        </div>

                    </div>
                    <div className="flex w-full border-b border-gray-200 divide-x-1 divide-gray-200">
                        <div className="flex flex-col w-2/3 " >
                            <ReceituarioMedidas data={formData.prescription} onChange={handleReceituarioChange} />
                            <ReceituarioInfoArea
                                receituarioData={formData.prescription}
                                orderData={formData}
                                onReceituarioChange={handleReceituarioChange}
                                onOrderChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                onArmacaoSelect={handleArmacaoSelect}
                                onLenteSelect={handleLenteSelect}
                                items={formData.items}
                                produtosDisponiveis={produtosDisponiveis}
                                onOpenProductModal={handleOpenProductModal}
                                selectedFrame={selectedFrame}
                                selectedLens={selectedLens}
                                isEditMode={isEditMode} />
                        </div>
                        <div className="flex flex-col w-1/3">
                            <VendaPagamento
                                valorLentes={formData.lensValue}
                                valorArmacao={formData.frameValue}
                                desconto={formData.discount}
                                payments={formData.payments}
                                onValorChange={handleValorChange}
                                onPaymentsChange={handlePagamentosChange}
                                onError={setError}
                            />
                        </div>
                    </div>
                    <SaveCancelButtonsArea textButton1='Cancelar' cancelButtonPath="/vendas" textButton2={(isEditMode && 'Salvar alterações') || 'Finalizar Venda'} isLoading={isLoading} />
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
}

export default RegisterSellPage;