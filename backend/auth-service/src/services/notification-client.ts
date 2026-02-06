import { config } from '@/config';
import { logger } from '@/utils/logger';

/**
 * Client to communicate with the Notification Service.
 * Used to create approval requests when new agents are created.
 */
export class NotificationClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.notificationsServiceUrl;
  }

  /**
   * Create an approval request in the notification service.
   * This is called when a new agent is created or when a user's role is changed to agent.
   */
  async createApprovalRequest(
    entityType: 'AGENT' | 'PROPERTY' | 'DOCUMENT',
    entityId: string,
    requestedBy?: string,
    metadata?: {
      name?: string;
      email?: string;
      priority?: 'low' | 'medium' | 'high';
      [key: string]: any;
    }
  ): Promise<{ success: boolean; approvalId?: string; error?: string }> {
    const url = `${this.baseUrl}/api/v1/approvals`;

    try {
      logger.info({ entityType, entityId, requestedBy, url }, 'Creating approval request');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType,
          entityId,
          requestedBy,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          { entityType, entityId, status: response.status, error: errorText },
          'Failed to create approval request'
        );
        return { success: false, error: `Notification service returned ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      logger.info({ entityType, entityId, approvalId: data.data?.id }, 'Approval request created');
      return { success: true, approvalId: data.data?.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ entityType, entityId, error: errorMessage }, 'Exception creating approval request');
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Cancel an existing approval request.
   * Called when an agent is deleted or their role is changed away from agent.
   */
  async cancelApprovalRequest(
    entityType: 'AGENT' | 'PROPERTY' | 'DOCUMENT',
    entityId: string
  ): Promise<{ success: boolean; error?: string }> {
    // For now, we don't have a cancel endpoint, so log and return success
    logger.info({ entityType, entityId }, 'Approval cancellation requested (not implemented)');
    return { success: true };
  }
}

// Singleton instance
let notificationClientInstance: NotificationClient | null = null;

export function getNotificationClient(): NotificationClient {
  if (!notificationClientInstance) {
    notificationClientInstance = new NotificationClient();
  }
  return notificationClientInstance;
}
