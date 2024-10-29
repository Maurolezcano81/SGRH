import BaseModel from '../../models/BaseModel.js';
import DashboardModel from '../../models/Dashboard/Dashboard.js';


import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class DashboardControllers {
    constructor() {
        this.model = new DashboardModel();
    }


    async percentOfDismiss(req, res) {
        const { year } = req.body;
        try {
            const date = new Date()

            if(isInputEmpty(year)){
                year = date.getFullYear();
            }

            const queryResponse = await this.model.percentOfDismiss(year);

            const minAndMaxYears = await this.model.getMinAndMaxYearsForDismiss();

            if(queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse,
                minAndMaxYears: minAndMaxYears[0]
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas' 
            })
        }
    }
}


export default DashboardControllers