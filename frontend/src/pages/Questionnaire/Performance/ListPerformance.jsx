import React, { useState } from 'react';
import TableHorWithFilters from '../../../components/Table/TableHorWithFilters';
import useAuth from '../../../hooks/useAuth';
import ButtonRed from '../../../components/ButtonRed';
import User from "../../../assets/Icons/Buttons/User.png"
import UserDown from "../../../assets/Icons/Buttons/UserDown.png"
import { useNavigate } from 'react-router-dom';
import AlertSuccesfully from '../../../components/Alerts/AlertSuccesfully';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';
import Quizz from '../../../assets/Icons/Buttons/Quizz.png';

const ListPerformance = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const { authData } = useAuth();
    const navigate = useNavigate();

    
    const columns = [
        { field: 'name_ep', label: 'Nombre del cuestionario' },
        { field: 'start_ep', label: 'Fecha de inicio' },
        { field: 'end_ep', label: 'Fecha de Cierre' },
        { field: 'quantity_questions', label: 'Cantidad de preguntas' },
        { field: 'author', label: 'Autor' },
        { field: 'created_at', label: 'Creado' },
        { field: 'updated_at', label: 'Ultima Actualizacion' },
        { field: 'status_ep', label: 'Estado del cuestionario' },
    ];


    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },
        { value: 'name_ep', label: 'Nombre de cuestionario' },
    ];

    const seeQuiz = (row) => {
        console.log(row);
        navigate("/rrhh/rendimiento/ampliar", { state: { value_quiz: row.id_ep } })
        console.log(row.id_ep)
    };


    const addButtonTitle = () => {
        navigate("/rrhh/rendimiento/crear");
    }

    return (
        <>
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <TableHorWithFilters
                addButtonTitle={addButtonTitle}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_ep'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_ep', order: 'ASC' }}
                actions={{
                    view: seeQuiz,
                    edit: (row) => console.log("Editar", row),
                    delete: (row) => console.log("Editar", row)
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: false
                }}
                actionColumn='id_ep'
                title_table={"Listado de cuestionarios"}
                paginationLabelInfo={"Cuestionarios de rendimiento"}
                buttonOneInfo={{ img: Quizz, color: "blue", title: "Ver" }}
                isStatusUpdated={isStatusUpdated}
            />


        </>

    );
}
export default ListPerformance;
