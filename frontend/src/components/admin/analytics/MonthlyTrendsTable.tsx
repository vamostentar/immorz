
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * Interface para os dados mensais/diários
 */
interface MonthlyStat {
  month: string;
  views: number;
  leads: number;
  sold?: number;
}

interface MonthlyTrendsTableProps {
  data: MonthlyStat[];
  title?: string;
}

/**
 * Componente que exibe a evolução temporal de visualizações e leads usando AreaChart
 */
export default function MonthlyTrendsTable({ data, title = 'Tendências de Atividade' }: MonthlyTrendsTableProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-500">Visualizações</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-500">Contactos</span>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={2}
                name="Visualizações"
              />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorLeads)" 
                strokeWidth={2}
                name="Contactos"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center text-gray-400 italic">
            Nenhum dado de tendência disponível para o período selecionado.
          </div>
        )}
      </div>
    </div>
  );
}
