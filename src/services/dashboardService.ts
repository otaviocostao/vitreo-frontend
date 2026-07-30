import type { DashboardResponse, MetricaCard, GraficoReceita, VendaRecente } from "../types/dashboard";
import type { OrderResponse } from "../types/order";
import type { CustomerResponse } from "../types/customer";
import api from "./api";

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

const calcTrendAndPct = (current: number, previous: number) => {
  if (previous === 0) {
    return {
      percentual: current > 0 ? 100 : 0,
      tendencia: 'up' as const,
    };
  }
  const diff = current - previous;
  const percentual = Math.round((Math.abs(diff) / previous) * 100 * 10) / 10;
  return {
    percentual,
    tendencia: (current >= previous ? 'up' : 'down') as 'up' | 'down',
  };
};

export const getDashboardData = async (dataInicio: string, dataFim: string): Promise<DashboardResponse> => {
  try {
    const [ordersRes, customersRes] = await Promise.all([
      api.get<OrderResponse[]>('/orders').catch(() => ({ data: [] as OrderResponse[] })),
      api.get<CustomerResponse[]>('/customers').catch(() => ({ data: [] as CustomerResponse[] })),
    ]);

    const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
    const customers = Array.isArray(customersRes.data) ? customersRes.data : [];

    const [startYear, startMonth, startDay] = dataInicio.split('-').map(Number);
    const [endYear, endMonth, endDay] = dataFim.split('-').map(Number);

    const startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
    const endDate = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);

    const durationMs = endDate.getTime() - startDate.getTime();
    const prevEndDate = new Date(startDate.getTime() - 1);
    const prevStartDate = new Date(prevEndDate.getTime() - durationMs);

    const validOrders = orders.filter(o => o.status !== 'CANCELLED');

    const currentOrders: OrderResponse[] = [];
    const prevOrders: OrderResponse[] = [];

    validOrders.forEach(o => {
      const orderDate = new Date(o.orderDate);
      if (orderDate >= startDate && orderDate <= endDate) {
        currentOrders.push(o);
      } else if (orderDate >= prevStartDate && orderDate <= prevEndDate) {
        prevOrders.push(o);
      }
    });

    // 1. Vendas no período
    const vendasCurrentCount = currentOrders.length;
    const vendasPrevCount = prevOrders.length;
    const vendasTrendPct = calcTrendAndPct(vendasCurrentCount, vendasPrevCount);
    const vendasNoPeriodo: MetricaCard = {
      valor: vendasCurrentCount.toString(),
      tendencia: vendasTrendPct.tendencia,
      percentual: vendasTrendPct.percentual,
      textoContexto: `vs. período anterior (${vendasPrevCount})`,
    };

    // 2. Valor total das vendas
    const totalCurrentVal = currentOrders.reduce((sum, o) => sum + Number(o.finalValue ?? o.totalValue ?? 0), 0);
    const totalPrevVal = prevOrders.reduce((sum, o) => sum + Number(o.finalValue ?? o.totalValue ?? 0), 0);
    const totalTrendPct = calcTrendAndPct(totalCurrentVal, totalPrevVal);
    const valorTotalVendas: MetricaCard = {
      valor: formatarMoeda(totalCurrentVal),
      tendencia: totalTrendPct.tendencia,
      percentual: totalTrendPct.percentual,
      textoContexto: `vs. período anterior (${formatarMoeda(totalPrevVal)})`,
    };

    // 3. Ticket médio
    const ticketCurrent = vendasCurrentCount > 0 ? totalCurrentVal / vendasCurrentCount : 0;
    const ticketPrev = vendasPrevCount > 0 ? totalPrevVal / vendasPrevCount : 0;
    const ticketTrendPct = calcTrendAndPct(ticketCurrent, ticketPrev);
    const ticketMedio: MetricaCard = {
      valor: formatarMoeda(ticketCurrent),
      tendencia: ticketTrendPct.tendencia,
      percentual: ticketTrendPct.percentual,
      textoContexto: `vs. período anterior (${formatarMoeda(ticketPrev)})`,
    };

    // 4. Novos clientes
    const customerFirstOrderMap = new Map<string, Date>();
    validOrders.forEach(o => {
      if (o.customer?.id) {
        const orderDate = new Date(o.orderDate);
        const existing = customerFirstOrderMap.get(o.customer.id);
        if (!existing || orderDate < existing) {
          customerFirstOrderMap.set(o.customer.id, orderDate);
        }
      }
    });

    let newCustomersCurrent = 0;
    let newCustomersPrev = 0;

    customerFirstOrderMap.forEach(firstOrderDate => {
      if (firstOrderDate >= startDate && firstOrderDate <= endDate) {
        newCustomersCurrent++;
      } else if (firstOrderDate >= prevStartDate && firstOrderDate <= prevEndDate) {
        newCustomersPrev++;
      }
    });

    // Fallback: If customer has no orders yet, treat customer list as potential context
    if (validOrders.length === 0 && customers.length > 0) {
      newCustomersCurrent = customers.length;
    }

    const newCustTrendPct = calcTrendAndPct(newCustomersCurrent, newCustomersPrev);
    const novosClientes: MetricaCard = {
      valor: newCustomersCurrent.toString(),
      tendencia: newCustTrendPct.tendencia,
      percentual: newCustTrendPct.percentual,
      textoContexto: `vs. período anterior (${newCustomersPrev})`,
    };

    // 5. Gráfico de Receita por dia
    const revenueMap = new Map<string, number>();

    const cursor = new Date(startDate.getTime());
    while (cursor <= endDate) {
      const year = cursor.getFullYear();
      const month = String(cursor.getMonth() + 1).padStart(2, '0');
      const day = String(cursor.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;
      revenueMap.set(key, 0);
      cursor.setDate(cursor.getDate() + 1);
    }

    currentOrders.forEach(o => {
      const d = new Date(o.orderDate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      if (revenueMap.has(key)) {
        const prev = revenueMap.get(key) || 0;
        revenueMap.set(key, prev + Number(o.finalValue ?? o.totalValue ?? 0));
      }
    });

    const graficoReceita: GraficoReceita[] = Array.from(revenueMap.entries()).map(([data, valor]) => ({
      data,
      valor,
    }));

    // 6. Últimas Vendas
    const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    const ultimasVendas: VendaRecente[] = sortedOrders.slice(0, 5).map(o => {
      const nomeCliente = o.customer
        ? `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim() || 'Cliente sem nome'
        : 'Cliente Desconhecido';
      return {
        id: o.id,
        nomeCliente,
        valorFinal: Number(o.finalValue ?? o.totalValue ?? 0),
        dataPedido: o.orderDate,
      };
    });

    return {
      vendasNoPeriodo,
      valorTotalVendas,
      ticketMedio,
      novosClientes,
      graficoReceita,
      ultimasVendas,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
};