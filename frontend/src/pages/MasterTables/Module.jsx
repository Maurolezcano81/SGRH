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

const Occupation = () => {
  const { authData } = useAuth();

  const location = useLocation();
  const { updateBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
      updateBreadcrumbs([
          { name: 'Ajustes de Datos', url: '/rrhh/ajustes' },
          { name: 'Tipos de Modulos', url: '/rrhh/ajustes/modulo' },
      ]);
  }, [location.pathname]);

  const columns = [
    { field: 'name_module', label: 'Nombre' },
    { field: 'url_module', label: 'Dirección' },
    { field: 'status_module', label: 'Estado' },
    { field: 'created_at', label: 'Creado el' },
    { field: 'updated_at', label: 'Actualizado el' }
  ];

  const filterConfigs = [];
  const searchOptions = [

    { value: 'name_module', label: 'Nombre' },
    { value: 'url_module', label: 'Dirección' },

  ];


  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const updateStatus = () => {
    setIsStatusUpdated(!isStatusUpdated);
  };

  // VARIABLES CON LAS PETICIONES FETCH
  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_MODULE}`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_MODULE}`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_MODULE}`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_MODULE}`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USTATUS_MODULE}`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_MODULE}`;



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
    setIdToGet(row.id_module)
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
    setIdToGet(row.id_module)
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
        initialSearchField={'name_module'}
        initialSearchTerm={''}
        initialSort={{ field: 'name_module', order: 'ASC' }}
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
        actionColumn='id_module'
        title_table={"Tipos de Modulo"}
        paginationLabelInfo={"Tipos de Modulo"}
        buttonOneInfo={{ img: Edit, color: "black", title: "Editar" }}
        buttonTwoInfo={{ img: Trash, color: "red", title: "Eliminar" }}
        isStatusUpdated={isStatusUpdated}
        titleInfo={[
          { field: "name_module", type: "field" },
      ]}
        headerInfo={
          ["Nombre"]
        }
      />

      {isModalUpdateOpen && (
        <ModalUpdate
          title_modal={'Editar Modulo'}
          labels={['Nombre', 'Dirección']}
          placeholders={['Ingrese nombre', 'Ingrese una dirección']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_module', 'url_module']}
          getOneUrl={getSingleUrl}
          idFetchData="value_module"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={handleModalUpdateClose}
          handleModalUpdate={handleModalUpdateClose}
          fetchData_select={'status_module'}
        />
      )}

      {isModalAddOpen && (
        <ModalAdd
          title_modal={'Nuevo Tipo de Modulo'}
          labels={['Nombre', 'Dirección']}
          placeholders={['Ingrese nombre', 'Ingrese una dirección']}
          method={'POST'}
          fetchData={['name_module', 'url_module']}
          createOne={createOne}
          handleDependencyAdd={updateStatus}
          handleModalAdd={handleModalAddClose}
        />
      )}



      {isModalDeleteOpen && (
        <ModalDelete
          handleModalDelete={handleModalDeleteClose}
          deleteOne={deleteOne}
          field_name={'id_module'}
          idToDelete={idToGet}
          onSubmitDelete={handleModalDeleteClose}
        />
      )}

    </>

  );
};

export default Occupation;
