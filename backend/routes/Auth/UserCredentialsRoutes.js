import express from 'express';
import UserCredentialsControllers from '../../controllers/Auth/UserCredentialsControllers.js';
import { changePwdAdmin, changePwdEmployee, hasToChangePwd } from '../../controllers/People/UserControllers.js';
import { verifyToken, decodeToken, decodeTokenForAdministrator } from '../../middlewares/Authorization.js';

const router = express.Router();

router.post('/login', UserCredentialsControllers.getUser);
router.post('/changePwd/employee', verifyToken, decodeToken, changePwdEmployee);
router.post('/changePwd/admin', verifyToken, decodeTokenForAdministrator, changePwdAdmin);
router.post('/haspwdchanged', verifyToken, decodeToken, hasToChangePwd);

const UserCredentialsRoutes = {
  router,
};

export default UserCredentialsRoutes;
