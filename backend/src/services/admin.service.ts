import { prisma } from '../lib/prisma.js';

const FALLBACK_PENDING = [
  {
    id: 'pend-1',
    title: 'Seasonal Drying of Subarnarekha River Irrigation Canal in Namkum',
    description: 'Sediment buildup and breach of canal wall in Namkum block has halted water flow to over 400 hectares of paddy fields.',
    category: 'AGRICULTURE',
    district: 'Ranchi',
    urgency: 'HIGH',
    createdAt: new Date().toISOString(),
    submittedBy: { id: 'up-1', name: 'Alok Tirkey', email: 'alok.tirkey@gmail.com', district: 'Ranchi' },
  },
  {
    id: 'pend-2',
    title: 'Severe Arsenic Leaching in Tube Wells of Chandankiyari Panchayat',
    description: 'Preliminary kit testing indicates arsenic above permissible thresholds in 8 public hand pumps.',
    category: 'WATER_SANITATION',
    district: 'Bokaro',
    urgency: 'HIGH',
    createdAt: new Date().toISOString(),
    submittedBy: { id: 'up-2', name: 'Meena Kumari', email: 'meena.k@gmail.com', district: 'Bokaro' },
  },
];

export class AdminService {
  static async getPendingProblems() {
    try {
      return await prisma.problem.findMany({
        where: { status: 'PENDING_APPROVAL' },
        include: {
          submittedBy: {
            select: { id: true, name: true, email: true, district: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (err) {
      console.warn('Database offline, returning fallback pending problems:', err);
      return FALLBACK_PENDING as any;
    }
  }

  static async approveProblem(problemId: string, adminId: string, note?: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error('Problem not found');
    if (problem.status !== 'PENDING_APPROVAL') throw new Error('Problem is not pending approval');

    const [updated] = await prisma.$transaction([
      prisma.problem.update({
        where: { id: problemId },
        data: { status: 'OPEN' },
      }),
      prisma.statusHistory.create({
        data: {
          problemId,
          oldStatus: 'PENDING_APPROVAL',
          newStatus: 'OPEN',
          changedById: adminId,
          note: note || 'Approved by admin',
        },
      }),
      prisma.notification.create({
        data: {
          userId: problem.submittedById,
          message: `Your problem "${problem.title}" has been approved and is now visible to solvers`,
          link: `/problems/${problemId}`,
        },
      }),
    ]);

    return updated;
  }

  static async rejectProblem(problemId: string, adminId: string, note: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error('Problem not found');
    if (problem.status !== 'PENDING_APPROVAL') throw new Error('Problem is not pending approval');

    const [updated] = await prisma.$transaction([
      prisma.problem.update({
        where: { id: problemId },
        data: { status: 'REJECTED' },
      }),
      prisma.statusHistory.create({
        data: {
          problemId,
          oldStatus: 'PENDING_APPROVAL',
          newStatus: 'REJECTED',
          changedById: adminId,
          note,
        },
      }),
      prisma.notification.create({
        data: {
          userId: problem.submittedById,
          message: `Your problem "${problem.title}" was not approved: ${note}`,
          link: `/problems/${problemId}`,
        },
      }),
    ]);

    return updated;
  }

  static async createMatch(problemId: string, userIds: string[], adminId: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error('Problem not found');

    // Include the problem submitter in the team
    const allUserIds = [...new Set([problem.submittedById, ...userIds])];

    const team = await prisma.$transaction(async (tx) => {
      const projectTeam = await tx.projectTeam.create({
        data: {
          problemId,
          members: {
            create: allUserIds.map(userId => ({ userId })),
          },
        },
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true, role: true, organizationName: true } },
            },
          },
        },
      });

      // Update problem status
      await tx.problem.update({
        where: { id: problemId },
        data: { status: 'TEAM_FORMED' },
      });

      await tx.statusHistory.create({
        data: {
          problemId,
          oldStatus: problem.status,
          newStatus: 'TEAM_FORMED',
          changedById: adminId,
          note: 'Team formed by admin match',
        },
      });

      // Notify all team members
      await tx.notification.createMany({
        data: allUserIds.map(userId => ({
          userId,
          message: `You have been matched to a team for "${problem.title}"`,
          link: `/teams/${projectTeam.id}`,
        })),
      });

      return projectTeam;
    });

    return team;
  }

  static async getAllMatches() {
    try {
      return await prisma.projectTeam.findMany({
        include: {
          problem: {
            select: { id: true, title: true, status: true, category: true, district: true },
          },
          members: {
            include: {
              user: { select: { id: true, name: true, role: true, organizationName: true } },
            },
          },
        },
        orderBy: { formedAt: 'desc' },
      });
    } catch (err) {
      console.warn('Database offline, returning fallback team matches:', err);
      return [
        {
          id: 'team-1',
          formedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          problem: {
            id: 'prob-1',
            title: 'High Arsenic & Fluoride Contamination in Deep Groundwater Wells',
            status: 'IN_PROGRESS',
            category: 'WATER_SANITATION',
            district: 'Deoghar',
          },
          members: [
            { id: 'm1', user: { id: 'u1', name: 'Rajesh Oraon', role: 'CITIZEN', organizationName: 'Citizen Submitter' } },
            { id: 'm2', user: { id: 'u-iit', name: 'Prof. Anirudh Sen', role: 'UNIVERSITY', organizationName: 'IIT (ISM) Dhanbad' } },
            { id: 'm3', user: { id: 'u-tata', name: 'Siddharth Roy', role: 'INDUSTRY', organizationName: 'Tata Steel CSR' } },
          ],
        },
        {
          id: 'team-2',
          formedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          problem: {
            id: 'prob-2',
            title: 'Severe Post-Harvest Tomato Spoilage in Unrefrigerated Farm Clusters',
            status: 'TEAM_FORMED',
            category: 'AGRICULTURE',
            district: 'Gumla',
          },
          members: [
            { id: 'm4', user: { id: 'u2', name: 'Anita Devi', role: 'CITIZEN', organizationName: 'Citizen Submitter' } },
            { id: 'm5', user: { id: 'u-bit', name: 'BIT Mesra Innovation Cell', role: 'UNIVERSITY', organizationName: 'BIT Mesra Ranchi' } },
          ],
        },
      ] as any;
    }
  }
}
