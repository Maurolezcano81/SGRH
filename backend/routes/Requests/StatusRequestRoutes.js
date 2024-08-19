import express from 'express';
const router = express.Router();

import {
  createStatusRequest,
  getStatusRequest,
  getStatusesRequest,
  updateStatusRequest,
  toggleStatusRequest,
  deleteStatusRequest,
} from '../../controllers/Requests/StatusRequestControllers.js';

// STATUS REQUEST ROUTES
router.post('/create/status_request', createStatusRequest);
router.post('/status_request', getStatusRequest);
router.get('/statuses_request', getStatusesRequest);
router.patch('/status_request', updateStatusRequest);
router.patch('/status_request/status', toggleStatusRequest);
router.delete('/status_request', deleteStatusRequest);

const StatusRequestRoutes = {
  router,
};

export default StatusRequestRoutes;
