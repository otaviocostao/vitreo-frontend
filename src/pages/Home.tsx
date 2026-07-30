import { Eye, EyeOff } from 'lucide-react';

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

const paraInputDate = (data: Date) => {
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Home = () => {

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [ocultarValores, setOcultarValores] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vitreo_ocultar_valores');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleOcultarValores = () => {
    setOcultarValores((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vitreo_ocultar_valores', JSON.stringify(next));
      } catch (e) {
        console.error('Erro ao salvar preferência no localStorage', e);
      }
      return next;
    });
  };

  const hoje = new Date();
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const [dataInicio, setDataInicio] = useState(paraInputDate(primeiroDiaDoMes));
  const [dataFim, setDataFim] = useState(paraInputDate(ultimoDiaDoMes));

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDashboardData(dataInicio, dataFim);
      setDashboardData(data);
    } catch (err) {
      setError('Falha ao carregar os dados do Dashboard. Tente novamente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  if (error) {
    return <ErrorPopup message={error} onClose={() => setError(null)} />;
  }

  return (
    <div>
      <div className='flex justify-between items-center flex-wrap gap-4'>
        <HeaderTitlePage page_name='Dashboard' />
        <div className="flex items-center gap-2 p-4">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="px-2 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <span>-</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="px-2 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            variant="secondary"
            onClick={toggleOcultarValores}
            className="flex items-center gap-2"
          >
            {ocultarValores ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          <span>Carregando dados do dashboard...</span>
        </div>
      ) : !dashboardData ? (
        <div className="p-4 text-center text-gray-500">Nenhum dado encontrado para o período selecionado.</div>
      ) : (
        <div className="flex-1 flex-col w-full p-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TopDashboardCard
              title="Vendas no período"
              value={dashboardData.vendasNoPeriodo.valor}
              trend={dashboardData.vendasNoPeriodo.tendencia}
              percentage={dashboardData.vendasNoPeriodo.percentual}
              contextText={dashboardData.vendasNoPeriodo.textoContexto}
              ocultarValores={ocultarValores}
            />
            <TopDashboardCard
              title="Valor total das vendas"
              value={dashboardData.valorTotalVendas.valor}
              trend={dashboardData.valorTotalVendas.tendencia}
              percentage={dashboardData.valorTotalVendas.percentual}
              contextText={dashboardData.valorTotalVendas.textoContexto}
              ocultarValores={ocultarValores}
            />
            <TopDashboardCard
              title="Ticket médio das vendas"
              value={dashboardData.ticketMedio.valor}
              trend={dashboardData.ticketMedio.tendencia}
              percentage={dashboardData.ticketMedio.percentual}
              contextText={dashboardData.ticketMedio.textoContexto}
              ocultarValores={ocultarValores}
            />
            <TopDashboardCard
              title="Novos clientes"
              value={dashboardData.novosClientes.valor}
              trend={dashboardData.novosClientes.tendencia}
              percentage={dashboardData.novosClientes.percentual}
              contextText={dashboardData.novosClientes.textoContexto}
              ocultarValores={ocultarValores}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartCard title="Receita Bruta Total">
                <TotalRevenueChart data={dashboardData.graficoReceita} ocultarValores={ocultarValores} />
              </ChartCard>
            </div>
            <div>
              <LastSalesCard sales={dashboardData.ultimasVendas} ocultarValores={ocultarValores} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;