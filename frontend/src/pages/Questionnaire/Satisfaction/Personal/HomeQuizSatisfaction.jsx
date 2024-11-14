import { useEffect, useState } from "react";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import Info from '../../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../../assets/Icons/Buttons/MoveEmployee.png'
import LastFive from "./LastFive";
import useAuth from "../../../../hooks/useAuth";
import ModalInfoQuizAnswered from "../ModalInfoQuizAnswered";
import ResponsiveTableNotTitleAndWhereOnUrl from "../../../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl";
import { useLocation } from "react-router-dom";
import { useBreadcrumbs } from "../../../../contexts/BreadcrumbsContext";

const HomeQuizSatisfaction = () => {

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

    const location = useLocation();
    const { updateBreadcrumbs } = useBreadcrumbs();
  
    useEffect(() => {
      updateBreadcrumbs([
        { name: 'Mis Cuestionarios de Satisfacción', url: '/personal/satisfaccion/ver' },
      ]);
    }, [location.pathname]);
  
    


    const columns = [
        { field: 'name_sq', label: 'Cuestionario' },
        { field: 'start_sq', label: 'Fecha de Inicio' },
        { field: 'end_sq', label: 'Fecha de Fin' },
        { field: 'average', label: 'Puntaje Promedio' },
        { field: 'quantity_questions', label: 'Cantidad de Preguntas' },
    ];

    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_sq', label: 'Nombre del cuestionario' },
        { value: 'start_sq', label: 'Fecha de inicio' },
        { value: 'end_sq', label: 'Fecha de Cierre' },
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
                title={"Portal de Cuestionarios de Satisfacción"}
                titleButton={""}
                onClick={''}
            />

            <LastFive
                dependencyToRefresh={isStatusUpdated}
                setDependencyToRefresh={setIsStatusUpdated}
            />

            <ResponsiveTableNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_SATISFACTIONS_EMPLOYEE_ANSWERED}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_sq'}
                initialSearchTerm={''}
                initialSort={{ field: 'date_complete', order: 'ASC' }}
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
                actionColumn='id_lr'
                paginationLabelInfo={'Cuestionarios Contestados'}
                buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                isStatusUpdated={isStatusUpdated}
                titleInfo={[
                    { field: "name_sq", type: "field" },
                    { field: "Respondido el", type: "string" },
                    { field: "date_complete", type: "field" },
                ]}
                  headerInfo={
                    ["Mis Respuestas a los Cuestionarios"]
                  }
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


export default HomeQuizSatisfaction;