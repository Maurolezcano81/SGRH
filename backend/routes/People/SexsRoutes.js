import express from 'express';
const router = express.Router();

import SexControllers from '../../controllers/People/SexControllers.js';
const sex = new SexControllers();
// SEX ROUTES
router.post('/sex/create', sex.createOne.bind(sex));
router.post('/sex', sex.getOne.bind(sex));
router.post('/sexs', sex.getAllWPagination.bind(sex));
router.patch('/sex', sex.updateOne.bind(sex));
router.patch('/sex/status', sex.toggleStatus.bind(sex));
router.delete('/sex', sex.deleteOne.bind(sex));

const SexRoutes = {
  router,
};

export default SexRoutes;
