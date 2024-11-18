import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import schedule from 'node-schedule';

const app = express();

// Definir la ruta de la carpeta donde están las imágenes
const staticImagesAvatarsPath = path.join('uploads/avatars');
const staticImagesRequestPath = path.join('uploads/requests');

// Servir archivos estáticos desde la carpeta de imágenes
app.use('/api/uploads/avatars/', express.static(staticImagesAvatarsPath));
app.use('/api/uploads/requests/', express.static(staticImagesRequestPath));


const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));



dotenv.config();

// Rutas
import UserCredentialsRoutes from './routes/Auth/UserCredentialsRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js'

import { decodeToken, decodeTokenForAdministrator, verifyToken } from './middlewares/Authorization.js';
import UserRoutes from './routes/People/UserRoutes.js';
import StateRoutes from './routes/People/Address/AddressRoutes.js';
import checkPermissionRoutes from './routes/Auth/CheckPermissionRoutes.js';
import EmployeeRoutes from './routes/EmployeeRoutes.js';

app.use('/api', UserCredentialsRoutes.router);

app.use(
  '/api/admin',
  verifyToken,
  decodeTokenForAdministrator,
  AdminRoutes.app,
  UserRoutes.router,
  StateRoutes.router
);


app.use('/api', verifyToken, decodeToken, checkPermissionRoutes.router);
app.use('/api/user', verifyToken, decodeToken, EmployeeRoutes.router);

const URL = 'http:localhost:'
const PORT = process.env.SV_PORT


import LeavesControllers from './controllers/Requests/LeaveControllers.js';
const leave = new LeavesControllers();

schedule.scheduleJob('0 0 * * *', async () => {
  await leave.getLeavesForStartFieldForJobSchedule();
  console.log('Tarea ejecutada por cron');
});


schedule.scheduleJob('59 23 * * *', async () => {
  await leave.getLeavesForEndFieldForJobSchedule();
  console.log('Tarea ejecutada por cron');
});

// Server
app.listen(process.env.SV_PORT || 3000, async () => {
  // await leave.getLeavesForStartFieldForJobSchedule();
  // await leave.getLeavesForEndFieldForJobSchedule();

  console.log(`Server corriendo en : ${URL}${PORT}`);
  const now = new Date();
  console.log('Fecha y hora local del servidor:', now.toLocaleString());
});
