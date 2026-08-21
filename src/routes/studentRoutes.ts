import { Router } from "express";
import { StudentControler } from "../controler/StudentControler";


const router = Router();
const studentControler = new StudentControler();

router.get('/students', studentControler.getAll);
router.get('/students/:id', studentControler.getById);
router.post('/students', studentControler.create);
router.put('/students/:id', studentControler.update);
router.patch('/students/:id', studentControler.patch);
router.delete('/students/:id', studentControler.delete);


export default router;