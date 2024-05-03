import {
    Link
} from 'react-router-dom';

import {
    useState
} from 'react';

import analytics from '../../assets/Icons/Navbar/analytics.png'
const Analytics = (props) => {

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
                    <img src={analytics} alt="" />
                </div>
                <Link to="#" className={props.isDropdown ? 'navbar__dropdown-active' : ''}>Estadisticas</Link>
            </div>
        </div>


    )
};

export default Analytics;