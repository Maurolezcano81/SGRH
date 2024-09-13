const router = express.Router()
import express from 'express'

import TypeOfLeaveController from "../../controllers/Leaves/TypeOfLeavesController.js";

const typeOfLeave = new TypeOfLeaveController()
router.post('/types_of_leave/create', typeOfLeave.createTypeOfLeave.bind(typeOfLeave));
router.get('/types_of_leave', typeOfLeave.getTypesOfLeave.bind(typeOfLeave));
router.post('/types_of_leave', typeOfLeave.getTypeOfLeave.bind(typeOfLeave));
router.patch('/types_of_leave', typeOfLeave.updateTypeOfLeave.bind(typeOfLeave));
router.patch('/types_of_leave/status', typeOfLeave.toggleStatusTypeOfLeave.bind(typeOfLeave));
router.delete('/types_of_leave', typeOfLeave.deleteTypeOfLeave.bind(typeOfLeave));

const LeavesRoutes = {
    router,
};

export default LeavesRoutes;
