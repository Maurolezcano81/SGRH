import express from 'express';
const router = express.Router();

import {
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
  toggleStatusSubject,
  deleteSubject,
} from '../../controllers/Message/SubjectTypeControllers.js';

// SUBJECT ROUTES
router.post('/create/subject', createSubject);
router.get('/subjects', getSubjects);
router.post('/subject', getSubject);
router.patch('/subject', updateSubject);
router.patch('/subject/status', toggleStatusSubject);
router.delete('/subject', deleteSubject);

const SubjectRoutes = {
  router,
};

export default SubjectRoutes;
