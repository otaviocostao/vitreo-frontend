import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GraficoReceita } from '../../types/dashboard';
import { useMemo } from 'react';

interface SalesChartProps {
  data: GraficoReceita[];
  ocultarValores?: boolean;
}

const formatarDataEixo = (dateString: string): string => {
  const dateObj = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(dateObj).replace('.', '');
};

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

const TotalRevenueChart: React.FC<SalesChartProps> = ({ data, ocultarValores = false }) => {

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Não há dados suficientes para exibir o gráfico.
      </div>
    );
  }

  const chartData = useMemo(() => {
    return data.map(item => ({
      name: formatarDataEixo(item.data),
      value: item.valor,
    }));
  }, [data]);

  return (
    <div className={`w-full h-full relative transition-all duration-300 ${ocultarValores ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }} 
            tickFormatter={(value: number) => ocultarValores ? '••••' : `${value / 1000}k`} 
          />
          <Tooltip
            formatter={(value: number) => [ocultarValores ? '••••••' : formatarMoeda(value), 'Receita']}
            contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#374151',
              color: '#ffffff',
              borderRadius: '0.5rem', 
            }}
            cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#bfdbfe" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalRevenueChart;