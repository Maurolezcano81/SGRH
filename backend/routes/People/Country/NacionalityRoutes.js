import express from 'express';
const router = express.Router();

import NacionalityController from '../../../controllers/People/Country/NacionalityControllers.js';

const nacionality = new NacionalityController();
// NACIONALITY ROUTES
router.post('/nacionality/create', nacionality.createNacionality.bind(nacionality));
router.post('/nacionality', nacionality.getNacionality.bind(nacionality));
router.get('/nacionalities', nacionality.getNacionalities.bind(nacionality));
router.patch('/nacionality', nacionality.updateNacionality.bind(nacionality));
router.patch('/nacionality/status', nacionality.toggleStatusNacionality.bind(nacionality));
router.delete('/nacionality', nacionality.deleteNacionality.bind(nacionality));

const NacionalityRoutes = {
  router,
};

export default NacionalityRoutes;
