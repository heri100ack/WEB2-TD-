import pool from '../configuration/database';
import { Role, Compte } from '../model/Compte';

const COLUMNS = 'id, email, password_hash AS "passwordHash", role';

export class CompteRepository {
  async findByEmail(email: string): Promise<Compte | null> {
    const result = await pool.query<Compte>(
      `SELECT ${COLUMNS} FROM Compte WHERE email = $1`,
      [email]
    );
    return result.rows[0] ?? null;
  }

  async findById(id: number): Promise<Compte | null> {
    const result = await pool.query<Compte>(
      `SELECT ${COLUMNS} FROM Compte WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findByRole(role: Role): Promise<Compte[]> {
    const result = await pool.query<Compte>(
      `SELECT ${COLUMNS} FROM Compte WHERE role = $1`,
      [role]
    );
    return result.rows;
  }

  async create(email: string, passwordHash: string, role: Role): Promise<Compte> {
    const result = await pool.query<Compte>(
      `INSERT INTO Compte (email, password_hash, role) VALUES ($1, $2, $3) RETURNING ${COLUMNS}`,
      [email, passwordHash, role]
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<Compte | null> {
    const result = await pool.query<Compte>(
      `DELETE FROM Compte WHERE id = $1 RETURNING ${COLUMNS}`,
      [id]
    );
    return result.rows[0] ?? null;
  }
}
