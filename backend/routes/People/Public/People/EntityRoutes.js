import express from 'express';

import EntityController from '../../../../controllers/People/EntityControllers.js';

const entity = new EntityController();

const router = express.Router();



router.patch('/entity/name', entity.updateName.bind(entity));
router.patch('/entity/lastname', entity.updateLastName.bind(entity));
router.patch('/entity/date_birth', entity.updateDateBirth.bind(entity));
router.patch('/entity/nacionality', entity.updateNacionality.bind(entity));
router.patch('/entity/sex', entity.updateSex.bind(entity));


const EntityRoutes = {
  router,
};
export default EntityRoutes;
