import express from 'express';
const router = express.Router();

import TypeOfTerminationControllers from '../../controllers/Termination/Type_of_terminationControllers.js';
const termination = new TypeOfTerminationControllers();
// TYPE OF TERMINATION ROUTES
router.post('/type_of_termination/create', termination.createOne.bind(termination));
router.post('/types_of_termination', termination.getAllWPagination.bind(termination));
router.post('/types_of_termination/actives', termination.getActives.bind(termination));
router.post('/type_of_termination', termination.getOne.bind(termination));
router.patch('/type_of_termination', termination.updateOne.bind(termination));
router.patch('/type_of_termination/status', termination.toggleStatus.bind(termination));
router.delete('/type_of_termination', termination.deleteOne.bind(termination));

const TypeOfTerminationRoutes = {
  router,
};

export default TypeOfTerminationRoutes;
