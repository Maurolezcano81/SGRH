import express from 'express';
const router = express.Router();

import StatusRequestControllers from '../../controllers/Requests/StatusRequestControllers.js';

const statusRequest = new StatusRequestControllers();
// STATUS REQUEST ROUTES
router.post('/status_request/create', statusRequest.createStatusRequest.bind(statusRequest));
router.post('/status_request', statusRequest.getStatusRequest.bind(statusRequest));
router.get('/statuses_request', statusRequest.getStatusesRequest.bind(statusRequest));
router.patch('/status_request', statusRequest.updateStatusRequest.bind(statusRequest));
router.patch('/status_request/status', statusRequest.toggleStatusRequest.bind(statusRequest));
router.delete('/status_request', statusRequest.deleteStatusRequest.bind(statusRequest));

const StatusRequestRoutes = {
  router,
};

export default StatusRequestRoutes;
