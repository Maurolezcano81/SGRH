import { Outlet, Link} from 'react-router-dom';

import { useState, useEffect } from 'react';
import LinkPreference from './LinkPreference';

const Preferences = () => {

  return (
    <div className="preferences__container">
      <h4 className="title__module">Ajustes del sistema</h4>

      <div className="preferences__container__links">
        <LinkPreference
            path="ocupacion"
            name="Ocupacion"
            selected="ocupacion"
        />
        <LinkPreference
            path="sexo"
            name="Sexo"
        />
        <LinkPreference
            path="contacto"
            name="Contacto"
        />
      </div>

      <main className="preferences__main">
        <Outlet />
      </main>
    </div>
  );
};

export default Preferences;
