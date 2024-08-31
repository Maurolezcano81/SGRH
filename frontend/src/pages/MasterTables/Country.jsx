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

const Country = () => {
  // ESTADO PARA ALMACENAR LOS RESULTADOS DEL FETCH Y SU POSTERIOR FORMATEO
  const [countries, setCountries] = useState([]);
  const [countriesFormatted, setCountriesFormatted] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState(''); // Estado para almacenar el mensaje de "no hay datos"

  // ESTADO PARA ALMACENAR LOS RESULTADOS DEL FETCH Y SU POSTERIOR FORMATEO

  const { storageNavbarTitle } = useNav();

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
  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_COUNTRY}`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_COUNTRY}`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_COUNTRY}`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_COUNTRY}`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USTATUS_COUNTRY}`;
  const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_COUNTRY}`;
  
  // ARRAY PARA MAPEAR EN LA TABLA
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const fetchResponse = await fetch(getAllUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });
        if (!fetchResponse.ok) {
          throw new Error('Ha ocurrido un error al obtener las ocupaciones');
        }

        const data = await fetchResponse.json();
        if (data.queryResponse.length == 0) {
          setNoDataMessage(data.message);
          setCountries([]);
          setCountriesFormatted([]);
        } else {
          setCountries(data.queryResponse);
          formatCountries(data.queryResponse);
          setNoDataMessage('');
        }
      } catch (error) {
        console.error('Error al obtener las ocupaciones', error);
      }
    };

    fetchCountries();
  }, [authData.token, isNewField, isStatusChanged, isUpdatedField, isDeletedField]);

  const formatCountries = (countries) => {
    const formatted = countries.map((country) => ({
      ...country,
    }));
    setCountriesFormatted(formatted);
  };
  // ARRAY PARA MAPEAR EN LA TABLA

  // FUNCIONES PARA MANEJAR MODALES
  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
  };

  const handleModalUpdate = (item) => {
    setIdToGet(item.id_country);
    setToggleModalUpdate(!toggleModalUpdate);
  };
  // FUNCIONES PARA MANEJAR MODALES

  const handleModalDelete = () => {
    setToggleModalDelete(!toggleModalDelete);
  };

  // FUNCIONES PARA OBTENER LAS IDS Y GUARDARLAS EN UN ESTADO PARA LUEGO MANDARLAS POR PROPS
  const handleDelete = (item) => {
    setIdToDelete(item.id_country);
  };

  const handleStatusToggle = (item) => {
    setIdToToggle(item.id_country);
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
      <PreferenceTitle title="Pais" handleModalAdd={handleModalAdd} />
      {toggleModalAdd && (
        <ModalAdd
          title_modal={'Nuevo Pais'}
          labels={['Nombre', 'Abreviacion']}
          placeholders={['Ingrese nombre', 'Ingrese la Abreviacion']}
          method={'POST'}
          fetchData={['name_country', 'abbreviation_country']}
          createOne={createOne}
          handleDependencyAdd={handleDependencyAdd}
          handleModalAdd={handleModalAdd}
        />
      )}

      {toggleModalUpdate && (
        <ModalUpdate
          title_modal={'Editar Pais'}
          labels={['Nombre', 'Abreviacion']}
          placeholders={['Ingrese nombre', 'Ingrese la abreviacion']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_country', 'abbreviation_country']}
          getOneUrl={getSingleUrl}
          idFetchData="value_country"
          idToUpdate={idToGet}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={onSubmitUpdate}
          handleModalUpdate={handleModalUpdate}
          fetchData_select={'status_country'}
        />
        
      )}

      {toggleModalDelete && (
        <ModalDelete
          handleModalDelete={handleModalDelete}
          deleteOne={deleteOne}
          field_name={'id_country'}
          idToDelete={idToDelete}
          onSubmitDelete={onSubmitDelete}
        />
      )}

      <table className="table__preference">
        <thead className="table__preference__head">
          <tr>
            <PreferencesTableHeader keys={['Nombre', 'Abreviacion', 'Estado', 'Acciones']} />
          </tr>
        </thead>
        <tbody className="table__preference__body">
          {countriesFormatted.length > 0 ? (
            <PreferencesBodyRow
              items={countriesFormatted}
              keys={['name_country', 'abbreviation_country']}
              status_name={['id_country', 'status_country']}
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
              <td colSpan="4">{noDataMessage || 'No hay datos ingresados'}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Country;
