import { config } from '@/config';
import { logger } from '@/utils/logger';
import nodemailer, { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    if (!config.smtp.host || !config.smtp.user) {
      logger.warn('SMTP not configured, email sending disabled');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    logger.info({ host: config.smtp.host }, 'SMTP transporter initialized');
  }

  /**
   * Send an email
   */
  async send(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('SMTP not configured, skipping email send');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${config.smtp.fromName}" <${config.smtp.from}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info({ messageId: info.messageId, to: options.to }, 'Email sent successfully');
      return true;
    } catch (error) {
      logger.error({ error, to: options.to }, 'Failed to send email');
      throw error;
    }
  }

  /**
   * Send approval notification email
   */
  async sendApprovalNotification(data: {
    to: string;
    entityType: string;
    entityId: string;
    status: 'approved' | 'rejected';
    notes?: string;
  }) {
    const statusText = data.status === 'approved' ? 'aprovado' : 'rejeitado';
    const entityLabel = data.entityType === 'AGENT' ? 'O seu perfil de agente' : 'O seu imóvel';

    return this.send({
      to: data.to,
      subject: `${entityLabel} foi ${statusText} - Ribeirazul`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Ribeirazul Imobiliária</h2>
          <p>Olá,</p>
          <p>${entityLabel} foi <strong>${statusText}</strong>.</p>
          ${data.notes ? `<p><em>Notas: ${data.notes}</em></p>` : ''}
          <p>Para mais informações, aceda ao <a href="https://ribeirazul.com/dashboard">seu painel</a>.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #718096;">
            Este é um email automático. Por favor não responda diretamente.
          </p>
        </div>
      `,
    });
  }

  /**
   * Send new message notification
   */
  async sendNewMessageNotification(data: {
    to: string;
    fromName: string;
    subject: string;
    preview: string;
  }) {
    return this.send({
      to: data.to,
      subject: `Nova mensagem de ${data.fromName} - Ribeirazul`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Ribeirazul Imobiliária</h2>
          <p>Recebeu uma nova mensagem de <strong>${data.fromName}</strong>:</p>
          <div style="background: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin: 15px 0;">
            <p style="margin: 0;"><strong>${data.subject}</strong></p>
            <p style="margin: 10px 0 0; color: #4a5568;">${data.preview}</p>
          </div>
          <p><a href="https://ribeirazul.com/dashboard/messages" style="color: #4299e1;">Ver mensagem completa</a></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #718096;">
            Este é um email automático. Por favor não responda diretamente.
          </p>
        </div>
      `,
    });
  }

  /**
   * Verify SMTP connection
   */
  async verify(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('SMTP connection verified');
      return true;
    } catch (error) {
      logger.error({ error }, 'SMTP verification failed');
      return false;
    }
  }
}
