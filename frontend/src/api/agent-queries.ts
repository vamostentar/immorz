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
 * Utility to flatten the nested profile object from the API Gateway aggregator
 */
export function flattenProfile(data: any): AgentProfile {
    if (!data) return data;
    
    // If it's already flat or doesn't have a profile object, return as is
    if (!data.profile) return data as AgentProfile;
    
    const { profile, ...rest } = data;
    
    // Map profileVisibility enum from aggregator back to isProfilePublic boolean
    let isProfilePublic = rest.isProfilePublic;
    if (profile.profileVisibility) {
        isProfilePublic = profile.profileVisibility === 'PUBLIC';
    }

    return {
        ...rest,
        ...profile,
        isProfilePublic: isProfilePublic ?? profile.isProfilePublic ?? rest.isProfilePublic ?? false,
        isProfileApproved: profile.isProfileApproved ?? rest.isProfileApproved ?? false,
        // Ensure arrays are initialized
        specialties: profile.specialties || rest.specialties || []
    } as AgentProfile;
}

/**
 * Fetch agent by ID
 * Note: If fetching 'me' or if the public profile is not yet approved (404),
 * this will attempt to use the authenticated users/me endpoint if possible.
 */
export async function fetchAgentById(id: string): Promise<AgentProfile> {
    try {
        // 1. Try public endpoint first
        const response = await api.get(`/api/v1/agents/${id}`);
        return response.data.data || response.data;
    } catch (error: any) {
        // 2. If it's 404 and we are looking for ourselves (or if we are logged in), 
        // try the authenticated aggregator which doesn't filter by 'isApproved'
        if (error.response?.status === 404) {
            console.warn(`🔍 Public profile for ${id} not found/approved. Trying authenticated aggregator...`);
            try {
                // We use /users/me if we suspect the ID is our own
                // In a production app, we might compare the ID with the one in the JWT
                const meResponse = await api.get('/api/v1/users/me');
                const meData = meResponse.data.data || meResponse.data;
                
                // Only return if the IDs match
                if (meData.id === id) {
                    console.log('✅ Found current user data via aggregator');
                    return flattenProfile(meData);
                }
            } catch (meError) {
                console.error('❌ Failed to fetch fallback profile:', meError);
            }
        }
        throw error;
    }
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
    // Identity fields (Auth Service)
    const identityFields = [
        'firstName', 'lastName', 'phone', 'email', 'avatar',
        // Shared fields needed for Auth Service listing/filtering
        'bio', 'specialties', 'experience', 'linkedin', 'facebook', 'instagram', 'isProfilePublic'
    ];
    
    // Profile fields (User Service)
    const profileFields = [
        'bio', 'specialties', 'experience', 'linkedin', 'facebook', 'instagram', 'avatar',
        'address', 'city', 'state', 'country', 'postalCode'
    ];

    const identityData: Record<string, any> = {};
    const profileData: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
        // 1. Populate Identity Payload
        if (identityFields.includes(key)) {
            identityData[key] = value;
        }

        // 2. Populate Profile Payload
        if (profileFields.includes(key)) {
            profileData[key] = value;
        }

        // 3. Special Mappings
        if (key === 'isProfilePublic') {
            // Send boolean to Auth
            identityData['isProfilePublic'] = value;
            // Send enum to User
            profileData['profileVisibility'] = value ? 'PUBLIC' : 'PRIVATE';
        }
    });

    const promises = [];
    const responseData: Record<string, any> = {};

    // Update identity (Auth Service) if needed
    if (Object.keys(identityData).length > 0) {
        console.log('📝 Updating identity data (Auth):', identityData);
        promises.push(
            api.put('/api/v1/users/me', identityData)
                .then(res => {
                    console.log('✅ Identity update success:', res.data);
                    Object.assign(responseData, res.data.data || res.data);
                })
                .catch(err => {
                    console.error('❌ Identity update failed:', err.response?.data || err.message);
                    throw err;
                })
        );
    }

    // Update profile (User Service) if needed
    if (Object.keys(profileData).length > 0) {
        console.log('📝 Updating profile data (User):', profileData);
        promises.push(
            api.put('/api/v1/user-profiles/me', profileData)
                .then(res => {
                    console.log('✅ Profile update success:', res.data);
                    Object.assign(responseData, res.data.data || res.data);
                })
                .catch(err => {
                    console.error('❌ Profile update failed:', err.response?.data || err.message);
                    throw err;
                })
        );
    }

    try {
        await Promise.all(promises);
        console.log('🎉 All update promises completed successfully');
    } catch (error) {
        console.error('⚠️ One or more update promises failed, but proceeding to fetch fresh profile');
    }
    
    // Fetch fresh profile from the aggregator and flatten it
    console.log('🔄 Fetching fresh profile data from aggregator...');
    try {
        const response = await api.get('/api/v1/users/me');
        const userData = response.data.data || response.data;
        const freshProfile = flattenProfile(userData);
        console.log('✅ Fresh flattened profile obtained:', freshProfile);
        return freshProfile;
    } catch (e) {
        console.error('❌ Error fetching fresh profile:', e);
        return flattenProfile(responseData) || (responseData as AgentProfile);
    }
}

/**
 * Validates if the current user is an agent and has an active profile
 */
export async function checkAgentStatus(): Promise<{ isAgent: boolean; isProfileComplete: boolean }> {
    try {
        const response = await api.get('/api/v1/users/me');
        const userData = response.data.data || response.data;
        const profile = flattenProfile(userData);
        return {
            isAgent: true,
            isProfileComplete: !!(profile.firstName && profile.lastName && profile.email)
        };
    } catch (error) {
        return { isAgent: false, isProfileComplete: false };
    }
}
