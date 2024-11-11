import PageWithSelect from '../../components/Layouts/PageWithSelect';
import ButtonWithOutlineBlack from '../../components/Buttons/ButtonWhiteOutlineBlack'
import ModalAdd from '../../components/Modals/ModalAdd';
import { useEffect, useState } from 'react';
import ModalAddProfiles from '../../components/Modals/Specifics/ProfileModule/ModalAddProfile';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';
import { useLocation } from 'react-router-dom';
const Profiles = () => {

  const getOptionsUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_PROFILE}`;
  const getModulesByProfileUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.MODULES_BY_PROFILE}`;
  const unBindModule = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.UNBIND_MODULE}`;

  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_PROFILE}`;

  const getMenus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_NAVMENUS}`;

  const [toggleModalAdd, setToggleModalAdd] = useState(false);


  const [isNewField, setIsNewField] = useState(false);

  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
    setIsNewField(!isNewField);
  };

  const location = useLocation();
  const { updateBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    updateBreadcrumbs([
      { name: 'Ajustes de Datos', url: '/rrhh/ajustes' },
      { name: 'Asignación de Modulos', url: '/admin/perfiles' },
    ]);
  }, [location.pathname]);

  const handleDependencyAdd = () => {
    setIsNewField(!isNewField);
  };
  return (
    <div className='section__padding-10'>
      <div className='section__container'>
        <PageWithSelect
          getOptions={getOptionsUrl}
          getContentTable={getModulesByProfileUrl}
          tableFields={{ name: 'name_module', id: 'id_pm' }}
          selectFields={{ name: 'name_profile', id: 'id_profile' }}
          nameFetchConditioned="id_profile"
          deleteOne={unBindModule}
          field_name={"id_pm"}
          dependencyRefreshListSelect={isNewField}
        />
        <div className='button__container__full'>
          <ButtonWithOutlineBlack onClick={handleModalAdd} title="Agregar Perfil +" />
        </div>

        {toggleModalAdd && (
          <ModalAddProfiles
            title_modal={'Nuevo Perfil'}
            labels={['Nombre']}
            placeholders={['Ingrese nombre']}
            method={'POST'}
            fetchData={['name_profile', 'nm_fk']}
            createOne={createOne}
            handleDependencyAdd={handleDependencyAdd}
            handleModalAdd={handleModalAdd}
            urlGetElements={getMenus}
            name_field_select={"nm_fk"}
            messageSelect={"Seleccione un perfil"}
            name_field_text={"name_nm"}
            name_field_id={'id_nm'}
          />
        )}

      </div>

    </div>
  );
};

export default Profiles;
