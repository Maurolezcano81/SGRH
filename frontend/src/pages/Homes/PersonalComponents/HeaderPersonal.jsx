import React, { useEffect, useRef, useState } from "react";

const HeaderPersonal = ({ authData }) => {
  const timeRef = useRef(new Date());
  const [_, setForceRender] = useState(false);

  const user = {
    firstName: authData.name_entity,
    lastName: authData.lastname_entity,
    status: authData.name_tse,
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      timeRef.current = new Date(); 
      setForceRender(prev => !prev);
    }, 1000);

    return () => clearInterval(intervalId); 
  }, []);

  const formattedDate = timeRef.current.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = timeRef.current.toLocaleTimeString("es-ES");

  return (
    <div className="home__header">
      <div className="home__header__clock">
        <div>{formattedDate}</div>
        <p className="">{formattedTime}</p>
      </div>
      <div className="home__header__name__container">
        <div className="home__header__name">
          <span>¡Bienvenido/a! </span>
          {user.firstName} {user.lastName}
        </div>
      </div>
    </div>
  );
};

export default HeaderPersonal;
