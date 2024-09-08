import express from 'express';
const router = express.Router();

import SatisfactionControllers from '../../controllers/Quiz/Satisfaction/SatisfactionControllers.js';
const satisfaction = new SatisfactionControllers();

router.post('/quiz/satisfaction/new', satisfaction.createQuiz.bind(satisfaction));


const SatisfactionRoutes = {
    router
}

export default SatisfactionRoutes