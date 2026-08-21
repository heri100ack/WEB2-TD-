
import { Student, CreateStudentDTO, UpdateStudentDTO } from '../model/Student';
import  pool  from '../db';

export class StudentRepository {
  async findAll(): Promise<Student[]> {
    const recup = await pool.query('SELECT * FROM student');
    return recup.rows;
  }
  async findById(id: number): Promise<Student | null> {
    const recup = await pool.query(
      'SELECT * FROM student WHERE id = $1', 
      [id]
    ); 
    return recup.rows[0]||null;
  }
  async findByCIN(CIN : String ) : Promise<Student | null>{ 
    const recup = await pool.query(
      'SELECT * FROM student Where CIN = $1', 
      [CIN]
    )
    return recup.rows[0]||null;
  }
  async create(data: CreateStudentDTO): Promise<Student> {
    const recup = await pool.query(
      'INSERT INTO student ( nom , score , date_d_inscription , prenom)VALUES ($1,$2,$3,NOW(),$5)'
      ,
      [ data.nom , data.score , data.prenom]
    ); 
    return recup.rows[0];
  }

  async update(id: number, data: UpdateStudentDTO): Promise<Student | null> {
 
  const existingStudent = await this.findById(id);
  if (!existingStudent) return null;

  const updatedData = {
    nom: data.nom !== undefined ? data.nom : existingStudent.nom,
    prenom: data.prenom !== undefined ? data.prenom : existingStudent.prenom,
    score: data.score !== undefined ? data.score : existingStudent.score,
  };

  const result = await pool.query(
    `UPDATE students 
     SET nom = $1, prenom = $2, score = $3 
     WHERE id = $4 RETURNING *`,
    [updatedData.nom, updatedData.prenom, updatedData.score, id]
  );

  return result.rows[0] || null;
}

  async delete(id: number): Promise<Student | null> {
    const recup = await pool.query(
      'DELETE * FROM student WHERE id =$1',
      [id]
    )
    return recup.rows[0];
  } 
}
