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
    const identityFields = ['firstName', 'lastName', 'phone'];
    const identityData: Record<string, any> = {};
    const profileData: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
        if (identityFields.includes(key)) {
            identityData[key] = value;
        } else {
            profileData[key] = value;
        }
    });

    const promises = [];
    const responseData: Record<string, any> = {};

    // Update identity (Auth Service) if needed
    if (Object.keys(identityData).length > 0) {
        // Auth service users route is /api/v1/users/me
        promises.push(
            api.put('/api/v1/users/me', identityData)
                .then(res => {
                    Object.assign(responseData, res.data.data || res.data);
                })
        );
    }

    // Update profile (User Service) if needed
    if (Object.keys(profileData).length > 0) {
        // User service profile route is /api/v1/user-profiles/me
        promises.push(
            api.put('/api/v1/user-profiles/me', profileData)
                .then(res => {
                    Object.assign(responseData, res.data.data || res.data);
                })
        );
    }

    await Promise.all(promises);
    
    // If we have mixed data, we might be missing some fields if we just rely on the update response
    // (e.g. auth update returns user fields, profile update returns profile fields)
    // To ensure the UI has the complete picture, we should merge the input data with the response
    // or fetch the fresh profile. For performance, let's merge input data with collected response data.
    
    // However, to be 100% sure and robust as requested, let's fetch the fresh full profile
    // This ensures that any server-side logic (triggers, default values) is reflected.
    // Use authenticated endpoint for my profile
    const response = await api.get('/api/v1/user-profiles/me');
    const freshProfile = response.data.data || response.data;
    return freshProfile as AgentProfile;
}

/**
 * Validates if the current user is an agent and has an active profile
 */
export async function checkAgentStatus(): Promise<{ isAgent: boolean; isProfileComplete: boolean }> {
    try {
        const response = await api.get('/api/v1/user-profiles/me');
        const profile = response.data.data || response.data;
        return {
            isAgent: true, // If they can access this, they are logged in. Role check is separate.
            isProfileComplete: !!(profile.firstName && profile.lastName && profile.email)
        };
    } catch (error) {
        return { isAgent: false, isProfileComplete: false };
    }
}
