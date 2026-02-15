import {
    CreateNotificationData,
    CreatePropertyInterestData,
    CreateSavedPropertyData,
    CreateSearchHistoryData,
    CreateUserProfileData,
    DatabaseConnection,
    DatabaseTransaction,
    FindManyOptions,
    NotificationFindOptions,
    NotificationRepositoryInterface,
    PropertyInterestRepositoryInterface,
    SavedPropertyRepositoryInterface,
    SearchHistoryRepositoryInterface,
    UpdateNotificationData,
    UpdatePropertyInterestData,
    UpdateSavedPropertyData,
    UpdateUserProfileData,
    UserPreferencesRepositoryInterface,
    UserProfileRepositoryInterface
} from '@/interfaces/database.interface';
import { Prisma, PrismaClient } from '@prisma/client';

/**
 * Implementação do banco de dados usando Prisma
 * Segue o padrão black box - esconde detalhes de implementação
 */
export class PrismaDatabase implements DatabaseConnection {
  private prisma: PrismaClient;

  constructor(config: { url: string; log?: string[] }) {
    this.prisma = new PrismaClient({
      datasourceUrl: config.url,
      log: config.log as any,
    });
  }

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async transaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const transactionDb = new PrismaDatabaseTransaction(tx);
      return callback(transactionDb);
    });
  }

  get userProfiles(): UserProfileRepositoryInterface {
    return new PrismaUserProfileRepository(this.prisma);
  }

  get userPreferences(): UserPreferencesRepositoryInterface {
    return new PrismaUserPreferencesRepository(this.prisma);
  }

  get propertyInterests(): PropertyInterestRepositoryInterface {
    return new PrismaPropertyInterestRepository(this.prisma);
  }

  get savedProperties(): SavedPropertyRepositoryInterface {
    return new PrismaSavedPropertyRepository(this.prisma);
  }

  get searchHistory(): SearchHistoryRepositoryInterface {
    return new PrismaSearchHistoryRepository(this.prisma);
  }

  get notifications(): NotificationRepositoryInterface {
    return new PrismaNotificationRepository(this.prisma);
  }
}

/**
 * Implementação de transação usando Prisma
 */
class PrismaDatabaseTransaction implements DatabaseTransaction {
  constructor(private tx: any) { }

  get userProfiles(): UserProfileRepositoryInterface {
    return new PrismaUserProfileRepository(this.tx);
  }

  get userPreferences(): UserPreferencesRepositoryInterface {
    return new PrismaUserPreferencesRepository(this.tx);
  }

  get propertyInterests(): PropertyInterestRepositoryInterface {
    return new PrismaPropertyInterestRepository(this.tx);
  }

  get savedProperties(): SavedPropertyRepositoryInterface {
    return new PrismaSavedPropertyRepository(this.tx);
  }

  get searchHistory(): SearchHistoryRepositoryInterface {
    return new PrismaSearchHistoryRepository(this.tx);
  }

  get notifications(): NotificationRepositoryInterface {
    return new PrismaNotificationRepository(this.tx);
  }
}

/**
 * Implementação do repositório de perfis de utilizadores
 */
class PrismaUserProfileRepository implements UserProfileRepositoryInterface {
  constructor(private prisma: PrismaClient | any) { }

  async findById(id: string) {
    return this.prisma.userProfile.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.userProfile.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserProfileData) {
    return this.prisma.userProfile.create({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    });
  }

  async update(id: string, data: UpdateUserProfileData) {
    console.log(`💾 [DEBUG] Prisma update calling for user ${id} with data:`, JSON.stringify(data, null, 2));
    return this.prisma.userProfile.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.userProfile.delete({
      where: { id },
    });
  }

  async findMany(options: FindManyOptions) {
    return this.prisma.userProfile.findMany({
      skip: options.skip,
      take: options.take,
      where: options.where,
      orderBy: options.orderBy,
      include: options.include,
    });
  }

  async emailExists(email: string, excludeUserId?: string) {
    const where: any = { email };
    if (excludeUserId) {
      where.id = { not: excludeUserId };
    }

    const count = await this.prisma.userProfile.count({ where });
    return count > 0;
  }

