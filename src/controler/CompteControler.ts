import { Request, Response, NextFunction } from 'express';
import { CompteRepository } from '../repository/CompteRepository';
import { AuthService } from '../Service/AuthService';
import { Role } from '../model/Compte';

export class CompteController {
  private compteRepository = new CompteRepository();
  private authService = new AuthService();

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const compte = await this.compteRepository.findById(id);
      if (!compte) {
        res.status(404).json({ message: 'Compte introuvable' });
        return;
      }
      const { passwordHash, ...user } = compte;
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async getByRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = req.params.role as Role;
      const comptes = await this.compteRepository.findByRole(role);
      const sanitized = comptes.map(({ passwordHash, ...user }) => user);
      res.status(200).json(sanitized);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role } = req.body;
      const newCompte = await this.authService.register(email, password, role);
      res.status(201).json(newCompte);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await this.compteRepository.delete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Compte non trouvé pour la suppression' });
        return;
      }
      const { passwordHash, ...user } = deleted;
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}