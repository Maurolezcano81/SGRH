import express from 'express';
const router = express.Router();

import {
  createModule,
  getModule,
  getModules,
  getModulesByProfile,
  getModulesOutProfile,
  updateModule,
  toggleStatusModule,
  deleteModule,
  bindModuleToProfile,
  unBindModuleToProfile,
} from '../../../controllers/System/Profile/ModuleControllers.js';

// MODULE ROUTES
router.post('/create/module', createModule);
router.get('/modules', getModules);
router.post('/modules/profile', getModulesByProfile);
router.post('/modules/profile/out', getModulesOutProfile);
router.post('/module/profile', bindModuleToProfile);
router.delete('/module/profile', unBindModuleToProfile);
router.post('/module', getModule);
router.patch('/module', updateModule);
router.patch('/module/status', toggleStatusModule);
router.delete('/module', deleteModule);

const ModuleRoutes = {
  router,
};

export default ModuleRoutes;
