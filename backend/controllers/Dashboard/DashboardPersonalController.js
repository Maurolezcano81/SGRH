import BaseModel from '../../models/BaseModel.js';


import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';
import DashboardPersonalModel from '../../models/Dashboard/DashboardPersonal.js';

class DashboardPersonalController {
    constructor() {
        this.model = new DashboardPersonalModel();
    }

    async getLast3SatisfactionQuizzes(req, res) {
        const {id_user} = req;
 
         try {
             const queryResponse = await this.model.getLast3SatisfactionQuizzes(id_user);
 
             if (queryResponse.length === 0) {
                 return res.status(404).json({
                     message: "No se encontraron datos para el rango de fechas proporcionado"
                 });
             }
 
             return res.status(200).json({
                 message: "Evaluaciones y Promedios obtenidos correctamente",
                 queryResponse,
             });
 
         } catch (error) {
             console.error(error);
             return res.status(500).json({
                 message: 'No se ha podido obtener la información necesaria para el gráfico.'
             });
         }
     }
    
     async getLastPerformanceQuiz(req, res) {
        const {id_user} = req;
         try {
             const queryResponse = await this.model.getLastPerformanceQuiz(id_user);
 
             if (queryResponse.length === 0) {
                 return res.status(404).json({
                     message: "No se encontraron datos para el rango de fechas proporcionado"
                 });
             }

             return res.status(200).json({
                 message: "Evaluaciones y Promedios obtenidos correctamente",
                 queryResponse,
             });
 
         } catch (error) {
             console.error(error);
             return res.status(500).json({
                 message: 'No se ha podido obtener la información necesaria para el gráfico.'
             });
         }
     }

     async getLast3LeavesRequest(req, res) {
        const {id_user} = req;
 
         try {
             const queryResponse = await this.model.getLast3LeavesRequest(id_user);
 
             if (queryResponse.length === 0) {
                 return res.status(404).json({
                     message: "No se encontraron datos para el rango de fechas proporcionado"
                 });
             }
 
             return res.status(200).json({
                 message: "Evaluaciones y Promedios obtenidos correctamente",
                 queryResponse,
             });
 
         } catch (error) {
             console.error(error);
             return res.status(500).json({
                 message: 'No se ha podido obtener la información necesaria para el gráfico.'
             });
         }
     }

     async getLast3CapacitationsRequest(req, res) {
        const {id_user} = req;
 
         try {
             const queryResponse = await this.model.getLast3CapacitationsRequest(id_user);
 
             if (queryResponse.length === 0) {
                 return res.status(404).json({
                     message: "No se encontraron datos para el rango de fechas proporcionado"
                 });
             }
 
             return res.status(200).json({
                 message: "Evaluaciones y Promedios obtenidos correctamente",
                 queryResponse,
             });
 
         } catch (error) {
             console.error(error);
             return res.status(500).json({
                 message: 'No se ha podido obtener la información necesaria para el gráfico.'
             });
         }
     }
}

export default DashboardPersonalController