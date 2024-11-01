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

const Document = () => {
  const { storageNavbarTitle } = useNav();
  const location = useLocation();
  const { authData } = useAuth();

  const { updateBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
      updateBreadcrumbs([
          { name: 'Tipos de Documento', url: '/rrhh/ajustes/documento' },
      ]);
  }, []);

  const columns = [
    { field: 'name_document', label: 'Nombre' },
    { field: 'status_document', label: 'Estado' }
  ];

  const filterConfigs = [];
  const searchOptions = [
    { value: 'name_document', label: 'Nombre' },
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


  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DOCUMENT}`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_DOCUMENT}`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_DOCUMENT}`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_DOCUMENT}`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USTATUS_DOCUMENT}`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_DOCUMENT}`;



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
    setIdToGet(row.id_document)
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
    setIdToGet(row.id_document)
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
        initialSearchField={'name_document'}
        initialSearchTerm={''}
        initialSort={{ field: 'name_document', order: 'ASC' }}
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
        actionColumn='id_document'
        title_table={"Tipos de Documento"}
        paginationLabelInfo={"Tipos de Documento"}
        buttonOneInfo={{ img: Edit, color: "black", title: "Editar" }}
        buttonTwoInfo={{ img: Trash, color: "red", title: "Eliminar" }}
        isStatusUpdated={isStatusUpdated}
      />

      {isModalUpdateOpen && (
        <ModalUpdate
          title_modal={'Editar Documento'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_document']}
          getOneUrl={getSingleUrl}
          idFetchData="value_document"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={handleModalUpdateClose}
          handleModalUpdate={handleModalUpdateClose}
          fetchData_select={'status_document'}
        />
      )}

      {isModalAddOpen && (
        <ModalAdd
          title_modal={'Nuevo Tipo de Documento'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          method={'POST'}
          fetchData={['name_document']}
          createOne={createOne}
          handleDependencyAdd={updateStatus}
          handleModalAdd={handleModalAddClose}
        />
      )}



      {isModalDeleteOpen && (
        <ModalDelete
          handleModalDelete={handleModalDeleteClose}
          deleteOne={deleteOne}
          field_name={'id_document'}
          idToDelete={idToGet}
          onSubmitDelete={handleModalDeleteClose}
        />
      )}

    </>

  );
};

export default Document;
