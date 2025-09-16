import { Filter, Upload } from 'lucide-react';

import TopDashboardCard from '../components/dashboard/TopDashboardCard';
import ChartCard from '../components/dashboard/ChartCard';
import TotalRevenueChart from '../components/dashboard/TotalRevenueChart';
import Button from '../components/ui/Button'; 
import LastSalesCard, { type Sale } from '../components/dashboard/LastSalesCard';
import HeaderTitlePage from '../components/HeaderTitlePage';
import DateInput from '../components/ui/DateInput';

const lastSalesData: Sale[] = [
  { id: 123, client: 'Ana Maria Braga', price: 1080.00, timeAgo: '2 min atrás' },
  { id: 122, client: 'Mario Carlos', price: 1310.00, timeAgo: '15 min atrás' },
  { id: 121, client: 'Antonio Mota', price: 880.00, timeAgo: '1 hora atrás' },
  { id: 120, client: 'Juliana Paes', price: 2450.50, timeAgo: '3 horas atrás' },
];

const Home = () => {
  return (
    <div>
        <div className='flex justify-between '>
          <HeaderTitlePage page_name='Dashboard' />
          <div className="flex items-center gap-2 p-4">
              <DateInput label={''}/>
              <span>-</span>
              <DateInput label={''}/>
              <Button variant="primary">
                  <Upload size={16} />
                  <span>Exportar</span>
              </Button>
          </div>
        </div>
      <div className="flex-1 flex-col w-full p-4 space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TopDashboardCard title="Vendas no período" value="84" trend="up" percentage={10} contextText="+ 8 vendas vs. mês passado" />
          <TopDashboardCard title="Valor total das vendas" value="R$45.119" trend="up" percentage={15} contextText="+ R$5.885 vs. mês passado" />
          <TopDashboardCard title="Ticket médio" value="R$539" trend="down" percentage={5} contextText="- R$28 vs. mês passado" />
          <TopDashboardCard title="Novos clientes" value="23" trend="up" percentage={5} contextText="+ 1 cliente vs. mês passado" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Receita Total"
              actions={
                <Button variant="secondary">
                  <Filter size={16} />
                  <span>Filtrar</span>
                </Button>
              }
            >
              <TotalRevenueChart />
            </ChartCard>
          </div>
          <div>
            <LastSalesCard sales={lastSalesData} />
          </div>
        </div>
        
        

      </div>
    </div>
  );
};

export default Home;