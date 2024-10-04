import express from 'express';
const router = express.Router();

import SatisfactionControllers from '../../controllers/Quiz/Satisfaction/SatisfactionControllers.js';
const satisfaction = new SatisfactionControllers();

router.post('/quiz/satisfactions', satisfaction.getQuizzesInformation.bind(satisfaction));
router.post('/quiz/satisfaction/new', satisfaction.createQuiz.bind(satisfaction));
router.post('/quiz/satisfaction/one/question', satisfaction.getQuestion.bind(satisfaction));
router.patch('/quiz/satisfaction/edit/question', satisfaction.editQuestion.bind(satisfaction));
router.delete('/quiz/satisfaction/delete/question', satisfaction.deleteQuestion.bind(satisfaction));

router.patch('/quiz/satisfaction/edit/header', satisfaction.updateQuizHeader.bind(satisfaction));
router.delete('/quiz/satisfaction/delete/all', satisfaction.deleteAllQuiz.bind(satisfaction));


router.delete("/quiz/satisfaction/answered/delete", satisfaction.deleteQuizAnswered.bind(satisfaction))

router.post('/quiz/satisfaction/add/question/:id_sq', satisfaction.addQuestion.bind(satisfaction));
router.post('/quiz/satisfaction/one/:sq_fk', satisfaction.getQuizInformation.bind(satisfaction));
router.post('/quiz/satisfaction/one/header/:id_sq', satisfaction.getQuizHeader.bind(satisfaction));
router.post('/quiz/satisfactions/answered/:id_sq', satisfaction.getAnswersForQuizById.bind(satisfaction))


const SatisfactionRoutes = {
    router
}

export default SatisfactionRoutes