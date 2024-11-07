import { Outlet, Link } from 'react-router-dom';

import { useState, useEffect } from 'react';
import LinkPreference from './LinkPreference';

const Preferences = () => {
  return (
    <div className='container__content'>
        <div className="preferences__container__links">
          <LinkPreference path="ocupacion" name="Ocupacion" selected="ocupacion" />

          <LinkPreference path="sexo" name="Sexo" />

          <LinkPreference path="pais" name="Pais" />

          <LinkPreference path="contacto" name="Contacto" />

          <LinkPreference path="nacionalidad" name="Nacionalidad" />

          <LinkPreference path="tipo_estado_solicitud" name="Estado de solicitud" />

          <LinkPreference path="tipo_renuncia" name="Tipo de renuncia" />

          <LinkPreference path="modulo" name="Modulos" />

          <LinkPreference path="documento" name="Documentos" />

          <LinkPreference path="departamento" name="Departamentos" />

          <LinkPreference path="tipo_anexo" name="Tipos de Anexos" />

          <LinkPreference path="tipo_asunto_mensaje" name="Tipos de Asuntos de Mensajes" />

          <LinkPreference path="tipo_licencia" name="Tipos de Licencia" />

          <LinkPreference path="menu_navegacion" name="Menues de Navegación" />

          <LinkPreference path="estado_empleado" name="Tipos de Estados de Empleado" />




      </div>

      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Preferences;
