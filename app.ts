import express from "express";
import cors from "cors";
import studentRoutes from "../routes/StudentRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', studentRoutes); // ou app.use('/api', studentRoutes) si tu veux préfixer

app.listen(3000, () => console.log("Server running on port 3000"));

// (un model student ) vas dans repository 
// (repository) est appeler par service ; 
// (service) est appeler par controller ; 
