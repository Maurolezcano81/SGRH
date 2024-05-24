import { Link } from "react-router-dom";

import { useState } from "react";

import preferences from "../../assets/Icons/Navbar/Preferences.svg";
const Preferences = (props) => {
  const handleDropdown = () => {
    if (!props.isDropdown) {
      props.closeDropdowns();
    }
    !props.isDropdown ? props.setIsDropdown(true) : props.setIsDropdown(false);
  };

  return (
    <div
      onClick={handleDropdown}
      className={`navbar__dropdown ${
        props.isDropdown ? "navbar__background-active" : ""
      }`}
    >
      <div className="navbar__content-redirect">
        <div className="navbar__content-redirect-img">
          <img src={preferences} alt="" />
        </div>
        <Link
          to="/admin/ajustes"
          className={props.isDropdown ? "navbar__dropdown-active" : ""}
        >
          Ajustes del sistema
        </Link>
      </div>
    </div>
  );
};

export default Preferences;
