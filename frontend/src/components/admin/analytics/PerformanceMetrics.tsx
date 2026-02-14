
/**
 * Interface para uma métrica individual
 */
interface MetricValue {
  value: number;
  change: number;
}

interface PerformanceMetricsProps {
  conversionRate: MetricValue;
  averageViews: MetricValue;
  propertiesPerAgent: MetricValue;
}

/**
 * Componente que exibe métricas de performance (KPIs) reais com rácio de eficiência
 */
export default function PerformanceMetrics({ 
  conversionRate, 
  averageViews, 
  propertiesPerAgent 
}: PerformanceMetricsProps) {
  
  const metrics = [
    {
      label: 'Taxa de Conversão',
      value: `${conversionRate.value}%`,
      description: 'Contactos vs Visualizações',
      change: conversionRate.change,
      suffix: ' vs período anterior'
    },
    {
      label: 'Média de Visitas',
      value: averageViews.value,
      description: 'Cliques por imóvel anunciado',
      change: averageViews.change,
      suffix: ' vs período anterior'
    },
    {
      label: 'Imóveis por Agente',
      value: propertiesPerAgent.value,
      description: 'Rácio de ativos por profissional',
      change: propertiesPerAgent.change,
      suffix: ' vs período anterior'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const isPositive = metric.change >= 0;
        const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

        return (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <h4 className="text-sm font-semibold text-gray-500 mb-2 tracking-wide uppercase">{metric.label}</h4>
            <div className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</div>
            <p className="text-xs text-gray-400 mb-3 font-medium">{metric.description}</p>
            <div className={`text-xs font-bold py-1 px-2 rounded-full inline-flex items-center bg-gray-50 ${trendColor}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(metric.change)}% {metric.suffix}
            </div>
          </div>
        );
      })}
    </div>
  );
}
