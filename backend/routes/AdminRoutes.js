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
import TypeOfLeaves from "./Leaves/LeavesRoutes.js";
import UserRoutes from "./People/UserRoutes.js";
import ProfileRoutes from "./System/Profile/ProfileRoutes.js";
import ModuleRoutes from "./System/Profile/ModuleRoutes.js";
import SatisfactionRoutes from "./Quiz/Satisfaction.js";
import PerformanceRoutes from "./Quiz/Performance.js";
import CapacitationRoutes from "./Requests/CapacitationRoutes.js";
import LeavesRoutes from "./Requests/LeavesRoutes.js";
import TerminationRoutes from "./Termination/TerminationRoutes.js";
import DashboardRrhhRoutes from "./Dashboard/DashboardRrhhRoutes.js";
import TypeStatusEmployeeRoutes from "./People/TypeStatusEmployee/TypeStatusEmployeeRoutes.js";
import AuditRoutes from "./Audit/AuditRoutes.js";

app.use(SubjectRoutes.router)
app.use(AttachmentRoutes.router)
app.use(ContactRoutes.router);
app.use(CountryRoutes.router);
app.use(NacionalityRoutes.router);
app.use(DepartmentRoutes.router);
app.use(OccupationRoutes.router);
app.use(SexRoutes.router);
app.use(DocumentRoutes.router);
app.use(StatusRequestRoutes.router);
app.use(TypeOfLeaves.router);
app.use(NavigationMenuRoutes.router);
app.use(TypeOfTerminationRoutes.router);
app.use(UserRoutes.router);
app.use(DepartmentRoutes.router);

app.use(SatisfactionRoutes.router);
app.use(PerformanceRoutes.router);


app.use(CapacitationRoutes.router);
app.use(LeavesRoutes.router);

// REEMPLAZAR ESTAS RUTAS TAMBIEN
app.use(ProfileRoutes.router);
app.use(ModuleRoutes.router);
app.use(NavigationMenuRoutes.router);

app.use(TerminationRoutes.router);

app.use(DashboardRrhhRoutes.router);

app.use(TypeStatusEmployeeRoutes.router);

app.use(AuditRoutes.router);

app.use(AddressRoutes.router);
const AdminRoutes = {
    app
}

export default AdminRoutes;