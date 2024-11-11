import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import TestTable from '../../components/Table/ResponsiveTable';
import ModalAdd from '../../components/Modals/ModalAdd';
import Edit from '../../assets/Icons/Buttons/Edit.png';
import Trash from '../../assets/Icons/Buttons/Trash.png';
import ModalUpdate from '../../components/Modals/ModalUpdate';
import ModalDelete from '../../components/Modals/ModalDelete';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';
import ResponsiveTable from '../../components/Table/ResponsiveTable';


const Contact = () => {
  const { authData } = useAuth();

  
  const location = useLocation();
  const { updateBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
      updateBreadcrumbs([
          { name: 'Ajustes de Datos', url: '/rrhh/ajustes' },
          { name: 'Tipos de Sujeto de Mensaje', url: '/rrhh/ajustes/tipo_sujeto_mensaje' },
      ]);
  }, [location.pathname]);

  const columns = [
    { field: 'name_sm', label: 'Nombre' },
    { field: 'status_sm', label: 'Estado' },
    { field: 'created_at', label: 'Creado el' },
    { field: 'updated_at', label: 'Actualizado el' }
  ];

  const filterConfigs = [];
  const searchOptions = [
    { value: 'name_sm', label: 'Nombre' },
  ];


  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const updateStatus = () => {
    setIsStatusUpdated(!isStatusUpdated);
  };

  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_SUBJECT}`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_SUBJECT}`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_SUBJECT}`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_SUBJECT}`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USTATUS_SUBJECT}`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_SUBJECT}`;



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
    setIdToGet(row.id_sm)
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
    setIdToGet(row.id_sm)
    setIsModalDeleteOpen(true)
  }

  const handleModalDeleteClose = () => {
    setIdToGet("")
    setIsModalDeleteOpen(false)
    updateStatus()
  }

  // MODAL DELETE


  return (
    <>

      <ResponsiveTable
        addButtonTitle={handleModalAddOpen}
        url={getAllUrl}
        authToken={authData.token}
        columns={columns}
        filterConfigs={filterConfigs}
        searchOptions={searchOptions}
        initialSearchField={'name_sm'}
        initialSearchTerm={''}
        initialSort={{ field: 'name_sm', order: 'ASC' }}
        actions={{
          view: (row) => handleModalUpdateOpen(row),
          edit: (row) => handleModalDeleteOpen(row),
          delete: (row) => console.log("Editar", row),
        }}
        showActions={{
          view: true,
          edit: true,
          delete: false
        }}
        actionColumn='id_sm'
        title_table={"Tipos de Asunto de Mensaje"}
        paginationLabelInfo={"Tipos de Asunto de Mensaje"}
        buttonOneInfo={{ img: Edit, color: "black", title: "Editar" }}
        buttonTwoInfo={{ img: Trash, color: "red", title: "Eliminar" }}
        isStatusUpdated={isStatusUpdated}
        titleInfo={[
          { field: "name_sm", type: "field" },
      ]}
        headerInfo={
          ["Nombre"]
        }
      />

      {isModalUpdateOpen && (
        <ModalUpdate
          title_modal={'Editar Tipo de Asunto de Mensaje'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_sm']}
          getOneUrl={getSingleUrl}
          idFetchData="value_sm"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={handleModalUpdateClose}
          handleModalUpdate={handleModalUpdateClose}
          fetchData_select={'status_sm'}
        />
      )}

      {isModalAddOpen && (
        <ModalAdd
          title_modal={'Nuevo Tipo de Asunto de Mensaje'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          method={'POST'}
          fetchData={['name_sm']}
          createOne={createOne}
          handleDependencyAdd={updateStatus}
          handleModalAdd={handleModalAddClose}
        />
      )}



      {isModalDeleteOpen && (
        <ModalDelete
          handleModalDelete={handleModalDeleteClose}
          deleteOne={deleteOne}
          field_name={'id_sm'}
          idToDelete={idToGet}
          onSubmitDelete={handleModalDeleteClose}
        />
      )}

    </>

  );
};

export default Contact;
