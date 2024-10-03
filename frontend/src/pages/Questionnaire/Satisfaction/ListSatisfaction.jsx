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

const ListSatisfaction = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const { authData } = useAuth();
    const navigate = useNavigate();

    
    const columns = [
        { field: 'name_sq', label: 'Nombre del cuestionario' },
        { field: 'start_sq', label: 'Fecha de inicio' },
        { field: 'end_sq', label: 'Fecha de Cierre' },
        { field: 'quantity_questions', label: 'Cantidad de preguntas' },
        { field: 'author', label: 'Autor' },
        { field: 'created_at', label: 'Creado' },
        { field: 'updated_at', label: 'Ultima Actualizacion' },
    ];


    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },
        { value: 'name_sq', label: 'Nombre de cuestionario' },
    ];

    const seeQuiz = (row) => {
        console.log(row);
        navigate("/rrhh/satisfaccion/ampliar", { state: { value_quiz: row.id_sq } })
        console.log(row.id_sq)
    };


    const addButtonTitle = () => {
        navigate("/rrhh/satisfaccion/crear");
    }

    return (
        <>
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <TableHorWithFilters
                addButtonTitle={addButtonTitle}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_SATISFACTION}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_sq'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_sq', order: 'ASC' }}
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
                actionColumn='id_sq'
                title_table={"Listado de cuestionarios"}
                paginationLabelInfo={"Cuestionarios de satisfaccion"}
                buttonOneInfo={{ img: Quizz, color: "blue", title: "Ver" }}
                isStatusUpdated={isStatusUpdated}
            />


        </>

    );
}
export default ListSatisfaction;
