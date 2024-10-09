import express from 'express';
const router = express.Router();

import PerformanceControllers from '../../controllers/Quiz/Performance/PerformanceControllers.js';
const performance = new PerformanceControllers();

router.post('/quiz/performances', performance.getQuizzesInformation.bind(performance))
router.post('/quiz/performance/new', performance.createQuiz.bind(performance));

router.patch('/quiz/performance/edit/question', performance.editQuestion.bind(performance));
router.delete('/quiz/performance/delete/question', performance.deleteQuestion.bind(performance));
router.post('/quiz/performance/not_supervisor/get', performance.getPeopleForSupervisor.bind(performance));
router.delete('/quiz/performance/delete/supervisor', performance.deleteSupervisor.bind(performance));
router.post('/quiz/performance/add/supervisor', performance.addSupervisor.bind(performance));


router.patch('/quiz/performance/edit/header', performance.updateQuizHeader.bind(performance));
router.delete('/quiz/performance/delete/all', performance.deleteAllQuiz.bind(performance));


router.delete("/quiz/performance/answered/delete", performance.deleteQuizAnswered.bind(performance))
router.post('/quiz/performance/all/rrhh/:ep_fk', performance.getQuizInformationAnsweredForRrhh.bind(performance))

router.post('/quiz/performance/add/question/:id_ep', performance.addQuestion.bind(performance));
router.post('/quiz/performance/one/:ep_fk', performance.getQuizInformation.bind(performance));


const PerformanceRoutes = {
    router
}

export default PerformanceRoutes