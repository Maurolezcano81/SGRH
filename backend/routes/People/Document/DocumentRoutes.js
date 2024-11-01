import express from 'express';
const router = express.Router();

import DocumentControllers from '../../../controllers/People/Document/DocumentControllers.js';
const document = new DocumentControllers();
// DOCUMENT ROUTES
router.post('/document/create', document.createOne.bind(document));
router.post('/documents', document.getAllWPagination.bind(document));
router.post('/document', document.getOne.bind(document));
router.patch('/document', document.updateOne.bind(document));
router.patch('/document/status', document.toggleStatus.bind(document));
router.delete('/document', document.deleteOne.bind(document));

const DocumentRoutes = {
  router,
};

export default DocumentRoutes;
