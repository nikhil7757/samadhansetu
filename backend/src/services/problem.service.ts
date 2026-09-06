import { prisma } from '../lib/prisma.js';
import { ProblemStatus, Category, Urgency } from '@prisma/client';

interface CreateProblemData {
  title: string;
  description: string;
  category: string;
  district: string;
  urgency: string;
  submittedById: string;
  imageUrl?: string;
}

interface ListProblemsQuery {
  category?: string;
  district?: string;
  status?: string;
  search?: string;
  page: number;
  limit: number;
}

export class ProblemService {
  static async create(data: CreateProblemData) {
    return prisma.problem.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category as Category,
        district: data.district,
        urgency: data.urgency as Urgency,
        submittedById: data.submittedById,
        imageUrl: data.imageUrl,
        status: 'PENDING_APPROVAL',
      },
      include: {
        submittedBy: {
          select: { id: true, name: true, email: true, role: true, district: true },
        },
      },
    });
  }

  static async list(query: ListProblemsQuery) {
    const where: any = {};

    // Only show approved problems to public (not PENDING_APPROVAL or REJECTED)
    if (!query.status) {
      where.status = { notIn: ['PENDING_APPROVAL', 'REJECTED'] as ProblemStatus[] };
    } else {
      where.status = query.status as ProblemStatus;
    }

    if (query.category) where.category = query.category as Category;
    if (query.district) where.district = query.district;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        include: {
          submittedBy: {
            select: { id: true, name: true, district: true },
          },
          _count: {
            select: { interests: true, comments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.problem.count({ where }),
    ]);

    return {
      problems,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  static async getById(id: string) {
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        submittedBy: {
          select: { id: true, name: true, email: true, role: true, district: true, organizationName: true },
        },
        statusHistory: {
          include: {
            changedBy: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        projectTeam: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, role: true, organizationName: true },
                },
              },
            },
          },
        },
        _count: {
          select: { interests: true, comments: true },
        },
      },
    });

    if (!problem) throw new Error('Problem not found');
    return problem;
  }

  static async updateStatus(problemId: string, newStatus: string, changedById: string, note?: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error('Problem not found');

    const [updated] = await prisma.$transaction([
      prisma.problem.update({
        where: { id: problemId },
        data: { status: newStatus as ProblemStatus },
      }),
      prisma.statusHistory.create({
        data: {
          problemId,
          oldStatus: problem.status,
          newStatus: newStatus as ProblemStatus,
          changedById,
          note,
        },
      }),
      // Notify the problem submitter
      prisma.notification.create({
        data: {
          userId: problem.submittedById,
          message: `Status of "${problem.title}" changed to ${newStatus.replace(/_/g, ' ')}`,
          link: `/problems/${problemId}`,
        },
      }),
    ]);

    return updated;
  }
}
