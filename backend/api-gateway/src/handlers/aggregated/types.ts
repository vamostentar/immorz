/**
 * Tipos e Interfaces para o Agregador - API Gateway
 */

export interface AggregatedUser {
    // Dados de identidade (auth-service)
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: {
        id: string;
        name: string;
        displayName: string;
        permissions: string[];
    };
    isActive: boolean;
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: string;
    updatedAt: string;

    // Dados de perfil (user-service ou auth-service)
    profile?: {
        avatar?: string;
        dateOfBirth?: string;
        gender?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        preferredContactMethod?: string;
        language?: string;
        timezone?: string;
        profileVisibility?: string;
        allowMarketing?: boolean;
        allowNotifications?: boolean;
        
        // Novos campos de agente (do auth-service)
        specialties?: string[];
        rating?: number;
        reviewCount?: number;
        experience?: number;
        linkedin?: string;
        facebook?: string;
        instagram?: string;
        isProfilePublic?: boolean;
        isProfileApproved?: boolean;
        bio?: string; // Bio também pode vir do auth
    };
}
