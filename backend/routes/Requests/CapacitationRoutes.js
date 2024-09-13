import express from 'express';
const router = express.Router();

import CapacitationControllers from '../../controllers/Requests/CapacitationControllers.js';

const capacitation = new CapacitationControllers();

router.post('/request/capacitations', capacitation.getCapacitations.bind(capacitation));
router.post('/request/capacitations/not_answer', capacitation.getCapacitationsNotAnswer.bind(capacitation));
router.post('/request/capacitation/answer', capacitation.responseRequestCapacitation.bind(capacitation));

const CapacitationRoutes = {
  router,
};

export default CapacitationRoutes;
