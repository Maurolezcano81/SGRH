import express from 'express';
const router = express.Router();

import DepartmentController from '../../../controllers/People/Department/DepartmentControllers.js';
const department = new DepartmentController();
// DEPARTMENT ROUTES
router.post('/department/create', department.createOne.bind(department));
router.post('/departments', department.getAllWPagination.bind(department));
router.post('/department', department.getOne.bind(department));
router.patch('/department', department.updateOne.bind(department));
router.patch('/department/status', department.toggleStatus.bind(department));
router.delete('/department', department.deleteOne.bind(department));

router.post('/departments/info', department.getDepartmentsInfo.bind(department));
router.patch('/departments/rotation/insert_employee', department.AddEmployeeToDepartment.bind(department));

router.post('/departments/department/:id_department', department.getDepartmentInfo.bind(department));

router.post('/departments/rotation/employees_out/:id_department', department.getEmployeesInOtherDepartment.bind(department));


const DepartmentRoutes = {
  router,
};

export default DepartmentRoutes;
