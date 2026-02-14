import { useTriggerAggregation } from '@/api/admin/analytics-mutations';
import { useAnalyticsData } from '@/api/admin/analytics-queries';
import AdminLayout from '@/components/admin/AdminLayout';
import ActivityOverview from '@/components/admin/analytics/ActivityOverview';
import MonthlyTrendsTable from '@/components/admin/analytics/MonthlyTrendsTable';
import PerformanceMetrics from '@/components/admin/analytics/PerformanceMetrics';
import PropertyDistribution from '@/components/admin/analytics/PropertyDistribution';
import RegionalPerformance from '@/components/admin/analytics/RegionalPerformance';
import { ListSkeleton } from '@/components/Skeleton';
import { clsx } from 'clsx';
import { RefreshCw } from 'lucide-react';

/**
 * Página de Análises e Relatórios do Painel Administrativo
 */
export default function Analytics() {
  const { data: analyticsData, isLoading, error, refetch } = useAnalyticsData();
  const { mutate: triggerAggregation, isPending: isAggregating } = useTriggerAggregation();

  const handleRefresh = () => {
    triggerAggregation(undefined, {
      onSuccess: () => {
        refetch();
      }
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Análises e Relatórios</h2>
          <ListSkeleton rows={10} />
        </div>
      </AdminLayout>
    );
  }

  if (error || !analyticsData) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Análises e Relatórios</h2>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm font-semibold mb-1">Erro ao carregar dados de análise</p>
            <p className="text-red-700 text-sm">Não foi possível estabelecer ligação com o serviço de analytics. Por favor, tente mais tarde.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Análises e Relatórios</h2>
            <p className="text-gray-600 mt-1">Monitorize o desempenho da plataforma e tendências do mercado imobiliário.</p>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={isAggregating}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 disabled:opacity-50",
              isAggregating && "cursor-not-allowed"
            )}
            title="Sincronizar dados agora"
          >
            <RefreshCw size={16} className={clsx(isAggregating && "animate-spin text-blue-500")} />
            {isAggregating ? 'A sincronizar...' : 'Atualizar Dados'}
          </button>
        </div>
        
        {/* Resumo de Atividade Principal */}
        <ActivityOverview 
          stats={analyticsData.activitySummary} 
          trends={analyticsData.monthlyStats} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribuição por Tipo de Imóvel */}
          <PropertyDistribution data={analyticsData.propertyTypes} />

          {/* Performance por Região */}
          <RegionalPerformance data={analyticsData.topRegions} />
        </div>

        {/* Métricas de Performance (KPIs) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Métricas de Performance da Plataforma</h3>
          <PerformanceMetrics 
            conversionRate={analyticsData.performanceMetrics.conversionRate}
            averageViews={analyticsData.performanceMetrics.averageViews}
            propertiesPerAgent={analyticsData.performanceMetrics.propertiesPerAgent}
          />
        </div>

        {/* Histórico e Tendências Mensais */}
        <MonthlyTrendsTable data={analyticsData.monthlyStats} />
      </div>
    </AdminLayout>
  );
}
