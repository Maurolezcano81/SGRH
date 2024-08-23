import express from 'express';
const router = express.Router();

import SexControllers from '../../controllers/People/SexControllers.js';
const sex = new SexControllers();
// SEX ROUTES
router.post('/sex/create', sex.createSex.bind(sex));
router.post('/sex', sex.getSex.bind(sex));
router.get('/sexs', sex.getSexs.bind(sex));
router.patch('/sex', sex.updateSex.bind(sex));
router.patch('/sex/status', sex.toggleStatusSex.bind(sex));
router.delete('/sex', sex.deleteSex.bind(sex));

const SexRoutes = {
  router,
};

export default SexRoutes;
