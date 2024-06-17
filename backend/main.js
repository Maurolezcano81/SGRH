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
import UserCredentialsRoutes from './routes/UserCredentialsRoutes.js';
import SystemRoutes from './routes/Admin/SystemRoutes.js';

import { decodeToken, decodeTokenForAdministrator, verifyToken } from './middlewares/Authorization.js';
import UserRoutes from './routes/Admin/UserRoutes.js';
import StateRoutes from './routes/Admin/Address/AddressRoutes.js';
import checkPermissionRoutes from './routes/CheckPermissionRoutes.js';

app.use('/api', UserCredentialsRoutes.router);

app.use(
  '/api/admin',
  verifyToken,
  decodeTokenForAdministrator,
  SystemRoutes.router,
  UserRoutes.router,
  StateRoutes.router
);

import { getDataUserForProfile } from './controllers/People/UserControllers.js';

app.use('/api', checkPermissionRoutes.router);
app.use('/api/profile', verifyToken, decodeToken, getDataUserForProfile);

// Server
app.listen(process.env.SV_PORT || 3000, () => {
  console.log(`Server corriendo en el puerto: ${process.env.SV_PORT}`);
});
