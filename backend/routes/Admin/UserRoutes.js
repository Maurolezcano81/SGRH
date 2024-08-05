import express from 'express';
import { createUser, hasToChangePwd } from '../../controllers/People/UserControllers.js';
import { uploadFiles, handleFileUpload, printFileUrl } from '../../middlewares/Uploads.js';

import User from '../../controllers/People/User.js';

const userInstance = new User();

const router = express.Router();
const avatarUpload = uploadFiles('avatar_url', 'uploads/avatars');

router.post('/user/create', avatarUpload, handleFileUpload("/uploads/avatars"), createUser);

router.post('/user/all', userInstance.getAll.bind(userInstance));

const UserRoutes = {
  router,
};
export default UserRoutes;
