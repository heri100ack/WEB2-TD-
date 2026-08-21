export type Role = 'PROF' | 'STUDENT';

export interface Compte {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
}

export type AuthentificationCompte = Omit<Compte, 'passwordHash'>;

export interface Login {
  email: string;
  password: string;
}