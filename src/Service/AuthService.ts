import { CompteRepository } from '../repository/CompteRepository';
import { Compte, AuthentificationCompte, Login, Role } from '../model/Compte';
import { HttpError } from '../Security/HttpError';
import { signAccessToken } from '../Security/jwt';
import bcrypt from 'bcrypt';

export class AuthService {
  private compteRepository = new CompteRepository();

  private sanitizeCompte(compte: Compte): AuthentificationCompte {
    const { passwordHash, ...rest } = compte;
    return rest;
  }

  async register(email: string, plainPassword: string, role: Role): Promise<AuthentificationCompte> {
    if (await this.compteRepository.findByEmail(email)) {
      throw new HttpError(400, 'Email déjà utilisé');
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const newCompte = await this.compteRepository.create(email, passwordHash, role);
    return this.sanitizeCompte(newCompte);
  }

  async login(credentials: Login): Promise<{ token: string; user: AuthentificationCompte }> {
  const compte = await this.compteRepository.findByEmail(credentials.email);
  if (!compte || !(await bcrypt.compare(credentials.password, compte.passwordHash))) {
    throw new HttpError(401, 'Identifiants invalides');
  }

  const user = this.sanitizeCompte(compte);
  const token = signAccessToken(user);

  return { token, user };
}
}