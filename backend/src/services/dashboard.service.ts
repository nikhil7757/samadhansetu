import { prisma } from '../lib/prisma.js';

export class DashboardService {
  static async getStats() {
    const [totalProblems, solvedCount, activeCollaborations, byCategory, byDistrict, byStatus] = await Promise.all([
      prisma.problem.count({
        where: { status: { notIn: ['PENDING_APPROVAL', 'REJECTED'] } },
      }),
      prisma.problem.count({ where: { status: 'SOLVED' } }),
      prisma.projectTeam.count(),
      prisma.problem.groupBy({
        by: ['category'],
        _count: { id: true },
        where: { status: { notIn: ['PENDING_APPROVAL', 'REJECTED'] } },
      }),
      prisma.problem.groupBy({
        by: ['district'],
        _count: { id: true },
        where: { status: { notIn: ['PENDING_APPROVAL', 'REJECTED'] } },
      }),
      prisma.problem.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { status: { notIn: ['PENDING_APPROVAL', 'REJECTED'] } },
      }),
    ]);

    return {
      totalProblems,
      solvedCount,
      activeCollaborations,
      inProgress: await prisma.problem.count({ where: { status: 'IN_PROGRESS' } }),
      byCategory: byCategory.map(c => ({ category: c.category, count: c._count.id })),
      byDistrict: byDistrict.map(d => ({ district: d.district, count: d._count.id })),
      byStatus: byStatus.map(s => ({ status: s.status, count: s._count.id })),
    };
  }
}
