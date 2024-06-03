import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// Rutas
import UserCredentialsRoutes from './routes/UserCredentialsRoutes.js';
import SystemRoutes from './routes/Admin/SystemRoutes.js';

import { decodeToken, verifyToken } from './middlewares/Authorization.js';
import UserRoutes from './routes/Admin/UserRoutes.js';
app.use('/api', UserCredentialsRoutes.router);

/* app.use('/api', PersonalRoutes.router); */

app.use('/api/admin', SystemRoutes.router, UserRoutes.router);

// Server
app.listen(process.env.SV_PORT || 3000, () => {
  console.log(`Server corriendo en el puerto: ${process.env.SV_PORT}`);
});
