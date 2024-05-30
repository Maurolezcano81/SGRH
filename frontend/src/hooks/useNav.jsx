import { useContext } from 'react';
import NavbarContext from '../contexts/NavbarProvider';

const useNav = () => {
    return useContext(NavbarContext);
}

export default useNav;
