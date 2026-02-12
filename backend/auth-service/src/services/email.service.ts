import { configService } from '@/config';
import { logger } from '@/utils/logger';
import nodemailer, { Transporter } from 'nodemailer';

export interface ActivationEmailData {
    email: string;
    firstName: string;
    userId: string;
    activationToken: string;
}

export interface WelcomeEmailData {
    email: string;
    firstName: string;
}

export interface PasswordResetEmailData {
    email: string;
    firstName: string;
    resetToken: string;
}

export interface TwoFactorEmailData {
    email: string;
    firstName: string;
    token: string;
}

export class EmailService {
    private transporter?: Transporter;
    private isConfigured = false;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter(): void {
        const emailConfig = configService.emailConfig;

        if (!emailConfig) {
            logger.warn('Email service not configured - SMTP settings missing');
            return;
        }

        try {
            const transportConfig: any = {
                host: emailConfig.host,
                port: emailConfig.port,
                secure: emailConfig.secure,
                auth: emailConfig.auth,
                connectionTimeout: 30000,
                greetingTimeout: 30000,
                socketTimeout: 30000,
            };

            // TLS configuration based on port
            if (emailConfig.port === 465) {
                transportConfig.secure = true;
            } else if (emailConfig.port === 587) {
                transportConfig.secure = false;
                transportConfig.requireTLS = true;
                transportConfig.tls = {
                    rejectUnauthorized: true,
                    minVersion: 'TLSv1.2',
                };
            }

            this.transporter = nodemailer.createTransport(transportConfig);
            this.isConfigured = true;

            logger.info({ host: emailConfig.host, port: emailConfig.port, secure: emailConfig.secure, from: emailConfig.from }, 'Email service initialized');

            // Verify connection in background (non-blocking)
            this.transporter.verify().then(() => {
                logger.info('SMTP connection verified successfully');
            }).catch((error) => {
                logger.error({ error: error.message }, 'SMTP connection verification failed');
            });

        } catch (error: any) {
            logger.error({ error: error.message }, 'Failed to initialize email transporter');
        }
    }

    /**
     * Send activation email to newly registered user
     */
    async sendActivationEmail(data: ActivationEmailData): Promise<boolean> {
        if (!this.isConfigured || !this.transporter) {
            logger.warn({ email: data.email }, 'Email service not configured, skipping activation email');
            return false;
        }

        const emailConfig = configService.emailConfig;
        if (!emailConfig) return false;

        const apiUrl = process.env.API_URL || 'https://www.immorz.pt';
        const activationLink = `${apiUrl}/api/auth/activate/${data.activationToken}`;

        const html = this.generateActivationEmailTemplate({
            firstName: data.firstName,
            activationLink,
        });

        try {
            const info = await this.transporter.sendMail({
                from: emailConfig.from,
                to: data.email,
                subject: 'Ative a sua conta - Immorz',
                html,
                headers: {
                    'X-Priority': '1',
                    'X-Message-Source': 'ribeirazul-auth-service',
                },
            });

            logger.info({ email: data.email, messageId: info.messageId, userId: data.userId }, 'Activation email sent successfully');

            return true;
        } catch (error: any) {
            logger.error({ email: data.email, error: error.message, userId: data.userId }, 'Failed to send activation email');
            return false;
        }
    }

    /**
     * Send welcome email after activation
     */
    async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
        if (!this.isConfigured || !this.transporter) {
            logger.warn({ email: data.email }, 'Email service not configured, skipping welcome email');
            return false;
        }

        const emailConfig = configService.emailConfig;
        if (!emailConfig) return false;

        const html = this.generateWelcomeEmailTemplate({
            firstName: data.firstName,
        });

