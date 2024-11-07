import express from 'express';
const router = express.Router();

import SubjectType from '../../controllers/Message/SubjectTypeControllers.js';

const subject = new SubjectType();
// SUBJECT ROUTES
router.post('/subject/create', subject.createOne.bind(subject));
router.post('/subjects', subject.getAllWPagination.bind(subject));
router.post('/subject', subject.getOne.bind(subject));
router.patch('/subject', subject.updateOne.bind(subject));
router.patch('/subject/status', subject.toggleStatus.bind(subject));
router.delete('/subject', subject.deleteOne.bind(subject));

const SubjectRoutes = {
  router,
};

export default SubjectRoutes;
