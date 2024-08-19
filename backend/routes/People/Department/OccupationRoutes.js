import express from 'express';
const router = express.Router();

import {
  createOccupation,
  getOccupation,
  getOccupations,
  updateOccupation,
  toggleStatusOccupation,
  deleteOccupation,
} from '../../../controllers/People/Department/OccupationController.js';

// OCCUPATION ROUTES
router.post('/create/occupation', createOccupation);
router.get('/occupations', getOccupations);
router.post('/occupation', getOccupation);
router.patch('/occupation', updateOccupation);
router.patch('/occupation/status', toggleStatusOccupation);
router.delete('/occupation', deleteOccupation);

const OccupationRoutes = {
  router,
};

export default OccupationRoutes;
