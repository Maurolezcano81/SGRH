import { Outlet, Link } from 'react-router-dom';

import { useState, useEffect } from 'react';
import LinkPreference from './LinkPreference';

const Preferences = () => {
  return (
    <div className="preferences__container">
      <div className="preferences__container__links">
        <LinkPreference path="ocupacion" name="Ocupacion" selected="ocupacion" />

        <LinkPreference path="sexo" name="Sexo" />

        <LinkPreference path="pais" name="Pais" />

        <LinkPreference path="contacto" name="Contacto" />

        <LinkPreference path="nacionalidad" name="Nacionalidad" />

        <LinkPreference path="estado_de_solicitud" name="Estado de solicitud" />

        <LinkPreference path="tipo_de_renuncia" name="Tipo de renuncia" />

        <LinkPreference path="modulo" name="Modulos" />
        
        <LinkPreference path="documento" name="Documentos" />

        <LinkPreference path="departamento" name="Departamentos" />
      </div>

      <main className="preferences__main">
        <Outlet />
      </main>
    </div>
  );
};

export default Preferences;
