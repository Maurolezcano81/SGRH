import {
    Link
} from 'react-router-dom';

import {
    useState
} from 'react';

import personal from '../../assets/Icons/Navbar/personal.png'
const PersonalDropDown = (props) => {
    const handleDropdown = () => {
        if (!props.isDropdown) {
            props.closeDropdowns();
        }
        !props.isDropdown ? props.setIsDropdown(true) : props.setIsDropdown(false);
    }

    return (
        <div onClick={handleDropdown} className={`navbar__dropdown ${props.isDropdown ? 'navbar__background-active' : ''}`}>
            <div className='navbar__content-redirect'>
                <div className="navbar__content-redirect-img">
                    <img src={personal} alt="" />
                </div>
                <p className={props.isDropdown ? 'navbar__dropdown-active' : ''}>Personal</p>
            </div>
            {props.isDropdown ? <div className="navbar__content-dropdown">
                <Link to="/admin/personal">Ver Personal</Link>
                <Link to="/admin/ajustes">Alta Personal</Link>
            </div> : null}
        </div>


    )
};

export default PersonalDropDown;