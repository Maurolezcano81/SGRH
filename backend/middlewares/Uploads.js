import { group } from 'console';
import multer from 'multer';
import path from 'path';

// EJEMPLO DE SUBIR ARCHIVOS

// import { uploadFiles, handleFileUpload, printFileUrl } from './middlewares/Uploads.js';
// const avatarUpload = uploadFiles("avatar_user", "uploads/avatars")
// const pdfUpload = uploadFiles("document_user", "uploads/pdfs")
// app.post('/avatar', avatarUpload, handleFileUpload, printFileUrl);
// app.post('/pdf', pdfUpload, handleFileUpload, printFileUrl);

// Función para configurar el almacenamiento de Multer
function configureStorage(destinationPath) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    },
  });
}

// Función para configurar Multer
function configureMulter(destinationPath) {
  const storage = configureStorage(destinationPath);
  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10 MB (ejemplo de límite de tamaño)
    },
  });
}


function handleAvatarUpload(req, res, next) {
  const file = req.file;
  try {
    if (!req.file) {
      return res.status(422).json({
        message: 'No se adjunto ningun archivo',
        group: 'file',
      });
    }

    const fileUrl = `/uploads/avatars/${file.filename}`;
    req.fileUrl = fileUrl;
    next();
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).json({
      message: 'Error al subir el archivo.',
      group: 'file',
    });
  }
}

// Controlador para imprimir la URL del archivo subido
function printFileUrl(req, res) {
  const fileUrl = req.fileUrl;
  res.status(200).json({ fileUrl });
}

export { handleAvatarUpload, printFileUrl };
