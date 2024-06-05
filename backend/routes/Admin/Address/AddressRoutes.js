import express from 'express';
import { getStatesByCountry } from '../../../controllers/System/StateController.js';
import { getCitiesByState } from '../../../controllers/System/CityControllers.js';
const router = express.Router();

router.post('/address/states', getStatesByCountry);
router.post('/address/cities', getCitiesByState);

const StateRoutes = {
    router
};

export default StateRoutes;