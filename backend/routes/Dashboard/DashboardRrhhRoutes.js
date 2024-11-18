import express from 'express';
const router = express.Router();

import DashboardControllers from '../../controllers/Dashboard/Dashboard.js';
import SummariesControllers from '../../controllers/Dashboard/SummariesControllers.js';

const dashboard = new DashboardControllers();
const summary = new SummariesControllers();

router.post('/quantity_dismiss', dashboard.percentOfDismiss.bind(dashboard));
router.post('/movement_on_departments', dashboard.movementsOnDepartment.bind(dashboard));
router.post('/reason_dismiss', dashboard.getReasonsForDismiss.bind(dashboard));

// leaves
router.post('/quantity_for_leaves', dashboard.getQuantityDaysForLeaves.bind(dashboard));
router.post('/quantity_for_leaves_and_department', dashboard.getQuantityDaysForLeavesAndDepartment.bind(dashboard));
router.post('/quantity_for_leaves_on_period_time', dashboard.getLeavesOnPeriodOfTime.bind(dashboard));

// performance
router.post('/average_performance_by_employee', dashboard.getAveragePerformanceByEmployee.bind(dashboard));
router.post('/average_performance_by_department', dashboard.getAveragePerformanceByDepartments.bind(dashboard));

router.post('/average_performance_by_department_and_quiz', dashboard.getAveragePerformanceByDepartmentsAndQuizzes.bind(dashboard));

router.post('/summary/percent_of_dismiss', summary.PercentOfDismissByYear.bind(summary));
router.post('/summary/years_percent_of_dismiss', summary.getMinAndMaxYearsForDissmiss.bind(summary));

// 2
router.post('/summary/movements_on_departments_in_year', summary.getDiffsOnDepartmentsInYear.bind(summary));
router.post('/summary/years_movements_on_departments_in_year', summary.getMinAndMaxDiffsOnDepartmentsInYear.bind(summary));

router.post('/summary/leavesDaysForDepartment', summary.DaysLeavesForDepartment.bind(summary));

router.post('/summary/leavesDaysForYear', summary.DaysLeavesForYear.bind(summary));
router.post('/summary/years_leavesDaysForYear', summary.MinAndMaxYearsDaysLeavesForYear.bind(summary));

router.post('/summary/diversityOfSexs', summary.DiversityOfSexs.bind(summary));
router.post('/summary/longevityEmployees', summary.longevityEmployees.bind(summary));
router.post('/summary/DiversityOfNacionalities', summary.DiversityOfNacionalities.bind(summary));
router.post('/summary/expensesByDepartments', summary.expensesByDepartments.bind(summary));
router.post('/summary/expensesByRanges', summary.expensesByRanges.bind(summary));






const DashboardRrhhRoutes = {
    router
}

export default DashboardRrhhRoutes