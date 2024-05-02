import express from 'express';
import UserCredentialsControllers from '../controllers/UserCredentialsControllers.js';

const router = express.Router();

router.post('/signIn', UserCredentialsControllers.getUser);

// router.post('/signUp');
// router.post('/signOut');



const UserCredentialsRoutes = {
    router
}

export default UserCredentialsRoutes;