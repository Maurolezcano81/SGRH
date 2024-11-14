import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import DropDownButton from './DropDownButton';
import useNav from '../../hooks/useNav';
import { Link } from 'react-router-dom';
const NavbarContent = ({toggleNavbar}) => {
  const getParents = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.END_MENUPARENTS}`;

  const { authData } = useAuth();
  const { navbarRefresh } = useNav()
  const [parentList, setParentList] = useState([]);
  const [isSupervisor, setIsSupervisor] = useState(false);


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
        setIsSupervisor(parentData.isSupervisorEp)
      };

      parentsFetch();
    }
  }, [authData, navbarRefresh]);


  const [isDropdown, setIsDropdown] = useState(false);
  const handleDropdownToggle = () => {
    setIsDropdown((prevState) => !prevState);
  };

  return (
    <div className="navbar__content">
      {parentList.length > 0 ? (
        parentList.map((parent) => (
          <DropDownButton
            key={parent.id_pm}
            id_pm={parent.id_pm}
            name_pm={parent.name_pm}
            authData={authData}
            toggleNavbar={toggleNavbar}
          />
        ))
      ) : (
        <p>No data available</p>
      )}

      {isSupervisor && (
        <div onClick={handleDropdownToggle} className={`navbar__dropdown ${isDropdown ? 'navbar__background-active' : ''}`}>
          <div className="navbar__content-redirect">
            <p className={isDropdown ? 'navbar__dropdown-active' : ''}>Supervisor de Cuestionarios</p>
          </div>
          {isDropdown && (
            <div className="navbar__content-dropdown">
              <Link onClick={toggleNavbar} to='/supervisor/rendimiento'>
                Responder Cuestionarios
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarContent;
