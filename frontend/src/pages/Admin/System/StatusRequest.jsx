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

const StatusRequest = () => {
  // ESTADO PARA ALMACENAR LOS RESULTADOS DEL FETCH Y SU POSTERIOR FORMATEO
  const [statuses, setStatuses] = useState([]);
  const [statusesFormatted, setStatusesFormatted] = useState([]);
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
  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/statuses_request`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/status_request`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/status_request`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/create/status_request`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/status_request/status`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/status_request`;

  // ARRAY PARA MAPEAR EN LA TABLA
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const fetchResponse = await fetch(getAllUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });
        if (!fetchResponse.ok) {
          throw new Error('Ha ocurrido un error al obtener los estados de solicitud');
        }

        const data = await fetchResponse.json();
        if (data.queryResponse.length == 0) {
            setNoDataMessage(data.message);
            setStatuses([]);
            setStatusesFormatted([]);
          } else {
            setStatuses(data.queryResponse);
            formatStatuses(data.queryResponse);
            setNoDataMessage("");
          }
      } catch (error) {
        console.error('Error al obtener los estados de solicitud', error);
      }
    };

    fetchStatuses();
  }, [authData.token, isNewField, isStatusChanged, isUpdatedField, isDeletedField]);

  const formatStatuses = (statuses) => {
    const formatted = statuses.map((status) => ({
      ...status
    }));
    setStatusesFormatted(formatted);
  };
  // ARRAY PARA MAPEAR EN LA TABLA

  // FUNCIONES PARA MANEJAR MODALES
  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
  };

  const handleModalUpdate = (item) => {
    setIdToGet(item.id_sr);
    setToggleModalUpdate(!toggleModalUpdate);
  };
  // FUNCIONES PARA MANEJAR MODALES

  const handleModalDelete = () => {
    setToggleModalDelete(!toggleModalDelete);
  };

  // FUNCIONES PARA OBTENER LAS IDS Y GUARDARLAS EN UN ESTADO PARA LUEGO MANDARLAS POR PROPS
  const handleDelete = (item) => {
    setIdToDelete(item.id_sr);
  };

  const handleStatusToggle = (item) => {
    setIdToToggle(item.id_sr);
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
      <PreferenceTitle title="Estado" handleModalAdd={handleModalAdd} />
      {toggleModalAdd && (
        <ModalAdd
          title_modal={'Nuevo Tipo de Estado de Solicitud'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          method={'POST'}
          fetchData={['name_sr']}
          createOne={createOne}
          handleDependencyAdd={handleDependencyAdd}
          handleModalAdd={handleModalAdd}
        />
      )}

      {toggleModalUpdate && (
        <ModalUpdate
          title_modal={'Editar Estado de Solicitud'}
          labels={['Nombre', 'Estado']}
          placeholders={['Ingrese nombre', 'Ingrese el estado']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_sr', 'status_sr']}
          getOneUrl={getSingleUrl}
          idFetchData="value_sr"
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
          field_name={'id_sr'}
          idToDelete={idToDelete}
          onSubmitDelete={onSubmitDelete}
        />
      )}

      <table className="table__preference">
        <thead className="table__preference__head">
          <tr>
            <PreferencesTableHeader keys={['Nombre', 'Estado', 'Acciones']} />
          </tr>
        </thead>
        <tbody className="table__preference__body">
        {statusesFormatted.length > 0 ? (
                    <PreferencesBodyRow
                    items={statusesFormatted}
                    keys={['name_sr']}
                    status_name={['id_sr', 'status_sr']}
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
              <td colSpan="3">{noDataMessage || "No hay datos ingresados"}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatusRequest;
