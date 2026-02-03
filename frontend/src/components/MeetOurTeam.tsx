import { AgentProfile, fetchPublicAgents } from '@/api/agent-queries';
import { Award, CheckCircle, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function MeetOurTeam() {
    const [agents, setAgents] = useState<AgentProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAgents() {
            try {
                const response = await fetchPublicAgents({ limit: 4 });
                const agentsList = Array.isArray(response) ? response : (response.data ?? []);
                setAgents(agentsList);
            } catch (error) {
                console.error('Erro ao carregar agentes:', error);
            } finally {
                setLoading(false);
            }
        }
        loadAgents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (agents.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-3xl mx-4 sm:mx-6 lg:mx-8 border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <User size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">A nossa equipa está a crescer</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    De momento não temos perfis públicos disponíveis, mas os nossos especialistas continuam a trabalhar para si. Volte em breve!
                </p>
            </div>
        );
    }

    return (
        <section id="equipa" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Conheça a nossa Equipa
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Especialistas dedicados a encontrar o imóvel perfeito para si, com transparência e excelência.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {agents.map((agent) => (
                        <Link 
                            key={agent.id} 
                            to={`/agent/${agent.id}`}
                            className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-6 text-center"
                        >
                            <div className="relative mb-6">
                                {agent.avatar ? (
                                    <img 
                                        src={agent.avatar} 
                                        alt={`${agent.firstName} ${agent.lastName}`} 
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                                        <User size={48} className="text-blue-500" />
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                                    <CheckCircle size={16} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {agent.firstName} {agent.lastName}
                            </h3>
                            
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                <Award size={14} className="text-blue-500" />
                                <span>{agent.experience || 0} anos de experiência</span>
                            </div>

                            <div className="mt-4 flex flex-wrap justify-center gap-1">
                                {(agent.specialties || []).slice(0, 2).map((specialty, idx) => (
                                    <span 
                                        key={idx} 
                                        className="text-[10px] uppercase tracking-wider font-semibold py-1 px-2 bg-white text-gray-600 rounded-md border border-gray-200"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 w-full pt-4 border-t border-gray-200 flex items-center justify-center text-blue-600 font-medium text-sm gap-2">
                                <span>Ver Perfil</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
