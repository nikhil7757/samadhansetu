import { prisma } from '../lib/prisma.js';

export class CommentService {
  static async list(problemId: string, page: number = 1, limit: number = 20) {
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { problemId },
        include: {
          user: {
            select: { id: true, name: true, role: true, organizationName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where: { problemId } }),
    ]);

    return { comments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async create(problemId: string, userId: string, commentText: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error('Problem not found');

    const comment = await prisma.comment.create({
      data: { problemId, userId, commentText },
      include: {
        user: {
          select: { id: true, name: true, role: true, organizationName: true },
        },
      },
    });

    // Notify problem submitter if commenter is different
    if (problem.submittedById !== userId) {
      await prisma.notification.create({
        data: {
          userId: problem.submittedById,
          message: `New comment on "${problem.title}"`,
          link: `/problems/${problemId}`,
        },
      });
    }

    return comment;
  }
}
