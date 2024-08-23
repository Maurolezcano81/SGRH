import express from 'express';
const router = express.Router();

import SubjectType from '../../controllers/Message/SubjectTypeControllers.js';

const subject = new SubjectType();
// SUBJECT ROUTES
router.post('/create/subject', subject.createSubject.bind(subject));
router.get('/subjects', subject.getSubjects.bind(subject));
router.post('/subject', subject.getSubject.bind(subject));
router.patch('/subject', subject.updateSubject.bind(subject));
router.patch('/subject/status', subject.toggleStatusSubject.bind(subject));
router.delete('/subject', subject.deleteSubject.bind(subject));

const SubjectRoutes = {
  router,
};

export default SubjectRoutes;
