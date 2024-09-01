import express from 'express';
import CityControllers from '../../../controllers/People/Address/CityControllers.js';
import StateControllers from '../../../controllers/People/Address/StateController.js';

const router = express.Router();

const city = new CityControllers();
const state = new StateControllers();

router.get('/address/cities', city.getCities.bind(city)); // Obtener todas las ciudades con paginación y filtros
router.post('/address/city', city.getCity.bind(city)); // Obtener una ciudad por ID
router.post('/address/city/create', city.createCity.bind(city)); // Crear una nueva ciudad
router.patch('/address/city', city.updateCity.bind(city)); // Actualizar una ciudad existente
router.patch('/address/city/status', city.toggleStatusCity.bind(city)); // Cambiar el estado de una ciudad
router.delete('/address/city', city.deleteCity.bind(city)); // Eliminar una ciudad por ID

// Rutas para operaciones CRUD de estados
router.get('/address/states', state.getStates.bind(state)); // Obtener todos los estados con paginación y filtros
router.post('/address/state', state.getState.bind(state)); // Obtener un estado por ID
router.post('/address/state/create', state.createState.bind(state)); // Crear un nuevo estado
router.patch('/address/state', state.updateState.bind(state)); // Actualizar un estado existente
router.patch('/address/state/status', state.toggleStatusState.bind(state)); // Cambiar el estado de un estado
router.delete('/address/state', state.deleteState.bind(state)); // Eliminar un estado por ID

const AddressRoutes = {
    router
};

export default AddressRoutes;
