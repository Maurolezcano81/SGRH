import express from 'express';
import { getStatesByCountry } from '../../../controllers/People/Address/StateController.js'
import { getCitiesByState } from '../../../controllers/People/Address/CityControllers.js';
const router = express.Router();

router.post('/address/states', getStatesByCountry);
router.post('/address/cities', getCitiesByState);

const StateRoutes = {
    router
};

export default StateRoutes;