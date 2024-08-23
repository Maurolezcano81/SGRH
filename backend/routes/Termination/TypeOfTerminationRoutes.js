import express from 'express';
const router = express.Router();

import TypeOfTerminationControllers from '../../controllers/Termination/Type_of_terminationControllers.js';
const termination = new TypeOfTerminationControllers();
// TYPE OF TERMINATION ROUTES
router.post('/type_of_termination/create', termination.createTot.bind(termination));
router.get('/types_of_termination', termination.getTots.bind(termination));
router.post('/type_of_termination', termination.getTot.bind(termination));
router.patch('/type_of_termination', termination.updateTot.bind(termination));
router.patch('/type_of_termination/status', termination.toggleStatusTot.bind(termination));
router.delete('/type_of_termination', termination.deleteTot.bind(termination));

const TypeOfTerminationRoutes = {
  router,
};

export default TypeOfTerminationRoutes;
