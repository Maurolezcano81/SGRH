import express from 'express';
import { createPersonalAllData } from '../controllers/InsertControllers.js';

const router = express.Router();

router.post('/new', createPersonalAllData);

// router.post('/signUp');
// router.post('/signOut');


const PersonalRoutes = {
    router
}

export default PersonalRoutes;