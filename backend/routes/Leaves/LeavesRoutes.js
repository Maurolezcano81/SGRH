const router = express.Router()
import express from 'express'

import TypeOfLeaveController from "../../controllers/Leaves/TypeOfLeavesController.js";

const leave = new TypeOfLeaveController()
router.post('/types_of_leave/create', leave.createTypeOfLeave.bind(leave));
router.get('/types_of_leave', leave.getTypesOfLeave.bind(leave));
router.post('/types_of_leave', leave.getTypeOfLeave.bind(leave));
router.patch('/types_of_leave', leave.updateTypeOfLeave.bind(leave));
router.patch('/types_of_leave/status', leave.toggleStatusTypeOfLeave.bind(leave));
router.delete('/types_of_leave', leave.deleteTypeOfLeave.bind(leave));

const LeavesRoutes = {
    router,
};

export default LeavesRoutes;
