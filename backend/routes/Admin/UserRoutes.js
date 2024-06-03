import express from 'express';
import { createUser } from '../../controllers/People/UserControllers.js';
import { uploadFiles, handleFileUpload, printFileUrl } from '../../middlewares/Uploads.js';

const router = express.Router();
const avatarUpload = uploadFiles("avatar_url", "uploads/avatars")

router.post('/user/create', avatarUpload, handleFileUpload, createUser);


const UserRoutes = {
    router
  };  
  export default UserRoutes;
  