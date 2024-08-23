import express from 'express';
const router = express.Router();

import OccupationControllers from '../../../controllers/People/Department/OccupationController.js';

const occupation = new OccupationControllers();
// OCCUPATION ROUTES
router.post('/occupation/create', occupation.createOccupation.bind(occupation));
router.get('/occupations', occupation.getOccupations.bind(occupation));
router.post('/occupation', occupation.getOccupation.bind(occupation));
router.patch('/occupation', occupation.updateOccupation.bind(occupation));
router.patch('/occupation/status', occupation.toggleStatusOccupation.bind(occupation));
router.delete('/occupation', occupation.deleteOccupation.bind(occupation));

const OccupationRoutes = {
  router,
};

export default OccupationRoutes;
