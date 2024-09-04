import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import DropDownButton from './DropDownButton';
import useNav from '../../hooks/useNav';

const NavbarContent = () => {
  const getParents = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.END_MENUPARENTS}`;

  const { authData } = useAuth();
  const { navbarRefresh } = useNav()
  const [parentList, setParentList] = useState([]);

  const token = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
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
    }
  }, [authData, navbarRefresh]);

  return (
    <div className="navbar__content">
      {parentList.length > 0 ? (
        parentList.map((parent) => (
          <DropDownButton
            key={parent.id_pm}
            id_pm={parent.id_pm}
            name_pm={parent.name_pm}
            authData={authData}
          />
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default NavbarContent;
