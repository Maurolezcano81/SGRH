import express from 'express';
import CityControllers from '../../../controllers/People/Address/CityControllers.js';
import StateControllers from '../../../controllers/People/Address/StateController.js';

const router = express.Router();

const city = new CityControllers();
const state = new StateControllers();

router.post('/address/city/create', city.createOne.bind(city));
router.post('/address/city', city.getOne.bind(city));
router.patch('/address/city', city.updateOne.bind(city));
router.delete('/address/city', city.deleteOne.bind(city));
router.post('/cities/:id_state', city.getAll.bind(city));


// Rutas para operaciones CRUD de estados
router.post('/address/state/create', state.createOne.bind(state));
router.post('/address/state', state.getOne.bind(state));
router.patch('/address/state', state.updateOne.bind(state));
router.delete('/address/state', state.deleteOne.bind(state));
router.post('/states/:id_country', state.getAll.bind(state));

const AddressRoutes = {
    router
}; 

export default AddressRoutes;
