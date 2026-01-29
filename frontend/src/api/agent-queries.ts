import { api } from './client';

export interface AgentProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
    // Agent profile fields
    bio: string | null;
    specialties: string[];
    experience: number | null;
    rating: number | null;
    reviewCount: number | null;
    linkedin: string | null;
    facebook: string | null;
    instagram: string | null;
    isProfilePublic: boolean;
    isProfileApproved: boolean;
}

export interface Property {
    id: string;
    title: string;
    price: number;
    location: string;
    imageUrl?: string;
    agentId: string;
}

/**
 * Fetch agent by ID (public endpoint)
 */
export async function fetchAgentById(id: string): Promise<AgentProfile> {
    const response = await api.get(`/api/v1/agents/${id}`);
    return response.data.data || response.data;
}

/**
 * Fetch properties by agent ID
 */
export async function fetchAgentProperties(agentId: string): Promise<Property[]> {
    const response = await api.get(`/api/v1/properties?agentId=${agentId}`);
    return response.data.data || response.data;
}

/**
 * Fetch all public agents (optional: filter by specialty)
 */
export async function fetchPublicAgents(params?: {
    limit?: number;
    page?: number;
    specialty?: string;
}): Promise<{ data: AgentProfile[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.specialty) queryParams.append('specialty', params.specialty);

    const response = await api.get(`/api/v1/agents?${queryParams.toString()}`);
    return response.data.data || response.data;
}

/**
 * Update agent profile (authenticated endpoint)
 */
export async function updateMyProfile(data: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
    bio: string;
    specialties: string[];
    experience: number;
    linkedin: string;
    facebook: string;
    instagram: string;
    isProfilePublic: boolean;
}>): Promise<AgentProfile> {
    const response = await api.patch('/api/v1/user-profiles/me', data);
    return response.data.data || response.data;
}
