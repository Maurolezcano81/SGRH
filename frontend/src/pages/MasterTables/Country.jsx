import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useNav from '../../hooks/useNav';
import { useLocation, useNavigate } from 'react-router-dom';
import ResponsiveTable from '../../components/Table/ResponsiveTable';
import State from '../../assets/Icons/Buttons/state.png';
import ModalAdd from '../../components/Modals/ModalAdd';
import Edit from '../../assets/Icons/Buttons/Edit.png';
import Trash from '../../assets/Icons/Buttons/Trash.png';
import ModalUpdate from '../../components/Modals/ModalUpdate';
import ModalDelete from '../../components/Modals/ModalDelete';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';
import ModalAddCountryState from '../../components/Address/ModalAddCountryState';

const Occupation = () => {
  const { authData } = useAuth();

  const location = useLocation();
  const { updateBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    updateBreadcrumbs([
      { name: 'Ajustes de Datos', url: '/rrhh/ajustes' },
      { name: 'Tipos de País', url: '/rrhh/ajustes/pais' },
    ]);
  }, [location.pathname]);

  const columns = [
    { field: 'name_country', label: 'Nombre' },
    { field: 'abbreviation_country', label: 'Abreviación' },
    { field: 'status_country', label: 'Estado' },
    { field: 'created_at', label: 'Creado el' },
    { field: 'updated_at', label: 'Actualizado el' }
  ];

  const filterConfigs = [];
  const searchOptions = [

    { value: 'name_country', label: 'Nombre' },
    { value: 'abbreviation_country', label: 'Abreviación' },

  ];


  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const updateStatus = () => {
    setIsStatusUpdated(!isStatusUpdated);
  };

  // VARIABLES CON LAS PETICIONES FETCH
  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_COUNTRY}`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_COUNTRY}`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_COUNTRY}`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_COUNTRY}`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USTATUS_COUNTRY}`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_COUNTRY}`;



  // MODAL ADD
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const handleModalAddOpen = () => {
    setIsModalAddOpen(true)
  }

  const handleModalAddClose = () => {
    setIsModalAddOpen(false)
  }

  // MODAL ADD

  // MODAL UPDATE

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [idToGet, setIdToGet] = useState("");

  const handleModalUpdateOpen = (row) => {
    setIdToGet(row.id_country)
    setIsModalUpdateOpen(true)
  }

  const handleModalUpdateClose = () => {
    setIdToGet("")
    setIsModalUpdateOpen(false)
    updateStatus()
  }

  // MODAL UPDATE

  // MODAL DELETE

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);


  const handleModalDeleteOpen = (row) => {
    setIdToGet(row.id_country)
    setIsModalDeleteOpen(true)
  }

  const handleModalDeleteClose = () => {
    setIdToGet("")
    setIsModalDeleteOpen(false)
    updateStatus()
  }

  // MODAL DELETE

  const navigate = useNavigate();

  const navigateToState = (row) => {
    navigate('/rrhh/ajustes/provincia', { state: { country: row } })
  };

  return (
    <>

      <ResponsiveTable
        addButtonTitle={handleModalAddOpen}
        url={getAllUrl}
        authToken={authData.token}
        columns={columns}
        filterConfigs={filterConfigs}
        searchOptions={searchOptions}
        initialSearchField={'name_country'}
        initialSearchTerm={''}
        initialSort={{ field: 'name_country', order: 'ASC' }}
        actions={{
          view: (row) => handleModalUpdateOpen(row),
          edit: (row) => handleModalDeleteOpen(row),
          delete: (row) => navigateToState(row),
        }}
        showActions={{
          view: true,
          edit: true,
          delete: true
        }}
        actionColumn='id_country'
        title_table={"Tipos de País"}
        paginationLabelInfo={"Tipos de País"}
        buttonOneInfo={{ img: Edit, color: "black", title: "Editar" }}
        buttonTwoInfo={{ img: Trash, color: "red", title: "Eliminar" }}
        buttonTreeInfo={{ img: State, color: "blue", title: "Ver Provincias" }}
        isStatusUpdated={isStatusUpdated}
        titleInfo={[
          { field: "name_country", type: "field" },
        ]}
        headerInfo={
          ["Nombre"]
        }
      />

      {isModalUpdateOpen && (
        <ModalUpdate
          title_modal={'Editar País'}
          labels={['Nombre', 'Abreviación']}
          placeholders={['Ingrese nombre', 'Ingrese una abreviación']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_country', 'abbreviation_country']}
          getOneUrl={getSingleUrl}
          idFetchData="value_country"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={handleModalUpdateClose}
          handleModalUpdate={handleModalUpdateClose}
          fetchData_select={'status_country'}
        />
      )}

      {isModalAddOpen && (
        <ModalAddCountryState
          title_modal={"Crear País"}
          createOne={createOne}
          handleModalAdd={handleModalAddClose}
          handleDependencyAdd={updateStatus}
        />
      )}



      {isModalDeleteOpen && (
        <ModalDelete
          handleModalDelete={handleModalDeleteClose}
          deleteOne={deleteOne}
          field_name={'id_country'}
          idToDelete={idToGet}
          onSubmitDelete={handleModalDeleteClose}
        />
      )}

    </>

  );
};

export default Occupation;
