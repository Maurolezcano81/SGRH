import React, { useState, createContext } from 'react';

const NavbarContext = createContext();

const NavbarProvider = ({ children }) => {
    const [navbarTitle, setNavbarTitle] = useState("");

    const storageNavbarTitle = (title) => {
        setNavbarTitle(title);
    }

    return (
        <NavbarContext.Provider value={{ storageNavbarTitle, navbarTitle }}>
            {children}
        </NavbarContext.Provider>
    );
}

export { NavbarProvider };
export default NavbarContext;
