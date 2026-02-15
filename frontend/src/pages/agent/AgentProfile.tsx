import { Navigate, useParams } from 'react-router-dom';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { AgentBio } from '../../components/agent/AgentBio';
import { AgentHeader } from '../../components/agent/AgentHeader';
import { AgentProperties } from '../../components/agent/AgentProperties';
import { AgentStats } from '../../components/agent/AgentStats';
import { ContactAgentButton } from '../../components/agent/ContactAgentButton';
import { useAgentProfile } from '../../hooks/useAgentProfile';

export function AgentProfile() {
    const { id } = useParams<{ id: string }>();
    const { agent, properties, isLoading, error } = useAgentProfile(id!);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium animate-pulse">A elevar a experiência...</p>
                </div>
            </div>
        );
    }

    // 404 se perfil não público ou erro
    if (error || !agent) {
        return <Navigate to="/404" replace />;
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar showBack backLabel="Equipa" />
            
            <main className="pt-28 pb-16">
                <div className="container mx-auto px-4 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <AgentHeader agent={agent} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <AgentStats
                                experience={agent.experience}
                                rating={agent.rating}
                                reviewCount={agent.reviewCount}
                                specialties={agent.specialties}
                                propertiesCount={properties.length}
                            />

                            <AgentBio bio={agent.bio} />

                            <AgentProperties properties={properties} />
                        </div>

                        {/* Sidebar Column (Future proofing for more info) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                {/* The Contact Card could be here instead of just a button */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Interessado?</h3>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Fale diretamente com {agent.firstName} para obter as melhores condições no seu próximo negócio imobiliário.
                                    </p>
                                    <ContactAgentButton agent={agent} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// Export default for lazy loading
export default AgentProfile;
