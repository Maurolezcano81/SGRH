import express from 'express';
const router = express.Router();

import { decodeToken, verifyToken } from '../../middlewares/Authorization.js';

import UserController from '../../controllers/People/User.js';
import navigationMenu from "../../controllers/System/Navbar/NavigationMenuControllers.js"

const user = new UserController();
const menu = new navigationMenu(); 

router.post('/checkPermission', verifyToken, decodeToken, user.canViewModule.bind(user));
router.post('/menu/parents', verifyToken, decodeToken, menu.getMenuParentsByIdProfile.bind(menu));
router.post('/menu/childrens', verifyToken, decodeToken, menu.getMenuChildrensByIdProfileAndIdParent.bind(menu));

const checkPermissionRoutes = {
  router,
};
export default checkPermissionRoutes;
