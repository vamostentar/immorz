import { useEffect, useState } from 'react';
import { AgentProfile, fetchAgentById, fetchAgentProperties, Property } from '../api/agent-queries';

interface UseAgentProfileReturn {
    agent: AgentProfile | null;
    properties: Property[];
    isLoading: boolean;
    error: Error | null;
}

/**
 * Custom hook para carregar perfil de agente e suas propriedades
 * @param agentId ID do agente
 * @returns Dados do agente, propriedades, estado de loading e erro
 */
export function useAgentProfile(agentId: string): UseAgentProfileReturn {
    const [agent, setAgent] = useState<AgentProfile | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadAgentData() {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch agent profile
                const agentData = await fetchAgentById(agentId);

                if (isCancelled) return;
                setAgent(agentData);

                // Fetch agent's properties
                const propertiesData = await fetchAgentProperties(agentId);

                if (isCancelled) return;
                setProperties(propertiesData);

            } catch (err) {
                if (isCancelled) return;
                setError(err instanceof Error ? err : new Error('Erro ao carregar perfil do agente'));
                setAgent(null);
                setProperties([]);
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadAgentData();

        return () => {
            isCancelled = true;
        };
    }, [agentId]);

    return { agent, properties, isLoading, error };
}
