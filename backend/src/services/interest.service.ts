import { prisma } from '../lib/prisma.js';
import { Role } from '@prisma/client';

export class InterestService {
  static async expressInterest(problemId: string, userId: string, pitchMessage: string, role: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error('Problem not found');
    if (problem.status !== 'OPEN' && problem.status !== 'TEAM_FORMED' && problem.status !== 'IN_PROGRESS') {
      throw new Error('Cannot express interest on this problem at its current status');
    }

    // Check if already expressed interest
    const existing = await prisma.interest.findUnique({
      where: { problemId_userId: { problemId, userId } },
    });
    if (existing) throw new Error('You have already expressed interest in this problem');

    const interest = await prisma.interest.create({
      data: {
        problemId,
        userId,
        pitchMessage,
        roleAtTime: role as Role,
      },
      include: {
        user: {
          select: { id: true, name: true, role: true, organizationName: true },
        },
      },
    });

    // Notify the problem submitter
    await prisma.notification.create({
      data: {
        userId: problem.submittedById,
        message: `New interest expressed on "${problem.title}"`,
        link: `/problems/${problemId}`,
      },
    });

    return interest;
  }

  static async listForProblem(problemId: string) {
    return prisma.interest.findMany({
      where: { problemId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, organizationName: true, district: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
