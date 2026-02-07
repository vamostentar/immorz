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
   * Send password reset email
   */
  async sendPasswordResetEmail(data: {
    to: string;
    name: string;
    action_url: string;
    token: string;
  }) {
    return this.send({
      to: data.to,
      subject: 'Recuperação de Palavra-passe - Ribeirazul',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;">
          <div style="text-align: center; padding: 20px 0;">
            <h2 style="color: #1a365d; margin: 0;">Ribeirazul Imobiliária</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="color: #2d3748; margin-top: 0;">Pedido de Recuperação de Palavra-passe</h3>
            <p>Olá <strong>${data.name}</strong>,</p>
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
            <p>&copy; ${new Date().getFullYear()} Ribeirazul Imobiliária. Todos os direitos reservados.</p>
            <p>Este é um email automático. Por favor não responda diretamente.</p>
          </div>
        </div>
      `,
    });
  }

  /**
   * Send password reset success email
   */
  async sendPasswordResetSuccessEmail(data: {
    to: string;
    name: string;
  }) {
    return this.send({
      to: data.to,
      subject: 'Palavra-passe Alterada com Sucesso - Ribeirazul',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;">
          <div style="text-align: center; padding: 20px 0;">
            <h2 style="color: #1a365d; margin: 0;">Ribeirazul Imobiliária</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="background-color: #f0fff4; color: #38a169; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px;">✓</div>
            </div>
            <h3 style="color: #2d3748; margin-top: 0; text-align: center;">Senha Alterada com Sucesso!</h3>
            <p>Olá <strong>${data.name}</strong>,</p>
            <p>Este email serve para confirmar que a palavra-passe da sua conta na Ribeirazul foi alterada com sucesso.</p>
            <p style="margin-top: 20px;">Se não realizou esta alteração, por favor contacte o nosso suporte imediatamente.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${config.services.auth.replace(':8081', ':3000')}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Ir para o Login</a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #a0aec0;">
            <p>&copy; ${new Date().getFullYear()} Ribeirazul Imobiliária. Todos os direitos reservados.</p>
          </div>
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
