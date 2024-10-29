import express from 'express';
const router = express.Router();

import DashboardControllers from '../../controllers/Dashboard/Dashboard.js';

const dashboard = new DashboardControllers();

router.post('/quantity_dismiss', dashboard.percentOfDismiss.bind(dashboard));

const DashboardRrhhRoutes = {
    router
}

export default DashboardRrhhRoutes