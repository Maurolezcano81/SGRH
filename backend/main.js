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
import SystemRoutes from './routes/SystemRoutes.js';
import { decodeToken, verifyToken } from './middlewares/Authorization.js';
app.use('/api', UserCredentialsRoutes.router);

/* app.use('/api', PersonalRoutes.router); */

app.use('/api', verifyToken, decodeToken, SystemRoutes.router);


import { uploadFiles, handleFileUpload, printFileUrl } from './middlewares/Uploads.js';
const avatarUpload = uploadFiles("avatar_user", "uploads/avatars")
const pdfUpload = uploadFiles("document_user", "uploads/pdfs")
app.post('/avatar', avatarUpload, handleFileUpload, printFileUrl);
app.post('/pdf', pdfUpload, handleFileUpload, printFileUrl);

// Server
app.listen(process.env.SV_PORT || 3000, () => {
  console.log(`Server corriendo en el puerto: ${process.env.SV_PORT}`);
});
