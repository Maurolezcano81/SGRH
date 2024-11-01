import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useNav from '../../hooks/useNav';
import { useLocation } from 'react-router-dom';
import TestTable from '../../components/Table/ResponsiveTable';
import User from '../../assets/Icons/Buttons/User.png'
import UserDown from '../../assets/Icons/Buttons/UserDown.png';
import ModalAdd from '../../components/Modals/ModalAdd';
import Edit from '../../assets/Icons/Buttons/Edit.png';
import Trash from '../../assets/Icons/Buttons/Trash.png';
import ModalUpdate from '../../components/Modals/ModalUpdate';
import ModalDelete from '../../components/Modals/ModalDelete';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';

const Department = () => {
  const { storageNavbarTitle } = useNav();
  const location = useLocation();
  const { authData } = useAuth();


  const { updateBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
      updateBreadcrumbs([
          { name: 'Departamentos', url: '/rrhh/ajustes/departamento' },
      ]);
  }, []);

  const columns = [
    { field: 'name_department', label: 'Nombre' },
    { field: 'status_department', label: 'Estado' }
  ];

  const filterConfigs = [];
  const searchOptions = [
    { value: 'name_department', label: 'Nombre' },
  ];


  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const updateStatus = () => {
    setIsStatusUpdated(!isStatusUpdated);
  };

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    storageNavbarTitle(lastPart);
  }, [location.pathname, storageNavbarTitle]);


  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT}`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_DEPARTMENT}`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_DEPARTMENT}`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_DEPARTMENT}`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USTATUS_DEPARTMENT}`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_DEPARTMENT}`;



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
    setIdToGet(row.id_department)
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
    setIdToGet(row.id_department)
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

      <TestTable
        addButtonTitle={handleModalAddOpen}
        url={getAllUrl}
        authToken={authData.token}
        columns={columns}
        filterConfigs={filterConfigs}
        searchOptions={searchOptions}
        initialSearchField={'name_department'}
        initialSearchTerm={''}
        initialSort={{ field: 'name_department', order: 'ASC' }}
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
        actionColumn='id_department'
        title_table={"Departamentos"}
        paginationLabelInfo={"Departamentos"}
        buttonOneInfo={{ img: Edit, color: "black", title: "Editar" }}
        buttonTwoInfo={{ img: Trash, color: "red", title: "Eliminar" }}
        isStatusUpdated={isStatusUpdated}
      />

      {isModalUpdateOpen && (
        <ModalUpdate
          title_modal={'Editar Departamento'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_department']}
          getOneUrl={getSingleUrl}
          idFetchData="value_department"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={handleModalUpdateClose}
          handleModalUpdate={handleModalUpdateClose}
          fetchData_select={'status_department'}
        />
      )}

      {isModalAddOpen && (
        <ModalAdd
          title_modal={'Nuevo Departamento'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          method={'POST'}
          fetchData={['name_department']}
          createOne={createOne}
          handleDependencyAdd={updateStatus}
          handleModalAdd={handleModalAddClose}
        />
      )}



      {isModalDeleteOpen && (
        <ModalDelete
          handleModalDelete={handleModalDeleteClose}
          deleteOne={deleteOne}
          field_name={'id_department'}
          idToDelete={idToGet}
          onSubmitDelete={handleModalDeleteClose}
        />
      )}

    </>

  );
};

export default Department;
