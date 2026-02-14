
import { FastifyReply, FastifyRequest } from 'fastify';
import { dependencyConfig } from '../config/dependency-config.js';

export class StatsController {
    /**
     * Get user activity statistics
     * GET /api/v1/users/stats/activity
     */
    async getActivityStats(request: FastifyRequest, reply: FastifyReply) {
        try {
            // Count total active users (assuming all profiles are active for now, or filter by isActive if available)
            const activeUsers = await dependencyConfig.database.userProfiles.count();

            // Count new registrations today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            
            const newRegistrations = await dependencyConfig.database.userProfiles.count({
                createdAt: {
                    gte: startOfDay
                }
            });

            // Count new agents today (proxy: profiles with specialties or experience created today)
            const newAgents = await dependencyConfig.database.userProfiles.count({
                where: {
                    createdAt: {
                        gte: startOfDay
                    },
                    OR: [
                        { specialties: { isEmpty: false } },
                        { experience: { not: null } },
                        { isProfileApproved: true }
                    ]
                }
            });

            return reply.send({
                success: true,
                data: {
                    activeUsers,
                    newRegistrations,
                    newAgents,
                    timestamp: new Date()
                }
            });
        } catch (error) {
            console.error('❌ Error getting user stats:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                code: 'INTERNAL_ERROR'
            });
        }
    }
}

export const statsController = new StatsController();
