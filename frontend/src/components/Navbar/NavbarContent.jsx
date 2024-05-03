import {
    Link
} from 'react-router-dom';

import {
    useState
} from 'react';

import PersonalDropDown from './PersonalDropDown';
import Analytics from './Analytics';


import request from '../../assets/Icons/Navbar/requests.png';
import questionnaire from '../../assets/Icons/Navbar/questionnaire.png';

const NavbarContent = () => {

    const [isAnalyticsDropdownOpen, setIsAnalyticsDropdownOpen] = useState(false);
    const [isPersonalDropdownOpen, setIsPersonalDropdownOpen] = useState(false);

    const closeDropdowns = () => {
        setIsAnalyticsDropdownOpen(false);
        setIsPersonalDropdownOpen(false);
    }

    return (
        <div className="navbar__content">
            <Analytics
                isDropdown={isAnalyticsDropdownOpen}
                setIsDropdown={setIsAnalyticsDropdownOpen}
                closeDropdowns={closeDropdowns}
            />
            <PersonalDropDown
                isDropdown={isPersonalDropdownOpen}
                setIsDropdown={setIsPersonalDropdownOpen}
                closeDropdowns={closeDropdowns}
            />
            <div className='navbar__content-redirect'>
                <div className="navbar__content-redirect-img">
                    <img src={request} alt="" />
                </div>
                <Link to="/admin/licencias">Solicitudes</Link>
            </div>
            <div className='navbar__content-redirect'>
                <div className="navbar__content-redirect-img">
                    <img src={questionnaire} alt="" />
                </div>
                <Link to="/admin/departamentos">Encuestas</Link>
            </div>
        </div>
    )
}

export default NavbarContent;