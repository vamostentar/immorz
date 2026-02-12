import { analyzeLeadUrl, LeadOpportunity } from '@/api/intelligence';
import {
    AlertCircle,
    ArrowRight,
    Bath,
    Bed,
    BrainCircuit,
    CheckCircle2,
    Euro,
    ExternalLink,
    Loader2,
    Mail,
    MapPin,
    Maximize,
    Phone,
    Search,
    Target,
    TrendingUp,
    User
} from 'lucide-react';
import React, { useState } from 'react';

export function LeadHunterTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeadOpportunity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeLeadUrl(url);
      setResult(data);
    } catch (err: any) {
      console.error('Erro na análise:', err);
      const errorMsg = err.response?.data?.error?.message || err.message || 'Ocorreu um erro ao analisar o URL.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BrainCircuit className="w-8 h-8" />
            Lead Hunter IA
          </h1>
          <p className="mt-2 text-sky-100 max-w-2xl">
            Cole o URL de qualquer imóvel (OLX, Idealista, Imovirtual) e deixe a nossa inteligência artificial extrair os dados e calcular o potencial de mercado instantaneamente.
          </p>
        </div>
        <Target className="absolute -right-8 -bottom-8 w-64 h-64 text-white/10 rotate-12" />
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <form onSubmit={handleAnalyze} className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all shadow-sm"
              placeholder="https://www.olx.pt/d/anuncio/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A Analisar...
              </>
            ) : (
              <>
                Capturar Lead
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-red-800 dark:text-red-400 font-semibold">Falha na Extração</h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            {(error.includes('quota') || error.includes('OpenAI')) && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-2 italic font-medium">
                * Nota: A conta OpenAI está sem créditos. A infraestrutura de captura está a funcionar, mas a análise semântica requer quota de IA.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Dados Extraídos via IA
                </span>
                <span className="bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold px-2 py-1 rounded">
                  {result.extractedLead.portalName}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{result.extractedLead.title}</h2>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{result.extractedLead.location}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-400 mb-1">
                      <Euro className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.extractedLead.price.toLocaleString('pt-PT')}€
                    </div>
                    <div className="text-xs text-gray-500">Preço Base</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-400 mb-1">
                      <Bed className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.extractedLead.bedrooms || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Quartos</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-400 mb-1">
                      <Bath className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.extractedLead.bathrooms || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">WCs</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-400 mb-1">
                      <Maximize className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.extractedLead.area ? `${result.extractedLead.area}m²` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Área Útil</div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descrição Detectada</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-4">
                    {result.extractedLead.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-sky-600" />
                Informações de Contacto
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-lg flex items-center justify-center text-sky-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Vendedor</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {result.extractedLead.contactInfo?.name || 'Não detectado'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-lg flex items-center justify-center text-sky-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Telefone</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {result.extractedLead.contactInfo?.phone || 'Não detectado'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-lg flex items-center justify-center text-sky-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Email</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {result.extractedLead.contactInfo?.email || 'Não detectado'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Score de Mercado</h3>
                <TrendingUp className="w-5 h-5 text-sky-600" />
              </div>
              
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-gray-50 dark:border-gray-900 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-sky-500"
                      strokeDasharray={351.8}
                      strokeDashoffset={351.8 * (1 - result.marketScore / 100)}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-white">
                    {result.marketScore}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Atratividade</span>
                  <span className="font-medium text-green-600">Alta</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Risco de Negócio</span>
                  <span className="font-medium text-blue-600">Baixo</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-sky-900 dark:text-sky-400">Recomendação</div>
                    <p className="text-xs text-sky-800 dark:text-sky-300 mt-1 leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {result.isHighPriority && (
                <div className="mt-4 bg-orange-500 text-white p-3 rounded-xl text-center font-bold text-sm animate-pulse">
                  🔥 PRIORIDADE MÁXIMA
                </div>
              )}
            </div>

            {/* Action Box */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-4">Próximos Passos</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                  Adicionar aos Meus Imóveis
                </button>
                <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold text-sm hover:bg-gray-700 transition-colors border border-gray-700 flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Ver Link Original
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pronto para Capturar?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Insira o link de um imóvel acima para começar a prospeção inteligente.
          </p>
        </div>
      )}
    </div>
  );
}
