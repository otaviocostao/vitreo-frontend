import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '21 Out', value: 2400 }, { name: '23 Out', value: 2210 },
  { name: '25 Out', value: 2290 }, { name: '28 Out', value: 2000 },
  { name: '01 Nov', value: 2181 }, { name: '05 Nov', value: 2500 },
  { name: '10 Nov', value: 3100 }, { name: '15 Nov', value: 2900 },
  { name: '18 Nov', value: 1815 }, { name: '21 Nov', value: 2390 },
];

const TotalRevenueChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value: number) => `${value / 1000}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            color: '#ffffff',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#bfdbfe" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TotalRevenueChart;