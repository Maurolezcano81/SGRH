import express from "express";
const app = express()

import SubjectRoutes from '../routes/Message/SubjectRoutes.js';
import AddressRoutes from '../routes/People/Address/AddressRoutes.js'
import AttachmentRoutes from '../routes/People/Attachment/Attachment.js';
import ContactRoutes from './People/Contact/ContactRoutes.js';
import CountryRoutes from './People/Country/CountryRoutes.js';
import NacionalityRoutes from './People/Country/NacionalityRoutes.js';
import DepartmentRoutes from './People/Department/DepartmentRoutes.js';
import OccupationRoutes from './People/Department/OccupationRoutes.js';
import SexRoutes from './People/SexsRoutes.js'
import DocumentRoutes from './People/Document/DocumentRoutes.js';
import StatusRequestRoutes from './Requests/StatusRequestRoutes.js';
import NavigationMenuRoutes from './System/Navbar/NavigationMenuRoutes.js';
import TypeOfTerminationRoutes from './Termination/TypeOfTerminationRoutes.js';
import LeavesRoutes from "./Leaves/LeavesRoutes.js";
import UserRoutes from "./People/UserRoutes.js";
import ProfileRoutes from "./System/Profile/ProfileRoutes.js";
import ModuleRoutes from "./System/Profile/ModuleRoutes.js";

app.use(SubjectRoutes.router)
app.use(AddressRoutes.router)
app.use(AttachmentRoutes.router)
app.use(ContactRoutes.router);
app.use(CountryRoutes.router);
app.use(NacionalityRoutes.router);
app.use(DepartmentRoutes.router);
app.use(OccupationRoutes.router);
app.use(SexRoutes.router);
app.use(DocumentRoutes.router);
app.use(StatusRequestRoutes.router);
app.use(LeavesRoutes.router);
app.use(NavigationMenuRoutes.router);
app.use(TypeOfTerminationRoutes.router);
app.use(UserRoutes.router);

// REEMPLAZAR ESTAS RUTAS TAMBIEN
app.use(ProfileRoutes.router);
app.use(ModuleRoutes.router);
app.use(NavigationMenuRoutes.router);

const AdminRoutes = {
    app
}

export default AdminRoutes;