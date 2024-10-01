import express from 'express';
const router = express.Router();

import PerformanceControllers from '../../controllers/Quiz/Performance/PerformanceControllers.js';
import SatisfactionControllers from '../../controllers/Quiz/Satisfaction/SatisfactionControllers.js';

const performance = new PerformanceControllers();
const satisfaction = new SatisfactionControllers();



router.post('/quiz/satisfactions', satisfaction.getQuizAnsweredByEmployee.bind(satisfaction))
router.post('/quiz/satisfaction/answer', satisfaction.createAnswerSatisfaction.bind(satisfaction));
router.post('/quiz/satisfaction/:id', satisfaction.getQuizForAnswer.bind(satisfaction));
router.get('/quiz/satisfaction/not_answer', satisfaction.getLastFiveQuizzes.bind(satisfaction));




const PublicQuizRoutes = {
    router
}

export default PublicQuizRoutes