        try {
            const info = await this.transporter.sendMail({
                from: emailConfig.from,
                to: data.email,
                subject: 'Bem-vindo à Immorz!',
                html,
            });

            logger.info({ email: data.email, messageId: info.messageId }, 'Welcome email sent successfully');

            return true;
        } catch (error: any) {
            logger.error({ email: data.email, error: error.message }, 'Failed to send welcome email');
            return false;
        }
    }

    /**
     * Send 2FA token email
     */
    async sendTwoFactorToken(data: TwoFactorEmailData): Promise<boolean> {
        if (!this.isConfigured || !this.transporter) {
            logger.warn({ email: data.email }, 'Email service not configured, skipping 2FA email');
            return false;
        }

        const emailConfig = configService.emailConfig;
        if (!emailConfig) return false;

        const html = this.generateTwoFactorEmailTemplate({
            firstName: data.firstName,
            token: data.token,
        });

        try {
            const info = await this.transporter.sendMail({
                from: emailConfig.from,
                to: data.email,
                subject: 'Seu código de verificação - Immorz',
                html,
                headers: {
                    'X-Priority': '1', 
                    'X-Message-Source': 'ribeirazul-auth-service',
                },
            });

            logger.info({ email: data.email, messageId: info.messageId }, '2FA email sent successfully');

            return true;
        } catch (error: any) {
            logger.error({ email: data.email, error: error.message }, 'Failed to send 2FA email');
            return false;
        }
    }

    /**
     * Send notification to admin about new user registration
     */
    async sendAdminNotification(data: {
        newUserEmail: string;
        newUserName: string;
        userId: string;
        role: string;
    }): Promise<boolean> {
        if (!this.isConfigured || !this.transporter) {
            logger.warn('Email service not configured, skipping admin notification');
            return false;
        }

        const emailConfig = configService.emailConfig;
        if (!emailConfig) return false;

        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || emailConfig.from;
        const apiUrl = process.env.API_URL || 'https://www.immorz.pt';

        const html = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Novo Registo de Utilizador</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Novo Registo de Utilizador</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p>Foi registado um novo utilizador na plataforma:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; background: #f5f5f5; font-weight: bold; width: 30%;">Nome:</td>
            <td style="padding: 10px; background: #f5f5f5;">${this.escapeHtml(data.newUserName)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;">${this.escapeHtml(data.newUserEmail)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">Perfil:</td>
            <td style="padding: 10px; background: #f5f5f5;">${this.escapeHtml(data.role)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">ID:</td>
            <td style="padding: 10px; font-family: monospace; font-size: 12px;">${data.userId}</td>
          </tr>
        </table>
        <p style="color: #666;">Este utilizador está a aguardar ativação manual pelo administrador.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${apiUrl}/admin/users" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Gerir Utilizadores
          </a>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>Immorz - Plataforma Imobiliária</p>
      </div>
    </body>
    </html>
    `;

        try {
            const info = await this.transporter.sendMail({
                from: emailConfig.from,
                to: adminEmail,
                subject: `[Immorz] Novo registo: ${data.newUserName}`,
                html,
            });

            logger.info({ adminEmail, messageId: info.messageId, newUserId: data.userId }, 'Admin notification email sent');

            return true;
        } catch (error: any) {
            logger.error({ adminEmail, error: error.message }, 'Failed to send admin notification');
            return false;
        }
    }

    private generateActivationEmailTemplate(data: { firstName: string; activationLink: string }): string {
        return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ative a sua conta</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏠 Immorz</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Plataforma Imobiliária</p>
      </div>
      <div style="background: #fff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Olá, ${this.escapeHtml(data.firstName)}! 👋</h2>
        <p>Obrigado por se registar na <strong>Immorz</strong>!</p>
        <p>Para concluir o seu registo e ativar a sua conta, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.activationLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
            ✅ Ativar Conta
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #666;">
          ${data.activationLink}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 13px;">
          <strong>Nota:</strong> Este link é válido por 24 horas. Se não solicitou este registo, por favor ignore este email.
        </p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Immorz. Todos os direitos reservados.</p>
        <p>Este email foi enviado automaticamente. Por favor não responda.</p>
      </div>
    </body>
    </html>
    `;
    }

    private generateWelcomeEmailTemplate(data: { firstName: string }): string {
        return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo à Immorz</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Bem-vindo!</h1>
      </div>
      <div style="background: #fff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Olá, ${this.escapeHtml(data.firstName)}!</h2>
        <p>A sua conta foi <strong>ativada com sucesso</strong>! 🎊</p>
        <p>Agora pode aceder a todas as funcionalidades da plataforma Immorz.</p>
        <div style="background: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #667eea;">O que pode fazer agora:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Consultar propriedades disponíveis</li>
            <li>Guardar favoritos</li>
            <li>Contactar agentes</li>
            <li>Gerir o seu perfil</li>
          </ul>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Immorz. Todos os direitos reservados.</p>
      </div>
    </body>
    </html>
    `;
    }

    private generateTwoFactorEmailTemplate(data: { firstName: string; token: string }): string {
        return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Código de Verificação</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Código de Segurança</h1>
      </div>
      <div style="background: #fff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Olá, ${this.escapeHtml(data.firstName)}!</h2>
        <p>Recebemos um pedido de login na sua conta Immorz.</p>
        <p>Para continuar, insira o código de verificação abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: #f0f7ff; border: 1px dashed #667eea; padding: 15px; display: inline-block; border-radius: 8px;">
            <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${data.token}</span>
          </div>
        </div>

        <p style="color: #666; font-size: 14px;">Este código é válido por 10 minutos.</p>
        <p style="color: #666; font-size: 14px;">Se não tentou fazer login, por favor altere a sua password imediatamente.</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Immorz. Todos os direitos reservados.</p>
      </div>
    </body>
    </html>
    `;
    }

    private escapeHtml(text: string): string {
        const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    async testConnection(): Promise<boolean> {
        if (!this.transporter) return false;
        try {
            await this.transporter.verify();
            return true;
        } catch {
            return false;
        }
    }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null;

export function getEmailService(): EmailService {
    if (!emailServiceInstance) {
        emailServiceInstance = new EmailService();
    }
    return emailServiceInstance;
}
