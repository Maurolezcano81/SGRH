import express from 'express';
const router = express.Router();

import {
  createSex,
  getSex,
  getSexs,
  updateSex,
  toggleStatusSex,
  deleteSex,
} from '../../controllers/People/SexControllers.js';

// SEX ROUTES
router.post('/create/sex', createSex);
router.post('/sex', getSex);
router.get('/sexs', getSexs);
router.patch('/sex', updateSex);
router.patch('/sex/status', toggleStatusSex);
router.delete('/sex', deleteSex);

const SexRoutes = {
  router,
};

export default SexRoutes;
