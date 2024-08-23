import SubjectRoutes from '../routes/Message/SubjectRoutes.js';
import AddressRoutes from '../routes/People/Address/AddressRoutes.js'
import AttachmentRoutes from '../routes/People/Attachment/Attachment.js';

import express from "express";
const app = express()

app.use(SubjectRoutes.router)
app.use(AddressRoutes.router)
app.use(AttachmentRoutes.router)

const TestRoutes = {
    app
}
export default TestRoutes;