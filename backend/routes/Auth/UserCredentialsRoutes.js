import express from 'express';
import UserCredentialsControllers from '../../controllers/Auth/UserCredentialsControllers.js';
import { verifyToken, decodeToken, decodeTokenForAdministrator } from '../../middlewares/Authorization.js';

import UserController from "../../controllers/People/User.js";
const router = express.Router();
const user = new UserController()

router.post('/login', UserCredentialsControllers.getUser);
router.post('/changePwd/employee', verifyToken, decodeToken, user.changePwdEmployee.bind(user));
router.post('/changePwd/admin', verifyToken, decodeTokenForAdministrator, user.changePwdAdmin.bind(user));
router.post('/haspwdchanged', verifyToken, decodeToken, user.hasToChangePwd.bind(user));

const UserCredentialsRoutes = {
  router,
};

export default UserCredentialsRoutes;
