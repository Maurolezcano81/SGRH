const router = express.Router()
import express from 'express'

import TypeOfLeaveController from "../../controllers/Leaves/TypeOfLeavesController.js";

const typeOfLeave = new TypeOfLeaveController()
router.post('/types_of_leave/create', typeOfLeave.createOne.bind(typeOfLeave));
router.post('/types_of_leaves', typeOfLeave.getAllWPagination.bind(typeOfLeave));
router.post('/types_of_leave', typeOfLeave.getOne.bind(typeOfLeave));
router.patch('/types_of_leave', typeOfLeave.updateOne.bind(typeOfLeave));
router.patch('/types_of_leave/status', typeOfLeave.toggleStatus.bind(typeOfLeave));
router.delete('/types_of_leave', typeOfLeave.deleteOne.bind(typeOfLeave));

const LeavesRoutes = {
    router,
};

export default LeavesRoutes;
