import { NotificationService } from '@/services/notification.service';
import { logger } from '@/utils/logger';
import { NotificationType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

interface NotificationQuery {
  page?: string;
  limit?: string;
  unreadOnly?: string;
  type?: NotificationType;
}

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * GET /notifications
   */
  async list(
    request: FastifyRequest<{ Querystring: NotificationQuery }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const { page, limit, unreadOnly, type } = request.query;

    const result = await this.notificationService.findByUser(userId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      unreadOnly: unreadOnly === 'true',
      type,
    });

    return reply.send({ success: true, ...result });
  }

  /**
   * GET /notifications/unread-count
   */
  async unreadCount(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const count = await this.notificationService.getUnreadCount(userId);
    return reply.send({ success: true, data: { count } });
  }

  /**
   * PATCH /notifications/:id/read
   */
  async markAsRead(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const success = await this.notificationService.markAsRead(request.params.id, userId);
    if (!success) {
      return reply.status(404).send({ success: false, error: 'Notification not found' });
    }

    return reply.send({ success: true });
  }

  /**
   * PATCH /notifications/read-all
   */
  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const count = await this.notificationService.markAllAsRead(userId);
    return reply.send({ success: true, data: { updated: count } });
  }

  /**
   * DELETE /notifications/:id
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const userId = (request as any).userId;
    if (!userId) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }

    const success = await this.notificationService.delete(request.params.id, userId);
    if (!success) {
      return reply.status(404).send({ success: false, error: 'Notification not found' });
    }

    return reply.send({ success: true });
  }

  /**
   * POST /notifications/email
   */
  async sendEmail(
    request: FastifyRequest<{
      Body: {
        to: string;
        template: 'PASSWORD_RESET' | 'PASSWORD_RESET_SUCCESS' | 'APPROVAL' | 'MESSAGE' | 'WELCOME' | 'TWO_FACTOR_TOKEN';
        data: Record<string, any>;
      };
    }>,
    reply: FastifyReply
  ) {
    const { to, template, data } = request.body;

    if (!to || !template || !data) {
      return reply.status(400).send({ success: false, error: 'Missing required fields' });
    }

    try {
      // Import dynamicamente para evitar dependências circulares
      const { queueEmail } = await import('@/jobs/email.worker');

      // Processar baseado no template
      const { EmailService } = await import('@/services/email.service');
      const emailService = new EmailService();

      let success = false;
      if (template === 'PASSWORD_RESET') {
        const html = await this.generatePasswordResetHtml(data);
        await queueEmail({ to, subject: 'Recuperação de Palavra-passe - Ribeirazul', html });
        success = true;
      } else if (template === 'PASSWORD_RESET_SUCCESS') {
        const html = await this.generatePasswordResetSuccessHtml(data);
        await queueEmail({ to, subject: 'Palavra-passe Alterada com Sucesso - Ribeirazul', html });
        success = true;
      } else if (template === 'TWO_FACTOR_TOKEN') {
        const html = await this.generateTwoFactorTokenHtml(data);
        await queueEmail({ to, subject: 'Seu código de verificação - Ribeirazul', html });
        success = true;
      }

      return reply.status(202).send({ success });
    } catch (error) {
      logger.error({ error, template, to }, 'Failed to queue email notification');
      return reply.status(500).send({ success: false, error: 'Internal Server Error' });
    }
  }

  /**
   * POST /notifications
   */
  async create(
    request: FastifyRequest<{
      Body: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        metadata?: Record<string, any>;
      };
    }>,
    reply: FastifyReply
  ) {
    const notification = await this.notificationService.create(request.body);
    return reply.status(201).send({ success: true, data: notification });
  }

  private async generatePasswordResetHtml(data: any): Promise<string> {
    const year = new Date().getFullYear();
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;">
          <div style="text-align: center; padding: 20px 0;">
            <h2 style="color: #1a365d; margin: 0;">Ribeirazul Imobiliária</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="color: #2d3748; margin-top: 0;">Pedido de Recuperação de Palavra-passe</h3>
            <p>Olá <strong>${data.name || 'Utilizador'}</strong>,</p>
            <p>Recebemos um pedido para repor a palavra-passe da sua conta na Ribeirazul.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.action_url}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Repor Palavra-passe</a>
            </div>
            <p style="font-size: 14px; color: #4a5568;">
              Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:
            </p>
            <p style="font-size: 12px; color: #4299e1; word-break: break-all;">
              ${data.action_url}
            </p>
            <p style="margin-top: 25px; font-size: 14px; color: #718096;">
              Este link expirará em 1 hora. Se não solicitou esta alteração, pode ignorar este email com segurança.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #a0aec0;">
            <p>&copy; ${year} Ribeirazul Imobiliária. Todos os direitos reservados.</p>
            <p>Este é um email automático. Por favor não responda diretamente.</p>
          </div>
        </div>
    `;
  }

  private async generatePasswordResetSuccessHtml(data: any): Promise<string> {
    const year = new Date().getFullYear();
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;">
          <div style="text-align: center; padding: 20px 0;">
            <h2 style="color: #1a365d; margin: 0;">Ribeirazul Imobiliária</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="background-color: #f0fff4; color: #38a169; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px;">✓</div>
            </div>
            <h3 style="color: #2d3748; margin-top: 0; text-align: center;">Senha Alterada com Sucesso!</h3>
            <p>Olá <strong>${data.name || 'Utilizador'}</strong>,</p>
            <p>Este email serve para confirmar que a palavra-passe da sua conta na Ribeirazul foi alterada com sucesso.</p>
            <p style="margin-top: 20px;">Se não realizou esta alteração, por favor contacte o nosso suporte imediatamente.</p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #a0aec0;">
            <p>&copy; ${year} Ribeirazul Imobiliária. Todos os direitos reservados.</p>
          </div>
        </div>
    `;
  }

  private async generateTwoFactorTokenHtml(data: any): Promise<string> {
    const year = new Date().getFullYear();
    const token = data.token || '------';
    const name = data.name || 'Utilizador';
    
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;">
          <div style="text-align: center; padding: 20px 0;">
            <h2 style="color: #1a365d; margin: 0;">Ribeirazul Imobiliária</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="color: #2d3748; margin-top: 0; text-align: center;">Código de Segurança</h3>
            <p>Olá <strong>${name}</strong>,</p>
            <p>Recebemos um pedido de acesso à sua conta na Ribeirazul.</p>
            <p>Para concluir a verificação, utilize o código abaixo:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f7fafc; border: 2px dashed #4299e1; padding: 20px; border-radius: 8px; display: inline-block;">
                <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a365d;">${token}</span>
              </div>
            </div>
            
            <p style="font-size: 14px; color: #4a5568; text-align: center;">
              Este código é válido por 10 minutos.
            </p>
            <p style="margin-top: 25px; font-size: 13px; color: #718096; border-top: 1px solid #edf2f7; padding-top: 20px;">
              Se não solicitou este código, por favor <a href="https://immorz.pt/reset-password" style="color: #4299e1;">altere a sua senha</a> imediatamente para proteger a sua conta.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #a0aec0;">
            <p>&copy; ${year} Ribeirazul Imobiliária. Todos os direitos reservados.</p>
          </div>
        </div>
    `;
  }
}
