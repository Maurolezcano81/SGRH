import PageWithSelect from '../../../components/Layouts/PageWithSelect';

const Profiles = () => {


  const getOptionsUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/profiles`;
  const getModulesByProfileUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/modules/profile`;
  const unBindModule = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/module/profile`;


  return (
    <>

      <PageWithSelect
        getOptions={getOptionsUrl}
        getContentTable={getModulesByProfileUrl}
        tableFields={{ name: 'name_module', id: 'id_pm' }}
        selectFields={{ name: 'name_profile', id: 'id_profile' }}
        nameFetchConditioned="id_profile"
        deleteOne={unBindModule}
        field_name={"id_pm"}
      />
    </>
  );
};

export default Profiles;
