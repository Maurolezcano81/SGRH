import express from 'express';

const router = express.Router();

import UserController from '../controllers/People/User.js';
import CityControllers from '../controllers/People/Address/CityControllers.js';
import StateControllers from '../controllers/People/Address/StateController.js';
import PublicRoutes from './PublicRoutes.js';
import PublicQuizRoutes from './Quiz/PublicQuizRoutes.js';
import DashboardPersonalRoutes from './Dashboard/DashboardPersonalRoutes.js';

const user = new UserController();
const city = new CityControllers();
const state = new StateControllers();

router.post('/profile', user.getProfileUserData.bind(user))
router.post('/address/states/by-country', state.getActives.bind(state));
router.post('/address/cities/by-state', city.getActives.bind(city));


router.use('/dashboard', DashboardPersonalRoutes.router)

router.use(PublicRoutes.router)
router.use(PublicQuizRoutes.router);


const EmployeeRoutes = {
    router,
}

export default EmployeeRoutes