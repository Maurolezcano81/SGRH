import React, { useState, createContext } from 'react';

const NavbarContext = createContext();

const NavbarProvider = ({ children }) => {
    const [navbarTitle, setNavbarTitle] = useState("");
    const [navbarRefresh, setNavbarRefresh] = useState(false);

    const storageNavbarTitle = (title) => {
        setNavbarTitle(title);
    }

    const canRefresh = () => {
        setNavbarRefresh(!navbarRefresh)
    }

    return (
        <NavbarContext.Provider value={{ storageNavbarTitle, navbarTitle,navbarRefresh, canRefresh }}>
            {children}
        </NavbarContext.Provider>
    );
}

export { NavbarProvider };
export default NavbarContext;
