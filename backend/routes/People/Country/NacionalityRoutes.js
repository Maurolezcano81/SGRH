import express from 'express';
const router = express.Router();

import NacionalityController from '../../../controllers/People/Country/NacionalityControllers.js';

const nacionality = new NacionalityController();
// NACIONALITY ROUTES
router.post('/nacionality/create', nacionality.createOne.bind(nacionality));
router.post('/nacionalities', nacionality.getAllWPagination.bind(nacionality));
router.post('/nacionality', nacionality.getOne.bind(nacionality));
router.patch('/nacionality', nacionality.updateOne.bind(nacionality));
router.delete('/nacionality', nacionality.deleteOne.bind(nacionality));

const NacionalityRoutes = {
  router,
};

export default NacionalityRoutes;
