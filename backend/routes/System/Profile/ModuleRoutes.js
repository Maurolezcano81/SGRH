import express from 'express';
const router = express.Router();

import {
  getModulesByProfile,
  getModulesOutProfile,
  bindModuleToProfile,
  unBindModuleToProfile,
} from '../../../controllers/System/Profile/ModuleControllers.js';

import ModuleControllersClass from '../../../controllers/System/Profile/ModuleControllersClass.js';
const module = new ModuleControllersClass();

// MODULE ROUTES
router.post('/module/create', module.createOne.bind(module));
router.post('/modules', module.getAllWPagination.bind(module));
router.post('/module', module.getOne.bind(module));
router.patch('/module', module.updateOne.bind(module));
router.delete('/module', module.deleteOne.bind(module));


router.post('/modules/profile', getModulesByProfile);
router.post('/modules/profile/out', getModulesOutProfile);
router.post('/module/profile', bindModuleToProfile);
router.delete('/module/profile', unBindModuleToProfile);


const ModuleRoutes = {
  router,
};

export default ModuleRoutes;
