import { CompteRepository } from '../repository/CompteRepository';
import { Role, Compte, AuthentificationCompte, Login } from '../model/Compte';
import { HttpError } from '../Security/HttpError';
import bcrypt from 'bcrypt';

export class CompteService {
  private compteRepository: CompteRepository;

  constructor() {
    this.compteRepository = new CompteRepository();
  }

  // Utilitaire privé pour retirer le passwordHash
  private sanitizeCompte(compte: Compte): AuthentificationCompte {
    const { passwordHash, ...rest } = compte;
    return rest;
  }

  async getCompteById(id: number): Promise<AuthentificationCompte> {
    const compte = await this.compteRepository.findById(id);
    if (!compte) {
      throw new HttpError(404, `Compte introuvable avec l'ID ${id}`);
    }
    return this.sanitizeCompte(compte);
  }

  async getComptesByRole(role: Role): Promise<AuthentificationCompte[]> {
    const comptes = await this.compteRepository.findByRole(role);
    return comptes.map(compte => this.sanitizeCompte(compte));
  }

  async createCompte(email: string, plainPassword: string, role: Role): Promise<AuthentificationCompte> {
    const existingCompte = await this.compteRepository.findByEmail(email);
    if (existingCompte) {
      throw new HttpError(400, 'Un compte avec cet email existe déjà');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    const newCompte = await this.compteRepository.create(email, passwordHash, role);
    return this.sanitizeCompte(newCompte);
  }

  async verifyCredentials(credentials: Login): Promise<AuthentificationCompte> {
    const compte = await this.compteRepository.findByEmail(credentials.email);
    if (!compte) {
      throw new HttpError(401, 'Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, compte.passwordHash);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Identifiants invalides');
    }

    return this.sanitizeCompte(compte);
  }

  async deleteCompte(id: number): Promise<AuthentificationCompte> {
    const deletedCompte = await this.compteRepository.delete(id);
    if (!deletedCompte) {
      throw new HttpError(404, `Impossible de supprimer : aucun compte trouvé avec l'ID ${id}`);
    }
    return this.sanitizeCompte(deletedCompte);
  }
}