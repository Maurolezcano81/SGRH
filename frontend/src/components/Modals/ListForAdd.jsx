import ButtonBlue from '../ButtonBlue';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import AlertError from '../Alerts/AlertError';

const ListForAdd = ({ handleModalListForAdd, selectedProfile }) => {
  const { authData } = useAuth();

  const getAllOutProfile = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/modules/profile/out`;
  const bindModuleToProfile = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/module/profile`;

  const [arrayWithValues, setArrayWithValues] = useState([]);
  const [arrayWithValuesFormatted, setArrayWithValuesFormatted] = useState([]);

  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const getAll = async () => {
      const fetchResponse = await fetch(getAllOutProfile, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          id_profile: selectedProfile,
        }),
      });

      if (fetchResponse.status == 403 || fetchResponse.status === 500) {
        setIsEmpty(true);
      }

      const data = await fetchResponse.json();
      setArrayWithValues(data.queryResponse);
      formatted(data.queryResponse);
      setIsEmpty(false);
    };

    getAll();
  }, [authData.token]);

  const formatted = (array) => {
    const format = array.map((item) => ({
      ...item,
    }));

    setArrayWithValuesFormatted(format);
  };

  const BindModuleToProfile = async (id_module) => {
    const fetchResponse = await fetch(bindModuleToProfile, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify({
        id_profile: selectedProfile,
        id_module: id_module,
      }),
    });

    const data = await fetchResponse.json();

    if (fetchResponse.status == 403 || fetchResponse.status === 500) {
      console.log(data.message);
    }

    console.log(data.queryResponse);
    handleModalListForAdd();
  };

  return (
    <div className="alert__background__black">
      <div className="alert__container modal__listforadd">
        <div className="form__button__container">
          <ButtonBlue title={'Volver'} onClick={handleModalListForAdd} />
        </div>

        {arrayWithValuesFormatted.map((item) => (
          <div className="modal__listforadd__item-container" key={item.id_module}>
            <p>{item.url_module}</p>
            <ButtonBlue value={item.id_module} title={'+'} onClick={() => BindModuleToProfile(item.id_module)} />
          </div>
        ))}
        {/* FALTA AGREGAR LA FUNCIONALIDAD DE AGREGAR MODULOS, Y QUE CUANDO SE AGREGUEN SE MUESTRE UN BOTON DE (-) PARA DESASIGNAR MODULOS, OTRO DE GUARDAR CAMBIOS, Y EL DE VOLVER CAMBIAR EL COLOR */}
      </div>
    </div>
  );
};

export default ListForAdd;
