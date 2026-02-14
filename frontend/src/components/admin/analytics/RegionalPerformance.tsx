import { MapPin } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * Estrutura de dados para desempenho regional
 */
interface RegionData {
  name: string;
  searches: number;
}

interface RegionalPerformanceProps {
  data: RegionData[];
  title?: string;
}

/**
 * Componente que exibe as regiões com maior volume de pesquisas e interesse usando BarChart
 */
export default function RegionalPerformance({ data, title = 'Regiões Mais Procuradas' }: RegionalPerformanceProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <MapPin size={20} className="text-blue-500" />
      </div>

      <div className="flex-grow min-h-[300px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [value || 0, 'Pesquisas']}
              />
              <Bar 
                dataKey="searches" 
                fill="#3b82f6" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center text-gray-400 italic">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <MapPin size={32} className="text-gray-200" />
            </div>
            Nenhum dado regional disponível.
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Total de regiões: {data.length}</span>
            <span>Média de pesquisas: {Math.round(data.reduce((acc, curr) => acc + curr.searches, 0) / data.length)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
