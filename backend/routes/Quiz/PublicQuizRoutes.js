import express from 'express';
const router = express.Router();

import PerformanceControllers from '../../controllers/Quiz/Performance/PerformanceControllers.js';
import SatisfactionControllers from '../../controllers/Quiz/Satisfaction/SatisfactionControllers.js';

const performance = new PerformanceControllers();
const satisfaction = new SatisfactionControllers();



router.post('/quiz/satisfactions', satisfaction.getQuizAnsweredByEmployee.bind(satisfaction))
router.post('/quiz/satisfaction/answer', satisfaction.createAnswerSatisfaction.bind(satisfaction));
router.get('/quiz/satisfaction/not_answer', satisfaction.getLastFiveQuizzes.bind(satisfaction));
router.post('/quiz/satisfaction/modal', satisfaction.getQuizInformationAnsweredForModal.bind(satisfaction));

router.post('/quiz/satisfaction/:id', satisfaction.getQuizForAnswer.bind(satisfaction));

// PERFORMANCE
router.post('/quiz/performance/answer', performance.createAnswerSatisfaction.bind(performance));
router.get('/quiz/performance/last_five', performance.getLastFiveQuizzes.bind(performance));
router.post('/quiz/performance/one/question', performance.getQuestion.bind(performance));


router.post('/quiz/performance/get/employees_to_evaluate', performance.getEmployeesToEvaluate.bind(performance));

router.post('/quiz/performances/supervisor', performance.getQuizzesInformationForSupervisor.bind(performance));

router.post('/quiz/performance/one/header/:id_ep', performance.getQuizHeader.bind(performance));
router.post('/quiz/performance/:ep_fk', performance.getQuizInformation.bind(performance));
router.post('/quiz/satisfactions/answered/:ep_fk', performance.getAnswersForQuizForSupervisor.bind(performance));




const PublicQuizRoutes = {
    router
}

export default PublicQuizRoutes