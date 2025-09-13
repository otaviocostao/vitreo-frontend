import { useState, useMemo } from 'react';
import { CreditCard, Landmark, CircleDollarSign, Trash2, PlusCircle } from 'lucide-react';

import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import Button from './ui/Button';
import PriceInput from './ui/PriceInput';

interface Payment {
  id: number;
  method: 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';
  amount: number;
  installments: number; 
}

const VendaPagamento = () => {
  const [lensesPrice, setLensesPrice] = useState(0);
  const [framePrice, setFramePrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [payments, setPayments] = useState<Payment[]>([]);

  const [newPaymentMethod, setNewPaymentMethod] = useState<'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro'>('Pix');
  const [newPaymentAmount, setNewPaymentAmount] = useState<number | ''>('');
  const [newPaymentInstallments, setNewPaymentInstallments] = useState(1);

  const totalOrderValue = useMemo(() => {
    return (lensesPrice || 0) + (framePrice || 0) - (discount || 0);
  }, [lensesPrice, framePrice, discount]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const remainingBalance = useMemo(() => {
    return totalOrderValue - totalPaid;
  }, [totalOrderValue, totalPaid]);

  const handleAddPayment = () => {
    if (!newPaymentAmount || newPaymentAmount <= 0) {
      alert('Por favor, insira um valor de pagamento válido.');
      return;
    }
    if (newPaymentAmount > remainingBalance) {
      alert('O valor do pagamento não pode ser maior que o saldo restante.');
      return;
    }

    const newPayment: Payment = {
      id: Date.now(), 
      method: newPaymentMethod,
      amount: newPaymentAmount,
      installments: newPaymentMethod === 'Cartão de Crédito' ? newPaymentInstallments : 1,
    };

    setPayments([...payments, newPayment]);

    setNewPaymentAmount('');
    setNewPaymentInstallments(1);
  };

  const handleRemovePayment = (paymentId: number) => {
    setPayments(payments.filter((payment) => payment.id !== paymentId));
  };
  
  const paymentOptions = [
    { value: 'Pix', label: 'Pix' }, { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
    { value: 'Cartão de Débito', label: 'Cartão de Débito' }, { value: 'Dinheiro', label: 'Dinheiro' }
  ];
  
  const paymentIcons = {
    'Pix': <Landmark size={20} className="text-blue-500" />,
    'Cartão de Crédito': <CreditCard size={20} className="text-orange-500" />,
    'Cartão de Débito': <CreditCard size={20} className="text-green-500" />,
    'Dinheiro': <CircleDollarSign size={20} className="text-teal-500" />,
  };

  return (
    <div className="flex flex-col flex-1 p-2 gap-2">
      
      <div className=" p-4 border-b-1 border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200">
          Orçamento do pedido
        </h2>
        <div className="space-y-2">
          <PriceInput
            label="Valor das lentes:"
            id="lentes_valor"
            type="number"
            min={0}
            value={lensesPrice === 0 ? '' : lensesPrice}
            onChange={(e) => setLensesPrice(parseFloat(e.target.value) || 0)}
            placeholder="R$ 0,00"
          />
          <PriceInput
            label="Valor da armação:"
            id="armacao_valor"
            type="number"
            min={0}
            value={framePrice === 0 ? '' : framePrice}
            onChange={(e) => setFramePrice(parseFloat(e.target.value) || 0)}
            placeholder="R$ 0,00"
          />
          <PriceInput
            label="Desconto:"
            id="desconto_valor"
            type="number"
            min={0}
            value={discount === 0 ? '' : discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            placeholder="R$ 0,00"
          />
        </div>
      </div>

      <div className="p-4 border-b-1 border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Lançar Pagamento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <SelectField label="Forma:" options={paymentOptions} value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value as any)} id={'forma_pagamento'} />
          <InputField label="Valor:" type="number" placeholder="R$ 0,00" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(parseFloat(e.target.value))} id={'valor_total'} />
          <InputField label="Parcelas:" type="number" value={newPaymentInstallments} onChange={(e) => setNewPaymentInstallments(parseInt(e.target.value))} disabled={newPaymentMethod !== 'Cartão de Crédito'} id={'parcelas'} />
        </div>
        <Button onClick={handleAddPayment} className="mt-4 w-full">
          <PlusCircle size={16} />
          <span>Adicionar Pagamento</span>
        </Button>
      </div>

      <div className=" p-4 border-b-1 border-gray-200 flex-1">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Pagamentos Realizados</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {payments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum pagamento registrado.</p>
          ) : (
            payments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-3">
                  {paymentIcons[payment.method]}
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{payment.method}</p>
                    {payment.installments > 1 && (
                      <p className="text-xs text-gray-500">{payment.installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount / payment.installments)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount)}</span>
                  <button onClick={() => handleRemovePayment(payment.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-md font-medium text-gray-700">
            <span>Total do Pedido:</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOrderValue)}</span>
          </div>
          <div className="flex justify-between text-md font-medium text-gray-700">
            <span>Total Pago:</span>
            <span className="text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}</span>
          </div>
          <div className={`flex justify-between text-lg font-bold ${remainingBalance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>Valor Restante:</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remainingBalance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendaPagamento;