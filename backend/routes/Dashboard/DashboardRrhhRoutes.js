import express from 'express';
const router = express.Router();

import DashboardControllers from '../../controllers/Dashboard/Dashboard.js';

const dashboard = new DashboardControllers();

router.post('/quantity_dismiss', dashboard.percentOfDismiss.bind(dashboard));
router.post('/movement_on_departments', dashboard.movementsOnDepartment.bind(dashboard));
router.post('/reason_dismiss', dashboard.getReasonsForDismiss.bind(dashboard));

// leaves
router.post('/quantity_for_leaves', dashboard.getQuantityDaysForLeaves.bind(dashboard));
router.post('/quantity_for_leaves_and_department', dashboard.getQuantityDaysForLeavesAndDepartment.bind(dashboard));

const DashboardRrhhRoutes = {
    router
}

export default DashboardRrhhRoutes