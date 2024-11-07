import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';

const AddressdataSection = ({ setAddressData, error, setCriticalErrorToggle, setCriticalErrorMessagge }) => {
  const [listCountries, setListCountries] = useState([]);
  const [listStates, setListStates] = useState([]);
  const [listCities, setListCities] = useState([]);

  const { authData } = useAuth();

  const getCountries = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_COUNTRY_ACTIVES}`;
  const getStatesByCountries = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.STATES_BY_COUNTRY}`;
  const getCitiesByState = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.CITIES_BY_STATE}`;

  useEffect(() => {
    const fetchCountriesRequest = async () => {
      if (authData.token) {
        try {
          const fetchResponse = await fetch(getCountries, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authData.token}`,
            },
          });

          if (!fetchResponse.ok) {
            setCriticalErrorToggle(true);
            setCriticalErrorMessagge(dataFetch.message);
            return;
          }

          const countriesList = await fetchResponse.json();

          const activeCountries = countriesList.list.filter((country) => country.status_country === 1);

          setListCountries(activeCountries || []);
        } catch (error) {
          console.error(error.message);
        }
      }
    };

    fetchCountriesRequest();
  }, [authData.token]);

  const handleCountryChange = (e) => {
    setListCities([]);
    changeStates(e.target.value);
  };

  const changeStates = async (country_fk) => {
    try {
      const fetchResponse = await fetch(getStatesByCountries, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          country_fk: country_fk,
        }),
      });

      const fetchData = await fetchResponse.json();

      if(fetchResponse.status === 500){
        setCriticalErrorToggle(true);
        setCriticalErrorMessagge(fetchData.message);
        return;
      }

      if (fetchResponse.status === 403) {
        setListStates([]);
      }


      const activeStates = fetchData.queryResponse.filter((state) => state.status_state === 1);

      setListStates(activeStates || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeCities = (e) => {
    setListCities([]);
    changeCities(e.target.value);
  };

  const changeCities = async (state_fk) => {
    try {
      const fetchResponse = await fetch(getCitiesByState, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          state_fk: state_fk,
        }),
      });

      if(fetchResponse.status === 500){
        setCriticalErrorToggle(true);
        setCriticalErrorMessagge(dataFetch.message);
        return;
      }

      if (fetchResponse.status === 403) {
        setListCities([]);
      }

      const fetchData = await fetchResponse.json();
      const activeCities = fetchData.queryResponse.filter((city) => city.status_city === 1);

      setListCities(activeCities || []);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeCityAddress = (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container__section">
      <div className="container__title-form">
        <h2>Domicilio</h2>
      </div>
      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="id_country">
          País
        </label>

        <select onChange={handleCountryChange} className="input__form__div__input" name="id_country" id="id_country">
          <option value="" key="">
            Seleccione un país
          </option>
          {listCountries.map((country) => (
            <option key={country.id_country} value={country.id_country} name={country.id_country}>
              {country.name_country}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="id_state">
          Provincia
        </label>

        <select onChange={handleChangeCities} className="input__form__div__input" name="id_state" id="id_state">
          <option value="" key="" name="">
            -
          </option>
          {listStates.map((state) => (
            <option key={state.id_state} value={state.id_state} name={state.name_state}>
              {state.name_state}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="id_city">
          Ciudad
        </label>

        <select className="input__form__div__input" onChange={onChangeCityAddress} name="city_fk" id="id_city">
          <option value="" key="" name="">
            -
          </option>
          {listCities.map((city) => (
            <option key={city.id_city} value={city.id_city} name={city.city_fk}>
              {city.name_city}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="description_address">
          Dirección
        </label>

        <input
          placeholder="Dirección"
          onChange={onChangeCityAddress}
          className="input__form__div__input"
          type="text"
          name="description_address"
          id="description_address"
        />
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default AddressdataSection;
