import { Filter, Upload } from 'lucide-react';

import TopDashboardCard from '../components/dashboard/TopDashboardCard';
import ChartCard from '../components/dashboard/ChartCard';
import TotalRevenueChart from '../components/dashboard/TotalRevenueChart';
import Button from '../components/ui/Button'; 
import LastSalesCard from '../components/dashboard/LastSalesCard';
import HeaderTitlePage from '../components/HeaderTitlePage';
import { useCallback, useEffect, useState } from 'react';
import type { DashboardResponse } from '../types/dashboard';
import { getDashboardData } from '../services/dashboardService';
import ErrorPopup from '../components/ErrorPopup';

const paraInputDate = (data: Date) => data.toISOString().split('T')[0];

const Home = () => {

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hoje = new Date();
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const [dataInicio, setDataInicio] = useState(paraInputDate(primeiroDiaDoMes));
  const [dataFim, setDataFim] = useState(paraInputDate(ultimoDiaDoMes));

  const fetchPedidos = useCallback(async (page: number, size:number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getDashboardData(dataInicio, dataFim);
      setDashboardData(data);
      } catch (err) {
        setError('Falha ao carregar os dados do Dashboard. Tente novamente');
        console.error(err);
      } finally {
        setIsLoading(false);
    }
    }, [dataInicio, dataFim]);

    useEffect(() => {
      fetchPedidos(0, 4 );
    }, [fetchPedidos]);


  if (error) {
    return <ErrorPopup message={error} onClose={() => setError(null)} />;
  }

  if (!dashboardData) {
    return <div className="p-4 text-center text-gray-500">Nenhum dado encontrado para o período selecionado.</div>;
  }

  return (
    <div>
        <div className='flex justify-between '>
          <HeaderTitlePage page_name='Dashboard' />
          <div className="flex items-center gap-2 p-4">
              <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="px-2 py-2 bg-white border border-gray-300 rounded-md
            text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              <span>-</span>
              <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="px-2 py-2 bg-white border border-gray-300 rounded-md
            text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>

              <Button variant="primary">
                  <Upload size={16} />
                  <span>Exportar</span>
              </Button>
          </div>
        </div>
      <div className="flex-1 flex-col w-full p-4 space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TopDashboardCard 
            title="Vendas no período" 
            value={dashboardData.vendasNoPeriodo.valor} 
            trend={dashboardData.vendasNoPeriodo.tendencia} 
            percentage={dashboardData.vendasNoPeriodo.percentual}
            contextText={dashboardData.vendasNoPeriodo.textoContexto} 
          />
          <TopDashboardCard 
            title="Valor total das vendas" 
            value={dashboardData.valorTotalVendas.valor} 
            trend={dashboardData.valorTotalVendas.tendencia} 
            percentage={dashboardData.valorTotalVendas.percentual}
            contextText={dashboardData.valorTotalVendas.textoContexto} 
          />
          <TopDashboardCard 
            title="Ticket médio das vendas" 
            value={dashboardData.ticketMedio.valor} 
            trend={dashboardData.ticketMedio.tendencia} 
            percentage={dashboardData.ticketMedio.percentual}
            contextText={dashboardData.ticketMedio.textoContexto} 
          />
          <TopDashboardCard 
            title="Novos clientes" 
            value={dashboardData.novosClientes.valor} 
            trend={dashboardData.novosClientes.tendencia} 
            percentage={dashboardData.novosClientes.percentual}
            contextText={dashboardData.novosClientes.textoContexto} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Receita Total"
            >
              <TotalRevenueChart data={dashboardData.graficoReceita} />
            </ChartCard>
          </div>
          <div>
            <LastSalesCard sales={dashboardData.ultimasVendas} />
          </div>
        </div>
        
        

      </div>
    </div>
  );
};

export default Home;