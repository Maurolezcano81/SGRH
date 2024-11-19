import express from 'express';
const router = express.Router();

import DashboardPersonalController from '../../controllers/Dashboard/DashboardPersonalController.js';
const dashboard = new DashboardPersonalController();

router.post('/getLast3SatisfactionQuizzes', dashboard.getLast3SatisfactionQuizzes.bind(dashboard));
router.post('/getLastPerformanceQuiz', dashboard.getLastPerformanceQuiz.bind(dashboard));
router.post('/getLast3LeavesRequest', dashboard.getLast3LeavesRequest.bind(dashboard));
router.post('/getLast3CapacitationsRequest', dashboard.getLast3CapacitationsRequest.bind(dashboard));

const DashboardPersonalRoutes = {
    router
}

export default DashboardPersonalRoutes