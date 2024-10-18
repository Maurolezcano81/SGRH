import express from 'express';
const router = express.Router();

import TerminationEmployee from '../../controllers/Termination/TerminationController.js';
const termination = new TerminationEmployee();
// TYPE OF TERMINATION ROUTES


router.post('/termination/dismiss', termination.createTerminationEmployee.bind(termination));
router.post('/termination/re_enter', termination.reEnterEmployee.bind(termination));

const TerminationRoutes = {
    router,
};

export default TerminationRoutes;
