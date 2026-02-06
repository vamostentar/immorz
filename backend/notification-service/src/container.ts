import { ApprovalController } from '@/controllers/approval.controller';
import { AuditController } from '@/controllers/audit.controller';
import { NotificationController } from '@/controllers/notification.controller';
import { ApprovalSyncService } from '@/services/approval-sync.service';
import { ApprovalService } from '@/services/approval.service';
import { AuditService } from '@/services/audit.service';
import { EmailService } from '@/services/email.service';
import { NotificationService } from '@/services/notification.service';
import { PrismaClient } from '@prisma/client';
import { asClass, asValue, createContainer, InjectionMode } from 'awilix';

export interface Container {
  prisma: PrismaClient;
  notificationService: NotificationService;
  approvalService: ApprovalService;
  approvalSyncService: ApprovalSyncService;
  auditService: AuditService;
  emailService: EmailService;
  notificationController: NotificationController;
  approvalController: ApprovalController;
  auditController: AuditController;
}

export function createAppContainer() {
  const container = createContainer<Container>({
    injectionMode: InjectionMode.CLASSIC,
  });

  // Prisma Client
  const prisma = new PrismaClient();

  container.register({
    // Database
    prisma: asValue(prisma),

    // Services
    notificationService: asClass(NotificationService).singleton(),
    approvalService: asClass(ApprovalService).singleton(),
    approvalSyncService: asClass(ApprovalSyncService).singleton(),
    auditService: asClass(AuditService).singleton(),
    emailService: asClass(EmailService).singleton(),

    // Controllers
    notificationController: asClass(NotificationController).singleton(),
    approvalController: asClass(ApprovalController).singleton(),
    auditController: asClass(AuditController).singleton(),
  });

  return container;
}

