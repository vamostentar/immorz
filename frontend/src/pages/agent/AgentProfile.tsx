import { Navigate, useParams } from 'react-router-dom';
import { Footer } from '../../components/Footer';
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">A carregar perfil do agente...</p>
                </div>
            </div>
        );
    }

    // 404 se perfil não público ou erro
    if (error || !agent) {
        return <Navigate to="/404" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <AgentHeader agent={agent} />

                <AgentStats
                    experience={agent.experience}
                    rating={agent.rating}
                    reviewCount={agent.reviewCount}
                    specialties={agent.specialties}
                    propertiesCount={properties.length}
                />

                <AgentBio bio={agent.bio} />

                <AgentProperties properties={properties} />

                <ContactAgentButton agent={agent} />
            </div>
            <Footer />
        </div>
    );
}

// Export default for lazy loading
export default AgentProfile;
