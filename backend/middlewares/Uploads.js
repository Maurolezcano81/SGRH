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
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    }
  });
}

// Función para configurar Multer
function configureMulter(destinationPath) {
  const storage = configureStorage(destinationPath);
  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10 MB (ejemplo de límite de tamaño)
    }
  });
}

// Middleware para subir archivos
function uploadFiles(fieldname, destinationPath) {
  const upload = configureMulter(destinationPath);
  return async (req, res, next) => {
    try {
      upload.single(fieldname)(req, res, next);
    } catch (error) {
      res.status(422).json({
        message: "Error al subir el archivo, intentelo de nuevo"
      })
    }
  };
}


function uploadArray(fieldname, destinationPath) {
  const upload = configureMulter(destinationPath);

  console.log(fieldname);
  console.log(destinationPath);
  return (req, res, next) => {
    
    upload.array(fieldname, 10)(req, res, (err) => {
      if (err) {
        return res.status(422).json({
          message: "Error al subir el archivo, intentelo de nuevo",
          error: err.message
        });
      }
      next();
    });
  };
}

function handleFileUploadNotObligatory(basePath) {
  return (req, res, next) => {
    try {
      if (req.files && req.files.imgsArray) {
        const fileUrls = req.files.imgsArray.map(file => path.join(basePath, file.filename));
        req.fileUrls = fileUrls;
        req.filePaths = req.files.imgsArray.map(file => file.path);
      } else {
        // No hay archivos, puedes continuar al siguiente middleware
        req.fileUrls = [];
        req.filePaths = [];
      }
      next();
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      res.status(500).json({
        message: 'Error al procesar el archivo.',
        group: 'file'
      });
    }
  };
}

// Middleware para manejar la respuesta con la URL del archivo subido
function handleFileUpload(basePath) {
  return (req, res, next) => {
    const file = req.file;
    try {
      if (!req.file) {
        return res.status(422).json({
          message: "No se adjuntó ningún archivo",
          group: "file"
        })
      }

      const fileUrl = path.join(basePath, file.filename);
      req.fileUrl = fileUrl;
      req.filePath = file.path; // Guardamos la ruta del archivo
      next();
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      res.status(500).json({
        message: 'Error al subir el archivo.',
        group: 'file'
      });
    }
  };
}
// Controlador para imprimir la URL del archivo subido
function printFileUrl(req, res) {
  const fileUrl = req.fileUrl;
  res.status(200).json({ fileUrl });
}


export { uploadFiles, handleFileUpload, printFileUrl, uploadArray, handleFileUploadNotObligatory };
