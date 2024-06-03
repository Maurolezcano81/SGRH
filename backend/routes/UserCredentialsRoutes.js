import express from 'express';
import UserCredentialsControllers from '../controllers/UserCredentialsControllers.js';
import { verifyToken } from '../middlewares/Authorization.js';

const router = express.Router();

router.post('/login', UserCredentialsControllers.getUser);

// router.post('/signUp');
// router.post('/signOut');


const UserCredentialsRoutes = {
    router
}

export default UserCredentialsRoutes;