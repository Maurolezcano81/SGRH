import { useState } from "react";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import Info from '../../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../../assets/Icons/Buttons/MoveEmployee.png'
import LastFive from "./LastFive";
import useAuth from "../../../../hooks/useAuth";
import ModalInfoQuizAnswered from "../ModalInfoQuizAnswered";

const HomeQuizPerformanceSupervisor = () => {

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);

    const { authData } = useAuth();

    const handleStatusUpdated = () => {
        setIsStatusUpdated(!isStatusUpdated);
    }

    const handleCloseFormRequest = () => {
        setToggleFormRequest(!toggleFormRequest)
    }


    const columns = [
        { field: 'name_ep', label: 'Cuestionario' },
        { field: 'start_ep', label: 'Fecha de Inicio' },
        { field: 'end_ep', label: 'Fecha de Fin' },
        { field: 'evaluated', label: 'Persona Evaluada'},
        { field: 'average', label: 'Puntaje Promedio' },
        { field: 'quantity_questions', label: 'Cantidad de Preguntas' },
    ];

    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_ep', label: 'Nombre del cuestionario' },
        { value: 'evaluated', label: 'Persona Evaluada' },
        { value: 'quantity_questions', label: 'Cantidad de preguntas' },
    ];


    const openSeeMore = (initialData) => {
        setInitialData(initialData);
        setIsModalInfoOpen(true);
    }

    const closeSeeMore = () => {
        setIsModalInfoOpen(false)
    }


    return (
        <div className="container__page">

            <PreferenceTitle
                title={"Portal de Cuestionarios de Rendimiento"}
                titleButton={""}
                onClick={''}
            />

            <LastFive
                dependencyToRefresh={isStatusUpdated}
                setDependencyToRefresh={setIsStatusUpdated}
            />

            <TableSecondaryNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_SATISFACTIONS_EMPLOYEE_ANSWERED}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_ep'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_ep', order: 'ASC' }}
                actions={{
                    view: (row) => openSeeMore(row),
                    edit: (row) => console.log('Editar', row),
                    delete: (row) => console.log('Editar', row),
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: false
                }}
                actionColumn='id_ep'
                paginationLabelInfo={'Cuestionarios Contestados'}
                buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                isStatusUpdated={isStatusUpdated}
            />

            {isModalInfoOpen && (
                <ModalInfoQuizAnswered
                    initialData={initialData}
                    closeModalAnswer={closeSeeMore}
                />
            )}

        </div>


    )

}


export default HomeQuizPerformanceSupervisor;