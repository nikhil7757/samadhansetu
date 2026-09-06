import { Request, Response } from 'express';
import { TeamService } from '../services/team.service.js';

export class TeamController {
  static async getTeam(req: Request, res: Response) {
    try {
      // Check membership or admin
      const isAdmin = req.user!.role === 'ADMIN';
      const isMember = await TeamService.isTeamMember(req.params.teamId as string, req.user!.userId);
      if (!isAdmin && !isMember) {
        res.status(403).json({ error: 'You are not a member of this team' });
        return;
      }
      const team = await TeamService.getTeam(req.params.teamId as string);
      res.json(team);
    } catch (err: any) {
      if (err.message === 'Team not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async getMyTeams(req: Request, res: Response) {
    const teams = await TeamService.getMyTeams(req.user!.userId);
    res.json(teams);
  }

  static async addNote(req: Request, res: Response) {
    const isMember = await TeamService.isTeamMember(req.params.teamId as string, req.user!.userId);
    if (!isMember) {
      res.status(403).json({ error: 'You are not a member of this team' });
      return;
    }
    const note = await TeamService.addNote(
      req.params.teamId as string,
      req.user!.userId,
      req.user!.name,
      req.body.content
    );
    res.status(201).json(note);
  }
}
