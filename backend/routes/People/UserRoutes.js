import express from 'express';

import UserController from '../../controllers/People/User.js';
const user = new UserController();

const router = express.Router();



router.post('/user/create', user.createUser.bind(user));

const UserRoutes = {
  router,
};
export default UserRoutes;
