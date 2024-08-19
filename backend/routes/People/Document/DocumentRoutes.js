import express from 'express';
const router = express.Router();

import {
  createDocument,
  getDocument,
  getDocuments,
  updateDocument,
  toggleStatusDocument,
  deleteDocument,
} from '../../../controllers/People/Document/DocumentControllers.js';

// DOCUMENT ROUTES
router.post('/create/document', createDocument);
router.get('/documents', getDocuments);
router.post('/document', getDocument);
router.patch('/document', updateDocument);
router.patch('/document/status', toggleStatusDocument);
router.delete('/document', deleteDocument);

const DocumentRoutes = {
  router,
};

export default DocumentRoutes;
