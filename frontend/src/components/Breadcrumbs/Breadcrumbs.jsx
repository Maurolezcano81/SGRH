// Breadcrumbs.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';

const Breadcrumbs = () => {
    const { breadcrumbs } = useBreadcrumbs();

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.url} className="breadcrumb-item">
                        {index === breadcrumbs.length - 1 ? (
                            <span>{breadcrumb.name}</span>
                        ) : (
                            <Link to={breadcrumb.url}>{breadcrumb.name}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
