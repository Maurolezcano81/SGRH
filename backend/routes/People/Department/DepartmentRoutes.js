import express from 'express';
const router = express.Router();

import {
  createDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
  toggleStatusDepartment,
  deleteDepartment,
} from '../../../controllers/People/Department/DepartmentControllers.js';

// DEPARTMENT ROUTES
router.post('/create/department', createDepartment);
router.get('/departments', getDepartments);
router.post('/department', getDepartment);
router.patch('/department', updateDepartment);
router.patch('/department/status', toggleStatusDepartment);
router.delete('/department', deleteDepartment);

const DepartmentRoutes = {
  router,
};

export default DepartmentRoutes;
