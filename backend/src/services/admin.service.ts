import { prisma } from '../lib/prisma.js';

export class AdminService {
  static async getPendingProblems() {
    return prisma.problem.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: {
        submittedBy: {
          select: { id: true, name: true, email: true, district: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
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
    return prisma.projectTeam.findMany({
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
  }
}
