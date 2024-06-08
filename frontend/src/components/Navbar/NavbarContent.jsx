import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import DropDownButton from './DropDownButton';

const NavbarContent = () => {
  const getParents = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/menu/parents`;

  const { authData } = useAuth();
  const [parentList, setParentList] = useState([]);

  useEffect(() => {
    const parentsFetch = async () => {
      const fetchResponse = await fetch(getParents, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
      });

      const parentData = await fetchResponse.json();
      setParentList(parentData.queryResponse);
    };

    parentsFetch();
  }, [authData.token]);

  return (
    <div className="navbar__content">
      {parentList &&
        parentList.map((parent) => (
          <DropDownButton
            key={parent.id_pm}
            id_pm={parent.id_pm}
            name_pm={parent.name_pm}
            authData={authData}
          />
        ))}
    </div>
  );
};

export default NavbarContent;
