
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * Interface para os dados de distribuição
 */
interface DistributionData {
  name: string;
  percentage: number;
  color: string;
  value?: number; // Valor real se disponível
}

interface PropertyDistributionProps {
  data: DistributionData[];
  title?: string;
}

/**
 * Componente que exibe a distribuição de propriedades por tipo usando PieChart
 */
export default function PropertyDistribution({ data, title = 'Propriedades por Tipo' }: PropertyDistributionProps) {
  // Cores hexadecimais para o Recharts (mapeadas das classes do Tailwind se possível, ou definidas aqui)
  const COLORS = {
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-purple-500': '#a855f7',
    'bg-orange-500': '#f97316',
    'bg-pink-500': '#ec4899',
  };

  const chartData = data.map(item => ({
    name: item.name,
    value: item.percentage,
    color: COLORS[item.color as keyof typeof COLORS] || '#94a3b8'
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="flex-grow min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'Percentagem']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((type, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
              <span className="text-gray-600">{type.name}</span>
            </div>
            <span className="font-semibold text-gray-800">{type.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
