import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import PreferencesTableHeader from '../../components/Table/TablePreferences/PreferencesTableHeader';
import PreferencesBodyRow from '../../components/Table/TablePreferences/PreferencesBodyRow';
import PreferenceTitle from './PreferenceTitle';
import ModalAdd from '../../components/Modals/ModalAdd';
import ModalUpdate from '../../components/Modals/ModalUpdate';
import ModalDelete from '../../components/Modals/ModalDelete';
import useNav from '../../hooks/useNav';
import { useLocation } from 'react-router-dom';

const Attachment = () => {
  // ESTADO PARA ALMACENAR LOS RESULTADOS DEL FETCH Y SU POSTERIOR FORMATEO
  const [attachments, setAttachments] = useState([]);
  const [attachmentsFormatted, setAttachmentFormatted] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState(''); // Estado para almacenar el mensaje de "no hay datos"

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
  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_ATTACHMENT}`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_ATTACHMENT}`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ATTACHMENT}`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_ATTACHMENT}`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USTATUS_ATTACHMENT}`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_ATTACHMENT}`;
  
  // ARRAY PARA MAPEAR EN LA TABLA
  useEffect(() => {
    const fetchAttachment = async () => {
      try {
        const fetchResponse = await fetch(getAllUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });
        if (!fetchResponse.ok) {
          throw new Error('Ha ocurrido un error al obtener los tipos de anexo');
        }

        const data = await fetchResponse.json();
        if (data.queryResponse.length == 0) {
          setNoDataMessage(data.message);
          setAttachments([]);
          setAttachmentFormatted([]);
        } else {
          setAttachments(data.queryResponse);
          formatAttachments(data.queryResponse);
          setNoDataMessage('');
        }
      } catch (error) {
        console.error('Error al obtener los tipos de anexo', error);
      }
    };

    fetchAttachment();
  }, [authData.token, isNewField, isStatusChanged, isUpdatedField, isDeletedField]);

  const formatAttachments = (attachments) => {
    const formatted = attachments.map((attachment) => ({
      ...attachment,
    }));
    setAttachmentFormatted(formatted);
  };
  // ARRAY PARA MAPEAR EN LA TABLA

  // FUNCIONES PARA MANEJAR MODALES
  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
  };

  const handleModalUpdate = (item) => {
    setIdToGet(item.id_ta);
    setToggleModalUpdate(!toggleModalUpdate);
  };
  // FUNCIONES PARA MANEJAR MODALES

  const handleModalDelete = () => {
    setToggleModalDelete(!toggleModalDelete);
  };

  // FUNCIONES PARA OBTENER LAS IDS Y GUARDARLAS EN UN ESTADO PARA LUEGO MANDARLAS POR PROPS
  const handleDelete = (item) => {
    setIdToDelete(item.id_ta);
  };

  const handleStatusToggle = (item) => {
    setIdToToggle(item.id_ta);
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
      <PreferenceTitle title="Tipo de mensaje" handleModalAdd={handleModalAdd} />
      {toggleModalAdd && (
        <ModalAdd
          title_modal={'Nuevo Tipo de Anexo'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          method={'POST'}
          fetchData={['name_ta']}
          createOne={createOne}
          handleDependencyAdd={handleDependencyAdd}
          handleModalAdd={handleModalAdd}
        />
      )}

      {toggleModalUpdate && (
        <ModalUpdate
          title_modal={'Editar Departamento'}
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_ta']}
          getOneUrl={getSingleUrl}
          idFetchData="value_attachment"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={onSubmitUpdate}
          handleModalUpdate={handleModalUpdate}
          fetchData_select={"status_ta"}
        />
      )}

      {toggleModalDelete && (
        <ModalDelete
          handleModalDelete={handleModalDelete}
          deleteOne={deleteOne}
          field_name={'id_ta'}
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
          {attachmentsFormatted.length > 0 ? (
            <PreferencesBodyRow
              items={attachmentsFormatted}
              keys={['name_ta']}
              status_name={['id_ta', 'status_ta']}
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
              <td colSpan="3">{noDataMessage || 'No hay datos ingresados'}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attachment;