  async verifyEmail(id: string) {
    await this.prisma.userProfile.update({
      where: { id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  }

  async verifyPhone(id: string) {
    await this.prisma.userProfile.update({
      where: { id },
      data: {
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
      },
    });
  }

  async updateLastActivity(id: string) {
    await this.prisma.userProfile.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  async count(where?: any) {
    return this.prisma.userProfile.count({
      where,
    });
  }
}

/**
 * Implementação do repositório de preferências de utilizadores
 */
class PrismaUserPreferencesRepository implements UserPreferencesRepositoryInterface {
  constructor(private prisma: PrismaClient | any) { }

  async findByUserId(userId: string) {
    return this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  private mapUserPreferences(data: any): any {
    const prismaData: any = {};

    // Map propertyTypes
    if (data.propertyTypes) prismaData.propertyTypes = data.propertyTypes;

    // Map priceRange -> minPrice, maxPrice
    if (data.priceRange) {
      if (data.priceRange.min !== undefined) prismaData.minPrice = data.priceRange.min;
      if (data.priceRange.max !== undefined) prismaData.maxPrice = data.priceRange.max;
    }

    // Map location -> preferredLocation, searchRadius
    if (data.location) {
      if (data.location.city !== undefined) prismaData.preferredLocation = data.location.city;
      if (data.location.radius !== undefined) prismaData.searchRadius = data.location.radius;
    }

    // Map bedrooms -> minBedrooms, maxBedrooms
    if (data.bedrooms) {
      if (data.bedrooms.min !== undefined) prismaData.minBedrooms = data.bedrooms.min;
      if (data.bedrooms.max !== undefined) prismaData.maxBedrooms = data.bedrooms.max;
    }

    // Map bathrooms -> minBathrooms, maxBathrooms
    if (data.bathrooms) {
      if (data.bathrooms.min !== undefined) prismaData.minBathrooms = data.bathrooms.min;
      if (data.bathrooms.max !== undefined) prismaData.maxBathrooms = data.bathrooms.max;
    }

    // Map notifications
    if (data.notifications) {
      if (data.notifications.email !== undefined) prismaData.emailNotifications = data.notifications.email;
      if (data.notifications.sms !== undefined) prismaData.smsNotifications = data.notifications.sms;
      if (data.notifications.push !== undefined) prismaData.pushNotifications = data.notifications.push;
    }

    // Handle other flat fields
    const flatFields = [
      'userId', 'minArea', 'maxArea', 'sortBy', 'viewMode', 
      'priceDropAlerts', 'newPropertyAlerts', 'marketUpdateAlerts'
    ];
    
    for (const field of flatFields) {
      if (data[field] !== undefined) prismaData[field] = data[field];
    }

    return prismaData;
  }

  async create(data: any) {
    return this.prisma.userPreferences.create({
      data: this.mapUserPreferences(data),
    });
  }

  async update(userId: string, data: any) {
    return this.prisma.userPreferences.update({
      where: { userId },
      data: this.mapUserPreferences(data),
    });
  }

  async delete(userId: string) {
    await this.prisma.userPreferences.delete({
      where: { userId },
    });
  }
}

/**
 * Implementação do repositório de interesses em propriedades
 */
class PrismaPropertyInterestRepository implements PropertyInterestRepositoryInterface {
  constructor(private prisma: PrismaClient | any) { }

  async findById(id: string) {
    return this.prisma.propertyInterest.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string, options?: FindManyOptions) {
    return this.prisma.propertyInterest.findMany({
      where: { userId },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: options?.include,
    });
  }

  async findByPropertyId(propertyId: string, options?: FindManyOptions) {
    return this.prisma.propertyInterest.findMany({
      where: { propertyId },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: options?.include,
    });
  }

  async create(data: CreatePropertyInterestData) {
    return this.prisma.propertyInterest.create({
      data,
    });
  }

  async update(id: string, data: UpdatePropertyInterestData) {
    return this.prisma.propertyInterest.update({
      where: { id },
      data: {
        ...data,
        contactedAt: data.contactedAt ? new Date(data.contactedAt) : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.propertyInterest.delete({
      where: { id },
    });
  }

  async markAsContacted(id: string) {
    await this.prisma.propertyInterest.update({
      where: { id },
      data: {
        contacted: true,
        contactedAt: new Date(),
      },
    });
  }

  async findByInterestType(type: any, options?: FindManyOptions) {
    return this.prisma.propertyInterest.findMany({
      where: { interestType: type },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: options?.include,
    });
  }
}

/**
 * Implementação do repositório de propriedades guardadas
 */
class PrismaSavedPropertyRepository implements SavedPropertyRepositoryInterface {
  constructor(private prisma: PrismaClient | any) { }

  async findById(id: string) {
    return this.prisma.savedProperty.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string, options?: FindManyOptions) {
    return this.prisma.savedProperty.findMany({
      where: { userId },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: options?.include,
    });
  }

  async findByPropertyId(propertyId: string, options?: FindManyOptions) {
    return this.prisma.savedProperty.findMany({
      where: { propertyId },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: options?.include,
    });
  }

  async create(data: CreateSavedPropertyData) {
    return this.prisma.savedProperty.create({
      data,
    });
  }

  async update(id: string, data: UpdateSavedPropertyData) {
    return this.prisma.savedProperty.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.savedProperty.delete({
      where: { id },
    });
  }

  async findByFolder(userId: string, folder: string) {
    return this.prisma.savedProperty.findMany({
      where: { userId, folder },
    });
  }

  async findByTag(userId: string, tag: string) {
    return this.prisma.savedProperty.findMany({
      where: {
        userId,
        tags: {
          has: tag,
        },
      },
    });
  }

  async deleteByUserAndProperty(userId: string, propertyId: string) {
    await this.prisma.savedProperty.deleteMany({
      where: { userId, propertyId },
    });
  }
}

/**
 * Implementação do repositório de histórico de pesquisas
 */
class PrismaSearchHistoryRepository implements SearchHistoryRepositoryInterface {
  constructor(private prisma: PrismaClient | any) { }

  async findById(id: string) {
    return this.prisma.searchHistory.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string, limit?: number) {
    return this.prisma.searchHistory.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateSearchHistoryData) {
    return this.prisma.searchHistory.create({
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.searchHistory.delete({
      where: { id },
    });
  }

  async deleteByUserId(userId: string) {
    await this.prisma.searchHistory.deleteMany({
      where: { userId },
    });
  }

  async deleteOldEntries(olderThan: Date) {
    const result = await this.prisma.searchHistory.deleteMany({
      where: {
        createdAt: {
          lt: olderThan,
        },
      },
    });
    return result.count;
  }

  async getPopularSearches(limit = 10) {
    return this.prisma.searchHistory.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      distinct: ['query'],
    });
  }
}

/**
 * Implementação do repositório de notificações
 */
class PrismaNotificationRepository implements NotificationRepositoryInterface {
  constructor(private prisma: PrismaClient | any) { }

  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string, options?: NotificationFindOptions) {
    const where: any = { userId };
    if (options?.unreadOnly) {
      where.isRead = false;
    }
    return this.prisma.notification.findMany({
      where,
      skip: options?.skip,
      take: options?.limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateNotificationData) {
    return this.prisma.notification.create({
      data,
    });
  }

  async update(id: string, data: UpdateNotificationData) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        ...data,
        readAt: data.readAt ? new Date(data.readAt) : undefined,
        archivedAt: data.archivedAt ? new Date(data.archivedAt) : undefined,
        sentAt: data.sentAt ? new Date(data.sentAt) : undefined,
        deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.notification.delete({
      where: { id },
    });
  }

  async markAsRead(id: string, userId: string) {
    await this.prisma.notification.update({
      where: { id, userId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAsUnread(id: string) {
    await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: false,
        readAt: null,
      },
    });
  }

  async markAsArchived(id: string) {
    await this.prisma.notification.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });
  }

  async markAsUnarchived(id: string) {
    await this.prisma.notification.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
        isArchived: false,
      },
    });
  }

  async deleteOldNotifications(olderThan: Date) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: olderThan,
        },
        isArchived: true,
      },
    });
    return result.count;
  }
}
