import express from 'express';

import UserController from '../../../../controllers/People/User.js';

const user = new UserController();

const router = express.Router();



router.patch('/user/username', user.updateUsername.bind(user));
router.patch('/user/profile', user.updateProfile.bind(user));
router.get('/user/token', user.checkToken.bind(user));



const UserPublic = {
    router,
};
export default UserPublic;
