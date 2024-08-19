import express from 'express';
const router = express.Router();

import checkPermissionsController from '../../controllers/Auth/CheckPermissionsControllers.js';
import { decodeToken, verifyToken } from '../../middlewares/Authorization.js';
import {
  getMenuParentsByIdProfile,
  getMenuChildrensByIdProfileAndIdParent,
} from '../../controllers/System/Navbar/NavigationMenuControllers.js';

router.post('/checkPermission', verifyToken, decodeToken, checkPermissionsController);
router.post('/menu/parents', verifyToken, decodeToken, getMenuParentsByIdProfile);
router.post('/menu/childrens', verifyToken, decodeToken, getMenuChildrensByIdProfileAndIdParent);

const checkPermissionRoutes = {
  router,
};
export default checkPermissionRoutes;
