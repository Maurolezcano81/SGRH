import express from 'express';
const router = express.Router();

import StatusRequestControllers from '../../controllers/Requests/StatusRequestControllers.js';

const statusRequest = new StatusRequestControllers();
// STATUS REQUEST ROUTES
router.post('/status_request/create', statusRequest.createOne.bind(statusRequest));
router.post('/statuses_request', statusRequest.getAllWPagination.bind(statusRequest));
router.post('/status_request', statusRequest.getOne.bind(statusRequest));
router.patch('/status_request', statusRequest.updateOne.bind(statusRequest));
router.patch('/status_request/status', statusRequest.toggleStatus.bind(statusRequest));
router.delete('/status_request', statusRequest.deleteOne.bind(statusRequest));

const StatusRequestRoutes = {
  router,
};

export default StatusRequestRoutes;
