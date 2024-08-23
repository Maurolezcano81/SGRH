import SubjectRoutes from '../routes/Message/SubjectRoutes.js';
import AddressRoutes from '../routes/People/Address/AddressRoutes.js'
import AttachmentRoutes from '../routes/People/Attachment/Attachment.js';
import ContactRoutes from './People/Contact/ContactRoutes.js';
import CountryRoutes from './People/Country/CountryRoutes.js';

import express from "express";
import NacionalityRoutes from './People/Country/NacionalityRoutes.js';
import DepartmentRoutes from './People/Department/DepartmentRoutes.js';
import OccupationRoutes from './People/Department/OccupationRoutes.js';
import SexRoutes from './People/SexsRoutes.js'
import DocumentRoutes from './People/Document/DocumentRoutes.js';
const app = express()

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

const TestRoutes = {
    app
}
export default TestRoutes;