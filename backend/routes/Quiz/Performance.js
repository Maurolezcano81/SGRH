import express from 'express';
const router = express.Router();

import PerformanceControllers from '../../controllers/Quiz/Performance/PerformanceControllers.js';
const performance = new PerformanceControllers();

router.post('/quiz/performances', performance.getQuizzesInformation.bind(performance))
router.post('/quiz/performance/new', performance.createQuiz.bind(performance));
router.post('/quiz/performance/one/:ep_fk', performance.getQuizInformation.bind(performance));
router.post('/quiz/performance/one/question', performance.getQuestion.bind(performance));
router.post('/quiz/performance/add/question/:id_ep', performance.addQuestion.bind(performance));
router.patch('/quiz/performance/edit/question', performance.editQuestion.bind(performance));
router.delete('/quiz/performance/delete/question', performance.deleteQuestion.bind(performance));
router.post('/quiz/performance/not_supervisor/get', performance.getPeopleForSupervisor.bind(performance));
router.delete('/quiz/performance/delete/supervisor', performance.deleteSupervisor.bind(performance));
router.post('/quiz/performance/add/supervisor', performance.addSupervisor.bind(performance));


router.post('/quiz/performance/one/header/:id_ep', performance.getQuizHeader.bind(performance));
router.patch('/quiz/performance/edit/header', performance.updateQuizHeader.bind(performance));
router.delete('/quiz/performance/delete/all', performance.deleteAllQuiz.bind(performance));



const PerformanceRoutes = {
    router
}

export default PerformanceRoutes