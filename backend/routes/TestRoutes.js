import SubjectRoutes from '../routes/Message/SubjectRoutes.js';

import express from "express";
const app = express()

app.use(SubjectRoutes.router)


const TestRoutes = {
    app
}
export default TestRoutes;