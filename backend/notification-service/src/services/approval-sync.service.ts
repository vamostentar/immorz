import { config } from '@/config';
import { logger } from '@/utils/logger';
import { ApprovalEntity } from '@prisma/client';

/**
 * Service responsible for synchronizing approval decisions
 * with the original source services (auth-service, properties-service).
 */
export class ApprovalSyncService {
  private readonly authServiceUrl: string;
  private readonly propertiesServiceUrl: string;
  private readonly usersServiceUrl: string;

  constructor() {
    this.authServiceUrl = config.services.auth;
    this.propertiesServiceUrl = config.services.properties;
    this.usersServiceUrl = config.services.users;
  }

  /**
   * Sync an approval decision to the source service.
   * This method is called after an approval is approved or rejected.
   */
  async syncApproval(
    entityType: ApprovalEntity,
    entityId: string,
    isApproved: boolean,
    adminToken?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      switch (entityType) {
        case 'AGENT':
          return await this.syncAgentApproval(entityId, isApproved, adminToken);
        case 'PROPERTY':
          return await this.syncPropertyApproval(entityId, isApproved, adminToken);
        case 'DOCUMENT':
          // Documents may not need external sync - just log
          logger.info({ entityType, entityId, isApproved }, 'Document approval - no external sync needed');
          return { success: true };
        default:
          logger.warn({ entityType, entityId }, 'Unknown entity type for sync');
          return { success: true };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      logger.error({ entityType, entityId, error: errorMessage }, 'Failed to sync approval');
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Sync agent profile approval to user-service.
   * Endpoint: PATCH /api/v1/user-profiles/:userId/approve
   */
  private async syncAgentApproval(
    userId: string,
    isApproved: boolean,
    adminToken?: string
  ): Promise<{ success: boolean; error?: string }> {
    const url = `${this.usersServiceUrl}/api/v1/user-profiles/${userId}/approve`;
    
    logger.info({ userId, isApproved, url }, 'Syncing agent approval to user-service');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ isApproved }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ userId, status: response.status, error: errorText }, 'User-service sync failed');
      return { success: false, error: `User service returned ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    logger.info({ userId, isApproved, response: data }, 'Agent approval synced successfully');
    return { success: true };
  }

  /**
   * Sync property admin status to properties-service.
   * Endpoint: PATCH /api/v1/properties/:id/admin-status
   */
  private async syncPropertyApproval(
    propertyId: string,
    isApproved: boolean,
    adminToken?: string
  ): Promise<{ success: boolean; error?: string }> {
    const url = `${this.propertiesServiceUrl}/api/v1/properties/${propertyId}/admin-status`;
    const adminStatus = isApproved ? 'ACTIVE' : 'INACTIVE';

    logger.info({ propertyId, adminStatus, url }, 'Syncing property approval to properties-service');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ adminStatus }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ propertyId, status: response.status, error: errorText }, 'Properties-service sync failed');
      return { success: false, error: `Properties service returned ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    logger.info({ propertyId, adminStatus, response: data }, 'Property approval synced successfully');
    return { success: true };
  }
}
