// Breadcrumbs.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';

const Breadcrumbs = () => {
    const { breadcrumbs } = useBreadcrumbs();

    return (
        <div className='container__content'>
        <nav aria-label="breadcrumb__container">
            <ol className="breadcrumb__ol">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.url} className="breadcrumb__item">
                        {index === breadcrumbs.length - 1 ? (
                            <p>{breadcrumb.name}</p>
                        ) : (
                            <Link to={breadcrumb.url}>{breadcrumb.name}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>

        </div>
    );
};

export default Breadcrumbs;
