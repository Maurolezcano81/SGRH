import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

// Rutas
import UserCredentialsRoutes from './routes/UserCredentialsRoutes.js';

app.use('/api', UserCredentialsRoutes.router);

// Server
app.listen( process.env.SV_PORT || 3000, () =>{
    console.log(`Server corriendo en el puerto: ${process.env.SV_PORT}`);
});