import express from 'express';
import { createUser } from '../../controllers/People/UserControllers.js';
import { handleAvatarUpload, printFileUrl } from '../../middlewares/Uploads.js';

const router = express.Router();

router.post('/user/create', handleAvatarUpload, createUser);

const UserRoutes = {
  router,
};
export default UserRoutes;
