// BreadcrumbContext.js
import React, { createContext, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
    const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    const {authData} = useAuth()
    console.log(authData.home_page)


    const updateBreadcrumbs = (newBreadcrumbs) => {
        setBreadcrumbs([{ name: 'Inicio', url: authData.home_page }, ...newBreadcrumbs]);
    };


    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, updateBreadcrumbs }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => useContext(BreadcrumbContext);
