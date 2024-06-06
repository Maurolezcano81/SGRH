import express from 'express';
const router = express.Router();

import checkPermissionsController from '../controllers/CheckPermissionsControllers.js';
import { decodeToken, verifyToken } from '../middlewares/Authorization.js';

router.post('/checkPermission', verifyToken, decodeToken, checkPermissionsController);

const checkPermissionRoutes = {
  router,
};
export default checkPermissionRoutes;
