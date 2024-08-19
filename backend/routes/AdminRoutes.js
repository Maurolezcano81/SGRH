import express from 'express';
import SexRoutes from './People/SexsRoutes.js';
import NacionalityRoutes from './People/Country/NacionalityRoutes.js';
import CountryRoutes from './People/Country/CountryRoutes.js';
import StatusRequestRoutes from './Requests/StatusRequestRoutes.js';
import ContactRoutes from './People/Contact/ContactRoutes.js';
import OccupationRoutes from './People/Department/OccupationRoutes.js';
import TypeOfTerminationRoutes from './Termination/TypeOfTerminationRoutes.js';
import ModuleRoutes from './System/Profile/ModuleRoutes.js';
import DocumentRoutes from './People/Document/DocumentRoutes.js';
import ProfileRoutes from './System/Profile/ProfileRoutes.js';
import DepartmentRoutes from './People/Department/DepartmentRoutes.js';
import SubjectRoutes from './Message/SubjectRoutes.js';
import NavigationMenuRoutes from './System/Navbar/NavigationMenuRoutes.js';

const router = express.Router();

// Mounting all routes
router.use(SexRoutes.router);
router.use(NacionalityRoutes.router);
router.use(CountryRoutes.router);
router.use(StatusRequestRoutes.router);
router.use(ContactRoutes.router);
router.use(OccupationRoutes.router);
router.use(TypeOfTerminationRoutes.router);
router.use(ModuleRoutes.router);
router.use(DocumentRoutes.router);
router.use(ProfileRoutes.router);
router.use(DepartmentRoutes.router);
router.use(SubjectRoutes.router);
router.use(NavigationMenuRoutes.router);


const adminRoutes = {
    router
}

export default adminRoutes;