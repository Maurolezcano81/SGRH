import { uploadFiles, handleFileUpload, printFileUrl, uploadArray, handleFileUploadNotObligatory } from '../middlewares/Uploads.js';

// Imports
import express from 'express';
import TypeOfLeaveController from "../controllers/Leaves/TypeOfLeavesController.js";
import SubjectType from '../controllers/Message/SubjectTypeControllers.js';
import CityControllers from '../controllers/People/Address/CityControllers.js';
import StateControllers from '../controllers/People/Address/StateController.js';
import AttachmentControllers from '../controllers/People/Attachment/AttachmentType.js';
import ContactController from '../controllers/People/Contact/ContactControllers.js';
import CountryController from '../controllers/People/Country/CountryControllers.js';
import NacionalityController from '../controllers/People/Country/NacionalityControllers.js';
import DepartmentController from '../controllers/People/Department/DepartmentControllers.js';
import OccupationControllers from '../controllers/People/Department/OccupationController.js';
import DocumentControllers from '../controllers/People/Document/DocumentControllers.js';
import SexControllers from '../controllers/People/SexControllers.js';
import StatusRequestControllers from '../controllers/Requests/StatusRequestControllers.js';
import EntityRoutes from './People/Public/People/EntityRoutes.js';
import UserPublic from './People/Public/People/UserPublic.js';
import ProfileController from '../controllers/System/Profile/Profile.js';
import CapacitationControllers from '../controllers/Requests/CapacitationControllers.js';
import LeavesControllers from '../controllers/Requests/LeaveControllers.js';
import TypeOfLeaveControllers from '../controllers/Leaves/TypeOfLeavesController.js';

const requestAttachmentUpload = uploadFiles('image_url', 'uploads/requests');


// Instances
const router = express.Router();

const typeOfLeave = new TypeOfLeaveController();
const subject = new SubjectType();
const city = new CityControllers();
const state = new StateControllers();
const attachment = new AttachmentControllers();
const contact = new ContactController();
const country = new CountryController();
const nacionality = new NacionalityController();
const department = new DepartmentController();
const occupation = new OccupationControllers();
const document = new DocumentControllers();
const sex = new SexControllers();
const statusRequest = new StatusRequestControllers();
const profile = new ProfileController();
const capacitation = new CapacitationControllers();
const leave = new LeavesControllers();
// Routes

// Subject Routes
router.get('/subjects', subject.getSubjects.bind(subject));

// Address Routes
router.get('/address/cities', city.getCities.bind(city)); // Obtener todas las ciudades con paginación y filtros
router.get('/address/states', state.getStates.bind(state)); // Obtener todos los estados con paginación y filtros

// Attachment Routes
router.get('/attachments', attachment.getAttachments.bind(attachment));

// Contact Routes
router.get('/contacts', contact.getContacts.bind(contact));

// Country Routes
router.get('/countries', country.getCountries.bind(country));

// Nacionality Routes
router.get('/nacionalities', nacionality.getNacionalities.bind(nacionality));

// Department Routes
router.get('/departments', department.getDepartments.bind(department));

// Occupation Routes
router.get('/occupations', occupation.getOccupations.bind(occupation));

// Document Routes
router.get('/documents', document.getDocuments.bind(document));
router.patch('/document/update', document.updateEntityDocument.bind(document));

// Sex Routes
router.get('/sexs', sex.getSexs.bind(sex));

// Status Request Routes
router.get('/statuses_request', statusRequest.getStatusesRequest.bind(statusRequest));

// Profile Routes
router.get('/profiles', profile.getProfiles.bind(profile));

// Type of leaves routes
router.get('/types_of_leave', typeOfLeave.getTypesOfLeave.bind(typeOfLeave));
router.post('/types_of_leave', typeOfLeave.getTypeOfLeave.bind(typeOfLeave));

router.post('/request/capacitations/user', capacitation.getCapacitationsById.bind(capacitation));
router.post('/request/capacitation/new', capacitation.createRequestCapacitation.bind(capacitation));

router.post('/document/entity/new', document.createEntityDocument.bind(document));
router.delete('/document/entity/delete', document.deleteEntityDocument.bind(document));

router.post('/contact/entity/new', contact.createEntityContact.bind(contact));
router.delete('/contact/entity/delete', contact.deleteEntityContact.bind(contact));


router.post('/request/leaves/user', leave.getLeavesById.bind(leave));
router.post('/request/leave/new',
  uploadArray('pictures', 'uploads/requests'), // Campo 'image' y carpeta de destino
  handleFileUploadNotObligatory('/uploads/requests'),   // Configuración del path base
  leave.createRequestLeave.bind(leave)      // Controlador para manejar la solicitud
);
router.use(EntityRoutes.router);
router.use(UserPublic.router)
const PublicRoutes = {
  router
}




export default PublicRoutes
