import express from 'express';
const router = express.Router();

import DepartmentController from '../../../controllers/People/Department/DepartmentControllers.js';
const department = new DepartmentController();
// DEPARTMENT ROUTES
router.post('/department/create', department.createDepartment.bind(department));
router.get('/departments', department.getDepartments.bind(department));
router.post('/department', department.getDepartment.bind(department));
router.patch('/department', department.updateDepartment.bind(department));
router.patch('/department/status', department.toggleStatusDepartment.bind(department));
router.delete('/department', department.deleteDepartment.bind(department));

router.post('/departments/info', department.getDepartmentsInfo.bind(department));
router.post('/departments/department/:id_department', department.getDepartmentInfo.bind(department));


const DepartmentRoutes = {
  router,
};

export default DepartmentRoutes;
