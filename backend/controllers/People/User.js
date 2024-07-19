import BaseModel from "../../models/BaseModel.js";

class UserController{
    constructor(){
        this.user = new BaseModel('user');
    }

    async getAll (req, res){
        
        const result = await this.user.getAll();

        return res.status(200).json({
            message: "Listado de usuarios",
            result
        })
    }
}

export default UserController;