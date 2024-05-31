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
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    }
  });
}

// Función para configurar Multer
function configureMulter(destinationPath) {
  const storage = configureStorage(destinationPath);
  return multer({ storage: storage });
}

// Middleware para subir archivos
function uploadFiles(fieldname, destinationPath) {
  const upload = configureMulter(destinationPath);
  return async (req, res, next) => {
    try {
      upload.single(fieldname)(req, res, next);
    } catch (error) {
      throw new Error('Error al subir el archivo: ' + error.message);
    }
  };
}

// Middleware para manejar la respuesta con la URL del archivo subido
function handleFileUpload(req, res, next) {
  const file = req.file;
  try {
    if (!req.file) {
      throw new Error('No se adjuntó ningún archivo.');
    }

    const fileUrl = `/uploads/${file.filename}`;
    req.fileUrl = fileUrl;
    next();
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).send('Error al subir el archivo.');
  }
}

// Controlador para imprimir la URL del archivo subido
function printFileUrl(req, res) {
  const fileUrl = req.fileUrl;
  res.status(200).json({ fileUrl });
}

export { uploadFiles, handleFileUpload, printFileUrl };