import express from 'express';
const router = express.Router();

import TypeStatusEmployeeController from '../../../controllers/Status_Employee/TypeStatusEmployeeController.js'
const tse = new TypeStatusEmployeeController();
// CONTACT ROUTES
router.post('/tse/create', tse.createOne.bind(tse));
router.post('/tses', tse.getAllWPagination.bind(tse));
router.post('/tses/actives', tse.getActives.bind(tse));
router.post('/tse', tse.getOne.bind(tse));
router.patch('/tse', tse.updateOne.bind(tse));
router.patch('/tse/status', tse.toggleStatus.bind(tse));
router.delete('/tse', tse.deleteOne.bind(tse));

const TypeStatusEmployeeRoutes = {
  router,
};

export default TypeStatusEmployeeRoutes;
