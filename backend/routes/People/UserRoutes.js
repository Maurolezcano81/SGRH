import express from 'express';

import UserController from '../../controllers/People/User.js';

import { uploadFiles, handleFileUpload, printFileUrl } from '../../middlewares/Uploads.js';

const avatarUpload = uploadFiles('avatar_url', 'uploads/avatars');


const user = new UserController();

const router = express.Router();



router.post('/user/create', avatarUpload, handleFileUpload("/uploads/avatars"), user.createUser.bind(user));
router.post('/users', user.getUsers.bind(user));

const UserRoutes = {
  router,
};
export default UserRoutes;
