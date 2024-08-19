import express from 'express';
const router = express.Router();

import {
  createNacionality,
  getNacionality,
  getNacionalities,
  updateNacionality,
  toggleStatusNacionality,
  deleteNacionality,
} from '../../../controllers/People/Country/NacionalityControllers.js';

// NACIONALITY ROUTES
router.post('/create/nacionality', createNacionality);
router.post('/nacionality', getNacionality);
router.get('/nacionalities', getNacionalities);
router.patch('/nacionality', updateNacionality);
router.patch('/nacionality/status', toggleStatusNacionality);
router.delete('/nacionality', deleteNacionality);

const NacionalityRoutes = {
  router,
};

export default NacionalityRoutes;
