import React from 'react';
import Modal from './ui/Modal';
import StatusBadge from './ui/StatusBadge';
import type { OrderResponse } from '../types/order';
import { formatDate, formatPhone } from '../helpers/formatters';
import { formatCPF } from '../lib/utils';

interface SaleDetailsDrawerProps {
  order: OrderResponse | null;
  onClose: () => void;
}

const InfoField: React.FC<{ label: string; value?: string | number | React.ReactNode; className?: string }> = ({ label, value, className = '' }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={`bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 ${className}`}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="mt-1 text-sm font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
};

const SaleDetailsDrawer: React.FC<SaleDetailsDrawerProps> = ({ order, onClose }) => {
  if (!order) return null;

  const formatarMoeda = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatarLocalDateTimeParaData = (dataHoraString: string | null | undefined): string => {
    if (!dataHoraString) return '-';
    const dateObj = new Date(dataHoraString);
    if (isNaN(dateObj.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  };

  const getPaymentMethodLabel = (method: string): string => {
    switch (method) {
      case 'CASH': return 'Dinheiro';
      case 'CREDIT_CARD': return 'Cartão de Crédito';
      case 'DEBIT_CARD': return 'Cartão de Débito';
      case 'PIX': return 'Pix';
      case 'BANK_SLIP': return 'Boleto Bancário';
      default: return method;
    }
  };

  const valorTotalPago = order.payments
    ? order.payments.reduce((total, p) => total + Number(p.amountPaid), 0)
    : 0;
  const valorRestante = Number(order.finalValue) - valorTotalPago;

  const title = `Pedido #${order.serviceOrder || order.id.substring(0, 8)}`;

  return (
    <Modal isOpen={order !== null} onClose={onClose} title={title} maxWidth="max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {order.customer.firstName} {order.customer.lastName}
            </h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">
              O.S. {order.serviceOrder || 'Não informada'}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">
            Informações do Pedido
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <InfoField label="Data da Venda" value={formatarLocalDateTimeParaData(order.orderDate)} />
            <InfoField label="Previsão de Entrega" value={formatDate(order.deliveryForecastDate)} />
            {order.deliveryDate && (
              <InfoField label="Data de Entrega" value={formatDate(order.deliveryDate)} />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">
            Cliente
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <InfoField label="Nome Completo" value={`${order.customer.firstName} ${order.customer.lastName}`} className="col-span-2" />
            <InfoField label="CPF" value={order.customer.cpf ? formatCPF(order.customer.cpf) : '-'} />
            <InfoField label="Telefone" value={order.customer.phone ? formatPhone(order.customer.phone) : '-'} />
            <InfoField label="E-mail" value={order.customer.email || '-'} className="col-span-2" />
          </div>
        </div>

        {order.prescription && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">
              Receituário
            </h4>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-xs text-center">
                <thead className="bg-gray-50 font-bold text-gray-500">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-medium"></th>
                    <th className="px-2 py-1.5">ESF</th>
                    <th className="px-2 py-1.5">CIL</th>
                    <th className="px-2 py-1.5">EIXO</th>
                    <th className="px-2 py-1.5">DNP</th>
                    <th className="px-2 py-1.5">CO</th>
                    <th className="px-2 py-1.5">DP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                  <tr>
                    <td className="px-2 py-1.5 font-bold text-gray-500 text-left bg-gray-50/50">OD</td>
                    <td className="px-2 py-1.5">{order.prescription.sphericalOd ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.cylindricalOd ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.axisOd ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.dnpOd ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.opticalCenterOd ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.pupillaryDistance ?? '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1.5 font-bold text-gray-500 text-left bg-gray-50/50">OE</td>
                    <td className="px-2 py-1.5">{order.prescription.sphericalOe ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.cylindricalOe ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.axisOe ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.dnpOe ?? '-'}</td>
                    <td className="px-2 py-1.5">{order.prescription.opticalCenterOe ?? '-'}</td>
                    <td className="px-2 py-1.5">-</td>
                  </tr>
                  {order.prescription.addition && (
                    <tr>
                      <td className="px-2 py-1.5 font-bold text-gray-500 text-left bg-gray-50/50">AD</td>
                      <td className="px-2 py-1.5">{order.prescription.addition ?? '-'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <InfoField label="Médico" value={order.prescription.doctorName ? `Dr. ${order.prescription.doctorName}` : ''} />
              <InfoField label="CRM" value={order.prescription.doctorCrm} />
              <InfoField label="Data da Receita" value={order.prescription.prescriptionDate ? formatDate(order.prescription.prescriptionDate) : ''} />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">
            Itens do Pedido
          </h4>
          <div className="bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 divide-y divide-gray-100/60">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{item.product.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                    {item.product.productType === 'frame' ? 'Armação' : item.product.productType === 'lens' ? 'Lente' : 'Outro'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">
                    {item.quantity}x {formatarMoeda(item.unitPrice)}
                  </div>
                  <div className="text-xs font-bold text-blue-600 mt-0.5">
                    {formatarMoeda(item.quantity * item.unitPrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">
            Financeiro e Orçamento
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <InfoField label="Valor das Lentes" value={formatarMoeda(order.lensValue)} />
            <InfoField label="Valor da Armação" value={formatarMoeda(order.frameValue)} />
            <InfoField label="Total Bruto" value={formatarMoeda(order.totalValue)} />
            <InfoField label="Desconto" value={formatarMoeda(order.discount)} />
            <InfoField label="Valor Final" value={formatarMoeda(order.finalValue)} className="col-span-2 bg-blue-50/30 border-blue-100/40" />
          </div>

          {order.payments && order.payments.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Histórico de Pagamentos</span>
              <div className="bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 mt-1 space-y-2">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      {getPaymentMethodLabel(payment.paymentMethod)}
                      {payment.installments > 1 ? ` (${payment.installments}x)` : ''}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatarMoeda(payment.amountPaid)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-gray-200/60 pt-2 flex flex-col gap-1 text-xs">
                  <div className="flex justify-between font-medium text-gray-600">
                    <span>Total Pago:</span>
                    <span className="text-green-600 font-semibold">{formatarMoeda(valorTotalPago)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-600">
                    <span>Valor Restante:</span>
                    <span className={`${valorRestante <= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>
                      {formatarMoeda(valorRestante)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {order.observations && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">
              Observações
            </h4>
            <div className="bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {order.observations}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SaleDetailsDrawer;
