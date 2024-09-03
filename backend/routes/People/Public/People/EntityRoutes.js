import express from 'express';

import EntityController from '../../../../controllers/People/EntityControllers.js';
import EmployeeControllers from '../../../../controllers/People/EmployeeControllers.js';


const entity = new EntityController();
const employee = new EmployeeControllers();
const router = express.Router();



router.patch('/entity/name', entity.updateName.bind(entity));
router.patch('/entity/lastname', entity.updateLastName.bind(entity));
router.patch('/entity/date_birth', entity.updateDateBirth.bind(entity));
router.patch('/entity/nacionality', entity.updateNacionality.bind(entity));
router.patch('/entity/sex', entity.updateSex.bind(entity));
router.patch('/entity/address', entity.updateAddress.bind(entity))


router.patch('/employee/file', employee.updateFile.bind(employee));
router.patch('/employee/date_entry', employee.updateDateEntry.bind(employee));
router.patch('/employee/status', employee.updateStatus.bind(employee));

router.patch('/employee/occupation', employee.updateOccupation.bind(employee));
router.patch('/employee/department', employee.updateDepartment.bind(employee));

const EntityRoutes = {
  router,
};
export default EntityRoutes;
