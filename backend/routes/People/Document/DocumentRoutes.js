import express from 'express';
const router = express.Router();

import DocumentControllers from '../../../controllers/People/Document/DocumentControllers.js';
const document = new DocumentControllers();
// DOCUMENT ROUTES
router.post('/document/create', document.createDocument.bind(document));
router.get('/documents', document.getDocuments.bind(document));
router.post('/document', document.getDocument.bind(document));
router.patch('/document', document.updateDocument.bind(document));
router.patch('/document/status', document.toggleStatusDocument.bind(document));
router.delete('/document', document.deleteDocument.bind(document));

const DocumentRoutes = {
  router,
};

export default DocumentRoutes;
