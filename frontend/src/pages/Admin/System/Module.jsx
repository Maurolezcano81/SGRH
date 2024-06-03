import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useNav from '../../../hooks/useNav';
import {
  useLocation
} from 'react-router-dom'

import PreferencesTableHeader from '../../../components/Table/TablePreferences/PreferencesTableHeader';
import PreferencesBodyRow from '../../../components/Table/TablePreferences/PreferencesBodyRow';
import PreferenceTitle from './PreferenceTitle';
import ModalAdd from '../ModalAdd';
import ModalUpdate from '../ModalUpdate';
import ModalDelete from '../ModalDelete';

const Module = () => {
  // ESTADO PARA ALMACENAR LOS RESULTADOS DEL FETCH Y SU POSTERIOR FORMATEO
  const [modules, setModules] = useState([]);
  const [modulesFormatted, setModulesFormatted] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState(""); // Estado para almacenar el mensaje de "no hay datos"
  // ESTADO PARA ALMACENAR LOS RESULTADOS DEL FETCH Y SU POSTERIOR FORMATEO

  const {storageNavbarTitle}  = useNav();

  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    storageNavbarTitle(lastPart);
  }, [location.pathname, storageNavbarTitle]);

  
  // MODALES
  const [toggleModalAdd, setToggleModalAdd] = useState(false);
  const [toggleModalUpdate, setToggleModalUpdate] = useState(false);
  const [toggleModalDelete, setToggleModalDelete] = useState(false);

  // ESTADOS DE ID
  const [idToGet, setIdToGet] = useState(null);
  const [idToToggle, setIdToToggle] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);

  // ESTADOS PARA ACTUALIZAR EL COMPONENTE PRINCIPAL
  const [isNewField, setIsNewField] = useState(false);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [isUpdatedField, setIsUpdatedField] = useState(false);
  const [isDeletedField, setIsDeletedField] = useState(false);

  // CONTEXTO GLOBAL
  const { authData } = useAuth();

  // VARIABLES CON LAS PETICIONES FETCH
  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/modules`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/module`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/module`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/create/module`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/module/status`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/module`;

  // ARRAY PARA MAPEAR EN LA TABLA
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchResponse = await fetch(getAllUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });
        if (!fetchResponse.ok) {
          throw new Error('Ha ocurrido un error al obtener los modulos');
        }

        const data = await fetchResponse.json();
        if (data.queryResponse.length == 0) {
            setNoDataMessage(data.message);
            setModules([]);
            setModulesFormatted([]);
          } else {
            setModules(data.queryResponse);
            formatModules(data.queryResponse);
            setNoDataMessage("");
          }
      } catch (error) {
        console.error('Error al obtener los modulos', error);
      }
    };

    fetchModules();
  }, [authData.token, isNewField, isStatusChanged, isUpdatedField, isDeletedField]);

  const formatModules = (modules) => {
    const formatted = modules.map((module) => ({
      ...module
    }));
    setModulesFormatted(formatted);
  };
  // ARRAY PARA MAPEAR EN LA TABLA

  // FUNCIONES PARA MANEJAR MODALES
  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
  };

  const handleModalUpdate = (item) => {
    setIdToGet(item.id_module);
    setToggleModalUpdate(!toggleModalUpdate);
  };
  // FUNCIONES PARA MANEJAR MODALES

  const handleModalDelete = () => {
    setToggleModalDelete(!toggleModalDelete);
  };

  // FUNCIONES PARA OBTENER LAS IDS Y GUARDARLAS EN UN ESTADO PARA LUEGO MANDARLAS POR PROPS
  const handleDelete = (item) => {
    setIdToDelete(item.id_module);
  };

  const handleStatusToggle = (item) => {
    setIdToToggle(item.id_module);
  };
  // FUNCIONES PARA OBTENER LAS IDS Y GUARDARLAS EN UN ESTADO PARA LUEGO MANDARLAS POR PROPS

  // FUNCIONES PARA MANEJO DE ESTADOS PARA ACTUALIZAR COMPONENTE PRINCIPAL
  const onSubmitUpdate = () => {
    setIsUpdatedField(!isUpdatedField);
    setToggleModalUpdate(!toggleModalUpdate);
  };

  const onSubmitDelete = () => {
    setToggleModalDelete(false);
    setIsDeletedField(!isDeletedField);
  };

  const handleDependencyAdd = () => {
    setIsNewField(!isNewField);
  };

  const handleDependencyToggle = () => {
    setIsStatusChanged(!isStatusChanged);
  };
  // FUNCIONES PARA MANEJO DE ESTADOS PARA ACTUALIZAR COMPONENTE PRINCIPAL

  return (
    <div className="preference__container">
      <PreferenceTitle title="Modulo" handleModalAdd={handleModalAdd} />
      {toggleModalAdd && (
        <ModalAdd
          title_modal={'Nuevo Tipo de Modulo'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          method={'POST'}
          fetchData={['name_module', "url_module"]}
          createOne={createOne}
          handleDependencyAdd={handleDependencyAdd}
          handleModalAdd={handleModalAdd}
        />
      )}

      {toggleModalUpdate && (
        <ModalUpdate
          title_modal={'Editar Modulo'}
          labels={['Nombre', "Direccion", 'Estado']}
          placeholders={['Ingrese nombre', "Ingrese la url del modulo", 'Ingrese el estado']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_module', "url_module", 'status_module']}
          getOneUrl={getSingleUrl}
          idFetchData="value_module"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={onSubmitUpdate}
          handleModalUpdate={handleModalUpdate}
        />
      )}

      {toggleModalDelete && (
        <ModalDelete
          handleModalDelete={handleModalDelete}
          deleteOne={deleteOne}
          field_name={'id_module'}
          idToDelete={idToDelete}
          onSubmitDelete={onSubmitDelete}
        />
      )}

      <table className="table__preference">
        <thead className="table__preference__head">
          <tr>
            <PreferencesTableHeader keys={['Nombre', "Direccion", 'Estado', 'Acciones']} />
          </tr>
        </thead>
        <tbody className="table__preference__body">
        {modulesFormatted.length > 0 ? (
                    <PreferencesBodyRow
                    items={modulesFormatted}
                    keys={['name_module', "url_module"]}
                    status_name={['id_module', 'status_module']}
                    fetchUrl={toggleStatus}
                    idToToggle={idToToggle}
                    handleStatusToggle={handleStatusToggle}
                    handleDependencyToggle={handleDependencyToggle}
                    handleEdit={handleModalUpdate}
                    handleModalDelete={handleModalDelete}
                    handleDelete={handleDelete}
                  />
          ) : (
            <tr>
              <td colSpan="4">{noDataMessage || "No hay datos ingresados"}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Module;
