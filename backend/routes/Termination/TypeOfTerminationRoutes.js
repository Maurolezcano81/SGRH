import express from 'express';
const router = express.Router();

import {
  createTot,
  getTot,
  getTots,
  updateTot,
  toggleStatusTot,
  deleteTot,
} from '../../controllers/Termination/Type_of_terminationControllers.js';

// TYPE OF TERMINATION ROUTES
router.post('/create/type_of_termination', createTot);
router.get('/types_of_termination', getTots);
router.post('/type_of_termination', getTot);
router.patch('/type_of_termination', updateTot);
router.patch('/type_of_termination/status', toggleStatusTot);
router.delete('/type_of_termination', deleteTot);

const TypeOfTerminationRoutes = {
  router,
};

export default TypeOfTerminationRoutes;
