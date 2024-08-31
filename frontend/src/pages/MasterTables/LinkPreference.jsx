import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LinkPreference = (props) => {
  const location = useLocation();

  const [linkActive, setLinkActive] = useState('');

  useEffect(() => {
    setLinkActive(location.pathname.split('/').pop());
  }, [location.pathname]);
  

  const handleClick = (link) => {
    setLinkActive(link);
  };

  return (
    <Link
      className={`preferences__links ${linkActive === props.path ? "preferences__links-active" : ""}`}

      to={props.path}
      onClick={() => handleClick(props.path)}
    >
      {props.name}
    </Link>
  );
};

export default LinkPreference;
