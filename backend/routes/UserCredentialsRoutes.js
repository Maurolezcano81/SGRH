import express from 'express';
import UserCredentialsControllers from '../controllers/UserCredentialsControllers.js';

const router = express.Router();

router.post('/login', UserCredentialsControllers.getUser);

const UserCredentialsRoutes = {
    router
}

export default UserCredentialsRoutes;