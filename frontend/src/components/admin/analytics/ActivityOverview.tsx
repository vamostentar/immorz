import {
    Briefcase,
    Home,
    MessageSquare,
    TrendingUp
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

/**
 * Interface para os contadores de atividade
 */
interface ActivityStats {
  propertiesViewed: number;
  contactsReceived: number;
  propertiesSold: number;
  newAgents: number;
}

interface TrendPoint {
  views: number;
  leads: number;
}

interface ActivityOverviewProps {
  stats: ActivityStats;
  trends?: TrendPoint[];
  title?: string;
}

/**
 * Componente que exibe um resumo estatístico da atividade recente (últimos 30 dias) com Sparklines
 */
export default function ActivityOverview({ stats, trends = [], title = 'Resumo de Atividade (Últimos 30 dias)' }: ActivityOverviewProps) {
  const items = [
    { 
      label: 'Propriedades Visualizadas', 
      value: stats.propertiesViewed, 
      color: 'text-blue-600', 
      stroke: '#2563eb',
      icon: Home,
      trendData: trends.map(t => ({ value: t.views }))
    },
    { 
      label: 'Contactos Recebidos', 
      value: stats.contactsReceived, 
      color: 'text-green-600', 
      stroke: '#16a34a',
      icon: MessageSquare,
      trendData: trends.map(t => ({ value: t.leads }))
    },
    { 
      label: 'Propriedades Vendidas', 
      value: stats.propertiesSold, 
      color: 'text-purple-600', 
      stroke: '#9333ea',
      icon: TrendingUp,
      trendData: [] // Mock empty for now
    },
    { 
      label: 'Novos Agentes', 
      value: stats.newAgents, 
      color: 'text-orange-600', 
      stroke: '#ea580c',
      icon: Briefcase,
      trendData: [] // Mock empty for now
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col p-5 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100 group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={20} />
              </div>
              {item.trendData.length > 0 && (
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={item.trendData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={item.stroke} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div className={`text-4xl font-bold mb-1 tracking-tight ${item.color}`}>
              {item.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
