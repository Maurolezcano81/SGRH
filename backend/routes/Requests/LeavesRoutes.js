import express from 'express';
const router = express.Router();

import LeavesControllers from '../../controllers/Requests/LeaveControllers';

const leave = new LeavesControllers();

router.post('/request/leaves', leave.getLeaves.bind(leave));
router.post('/request/leaves/not_answer', leave.getLeavesNotAnswer.bind(leave));
router.post('/request/leave/answer', leave.responseRequestLeave.bind(leave));

const CapacitationRoutes = {
  router,
};

export default CapacitationRoutes;
