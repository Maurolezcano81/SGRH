// BreadcrumbContext.js
import React, { createContext, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
    const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    const {authData} = useAuth()

    const updateBreadcrumbs = (newBreadcrumbs) => {
        setBreadcrumbs([{ name: 'Inicio', url: authData.home_page }, ...newBreadcrumbs]);
    };

    const resetBreadcrumbs = () => {
        setBreadcrumbs([{ name: 'Inicio', url: authData.home_page }]);
    };


    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, updateBreadcrumbs, resetBreadcrumbs }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => useContext(BreadcrumbContext);
