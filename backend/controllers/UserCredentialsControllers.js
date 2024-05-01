import UserCredentials from '../models/UserCredentials.js';

const UserCredentialsInstance = new UserCredentials();

const getUser = async (req,res) =>{
    try{
        const { username, pwd } = req.body;
        const user = await UserCredentialsInstance.getUser(username, pwd);
        res.status(200).json({
            message:"sesion iniciada correctamente",
            user

        })
    } catch(e){
        console.log(e.name + ' controlador')
    }
}

const UserCredentialsControllers = {
    getUser
}

export default UserCredentialsControllers;