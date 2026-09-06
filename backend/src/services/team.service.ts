import { prisma } from '../lib/prisma.js';

export class TeamService {
  static async getTeam(teamId: string) {
    const team = await prisma.projectTeam.findUnique({
      where: { id: teamId },
      include: {
        problem: {
          select: { id: true, title: true, status: true, category: true, district: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, role: true, organizationName: true, email: true },
            },
          },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!team) throw new Error('Team not found');
    return team;
  }

  static async getMyTeams(userId: string) {
    const memberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            problem: {
              select: { id: true, title: true, status: true, category: true, district: true },
            },
            members: {
              include: {
                user: {
                  select: { id: true, name: true, role: true, organizationName: true },
                },
              },
            },
          },
        },
      },
    });
    return memberships.map(m => m.team);
  }

  static async addNote(teamId: string, authorId: string, authorName: string, content: string) {
    return prisma.teamNote.create({
      data: { teamId, authorId, authorName, content },
    });
  }

  static async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const member = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    return !!member;
  }
}
