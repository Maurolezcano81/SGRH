import BaseModel from "../../models/BaseModel.js";

class UserController {
    constructor() {
        this.user = new BaseModel('user');
    }

    async getAll(req, res) {
        try {
            // Obtener los parámetros de la consulta (query) desde req
            const limit = parseInt(req.body.limit) || 10;
            const offset = parseInt(req.body.offset) || 0;
            const orderBy = req.body.orderBy || 'username_user'; // Ordenar por nombre por defecto
            const order = req.body.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Ascendente por defecto


            const total = await this.user.getAll();
            // Llamar al método getAll del modelo con los valores de paginación y ordenación
            const result = await this.user.getAllPagination(limit, offset, orderBy, order);

            return res.status(200).json({
                message: "Listado de usuarios",
                quantity: total,
                result
            });
        } catch (error) {
            console.error("Error al obtener los usuarios:", error.message);
            return res.status(500).json({
                message: "Error al obtener los usuarios",
                error: error.message
            });
        }
    }
}

export default UserController;
