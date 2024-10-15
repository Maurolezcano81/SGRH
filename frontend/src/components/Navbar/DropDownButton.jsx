import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DropDownButton = ({ id_pm, name_pm, authData }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [childrenList, setChildrenList] = useState([]);

  const getChildrens = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/menu/childrens`;

  const handleDropdownToggle = () => {
    setIsDropdown((prevState) => !prevState);
  };

  useEffect(() => {
    if (isDropdown) {
      const childrenFetch = async () => {
        try {
          const fetchResponse = await fetch(getChildrens, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authData.token}`,
            },
            body: JSON.stringify({
              id_pm: id_pm,
            }),
          });

          if (fetchResponse.ok) {
            const childrenData = await fetchResponse.json();
            setChildrenList(childrenData.queryResponse);
          } else {
            console.error('Failed to fetch children', fetchResponse.status);
          }
        } catch (error) {
          console.error('Error fetching children:', error);
        }
      };

      childrenFetch();
    }
  }, [isDropdown, authData.token, getChildrens, id_pm]);

  console.log(childrenList)

  return (
    <div onClick={handleDropdownToggle} className={`navbar__dropdown ${isDropdown ? 'navbar__background-active' : ''}`}>
      <div className="navbar__content-redirect">
        <p className={isDropdown ? 'navbar__dropdown-active' : ''}>{name_pm}</p>
      </div>
      {isDropdown && (
        <div className="navbar__content-dropdown">
          {childrenList.map((child) => (
            <Link key={child.id_module} to={child.url_module}>
              {child.name_module}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  
};

export default DropDownButton;
