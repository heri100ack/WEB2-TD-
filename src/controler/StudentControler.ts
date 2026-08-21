import { Request, Response } from "express";
import { StudentService } from "../Service/StudentService";


export class StudentControler {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const students = await this.studentService.FindAllStudent();
      res.status(200).json(students);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string , 10);
      const student = await this.studentService.getStudentById(id);
      res.status(200).json(student);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const student = await this.studentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const student = await this.studentService.updateStudent(id, req.body);
      res.status(200).json(student);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public patch = this.update; 

  public delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.studentService.deleteStudent(id);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message.includes('not found')) {
      res.status(404).json({ error: message });
    } else if (
      message.includes('already exists') ||
      message.includes('required') ||
      message.includes('Invalid')
    ) {
      res.status(400).json({ error: message });
    } else {
      res.status(500).json({ error: message });
    }
  }
}