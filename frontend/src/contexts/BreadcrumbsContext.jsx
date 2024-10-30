// BreadcrumbContext.js
import React, { createContext, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
    const [breadcrumbs, setBreadcrumbs] = useState([{}]);

    const updateBreadcrumbs = (newBreadcrumbs) => {
        setBreadcrumbs([{ name: 'Inicio', url: authData.home_page }, ...newBreadcrumbs]);
    };

    const {authData} = useAuth()

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, updateBreadcrumbs }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => useContext(BreadcrumbContext);
