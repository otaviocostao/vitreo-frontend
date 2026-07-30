import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './ui/Button';
import type { PaymentPayload, PaymentMethodType } from '../types/order';

interface PaymentWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  oldTotal: number;
  newTotal: number;
  payments?: PaymentPayload[];
}

const paymentMethodDisplayMap: Record<PaymentMethodType, string> = {
  'CASH': 'Dinheiro',
  'PIX': 'Pix',
  'DEBIT_CARD': 'Cartão de Débito',
  'CREDIT_CARD': 'Cartão de Crédito',
  'BANK_SLIP': 'Prazo',
};

const PaymentWarningModal: React.FC<PaymentWarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  oldTotal,
  newTotal,
  payments = [],
}) => {
  if (!isOpen) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div
      className="fixed inset-0 p-4 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 relative border border-gray-100 transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="cursor-pointer absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3.5 bg-amber-100 rounded-full text-amber-600 flex-shrink-0">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Atenção! O valor final da venda foi alterado
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              O produto selecionado ou removido altera o valor final da venda
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-base leading-relaxed text-gray-800 font-medium">
            O produto selecionado foi alterado e o valor final da venda mudou de <span className="text-lg font-bold text-gray-900">{formatCurrency(oldTotal)}</span> para <span className="text-lg font-bold text-teal-700">{formatCurrency(newTotal)}</span>.
          </p>
          <p className="text-base leading-relaxed text-gray-700">
            Clicando em <strong>Continuar</strong>, os pagamentos cadastrados anteriormente serão <strong>removidos automaticamente</strong> para que novos pagamentos possam ser lançados com o valor correto. Caso queira desfazer a alteração feita, clique em <strong>Cancelar</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-xl mb-8 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900">Pagamentos que serão removidos:</h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <li
                  key={payment.id || index}
                  className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm">
                      {paymentMethodDisplayMap[payment.paymentMethod] || payment.paymentMethod}
                    </span>
                    {payment.installments > 1 && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {payment.installments}x de {formatCurrency(payment.amountPaid / payment.installments)}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatCurrency(payment.amountPaid)}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm py-2 text-center">Nenhum pagamento registrado.</li>
            )}
          </ul>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={onCancel} className="px-6 py-2.5 text-base">
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm} className="px-6 py-2.5 text-base">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentWarningModal;
