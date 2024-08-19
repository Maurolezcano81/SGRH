import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
// Definir la ruta de la carpeta donde están las imágenes
const staticImagesPath = path.join('uploads/avatars');

// Servir archivos estáticos desde la carpeta de imágenes
app.use('/uploads/avatars', express.static(staticImagesPath));

// Rutas
import UserCredentialsRoutes from './routes/Auth/UserCredentialsRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js'

import { decodeToken, decodeTokenForAdministrator, verifyToken } from './middlewares/Authorization.js';
import UserRoutes from './routes/People/UserRoutes.js';
import StateRoutes from './routes/People/Address/AddressRoutes.js';
import checkPermissionRoutes from './routes/Auth/CheckPermissionRoutes.js';

app.use('/api', UserCredentialsRoutes.router);

app.use(
  '/api/admin',
  verifyToken,
  decodeTokenForAdministrator,
  AdminRoutes.router,
  UserRoutes.router,
  StateRoutes.router
);

import { getDataUserForProfile } from './controllers/People/UserControllers.js';

app.use('/api', checkPermissionRoutes.router);
app.use('/api/profile', verifyToken, decodeToken, getDataUserForProfile);

const URL = 'http:localhost:'
const PORT = process.env.SV_PORT
// Server
app.listen(process.env.SV_PORT || 3000, () => {
  console.log(`Server corriendo en : ${URL}${PORT}`);
});
