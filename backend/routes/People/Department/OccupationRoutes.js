import express from 'express';
const router = express.Router();

import OccupationControllers from '../../../controllers/People/Department/OccupationController.js';

const occupation = new OccupationControllers();
// OCCUPATION ROUTES
router.post('/occupation/create', occupation.createOne.bind(occupation));
router.post('/occupations', occupation.getAllWPagination.bind(occupation));
router.post('/occupation', occupation.getOne.bind(occupation));
router.patch('/occupation', occupation.updateOne.bind(occupation));
router.delete('/occupation', occupation.deleteOne.bind(occupation));

const OccupationRoutes = {
  router,
};

export default OccupationRoutes;
