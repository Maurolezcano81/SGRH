import ButtonBlue from '../ButtonBlue';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

const ListForAdd = ({ handleModalListForAdd, ModulesBinded }) => {
  const { authData } = useAuth();

  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/modules`;
  const [arrayWithValues, setArrayWithValues] = useState([]);
  const [arrayWithValuesFormatted, setArrayWithValuesFormatted] = useState([]);

  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const getAll = async () => {
      const fetchResponse = await fetch(getAllUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
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

  return (
    <div className="alert__background__black">
      <div className="alert__container modal__listforadd">
        <div className="form__button__container">
          <ButtonBlue title={'Volver'} onClick={handleModalListForAdd} />
        </div>

        {arrayWithValuesFormatted.map((item) => (
          <div className="modal__listforadd__item-container" key={item.id_module}>
            <p>{item.name_module}</p>
            <ButtonBlue value={item.id_module} title={'+'} onClick={handleModalListForAdd} />
          </div>
        ))}
        {/* FALTA AGREGAR LA FUNCIONALIDAD DE AGREGAR MODULOS, Y QUE CUANDO SE AGREGUEN SE MUESTRE UN BOTON DE (-) PARA DESASIGNAR MODULOS, OTRO DE GUARDAR CAMBIOS, Y EL DE VOLVER CAMBIAR EL COLOR */}
      </div>
    </div>
  );
};

export default ListForAdd;
