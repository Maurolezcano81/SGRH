import React from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';

const Breadcrumbs = () => {
    const { breadcrumbs } = useBreadcrumbs();

    return (
        <div className='container__content my-2'>
            <nav aria-label="breadcrumb__container">
                <ol className="breadcrumb__ol">
                    {breadcrumbs.map((breadcrumb, index) => (
                        <li key={breadcrumb.url} className="breadcrumb__item">
                            {index === 0 ? (

                                <>
                                    <div className='breadcrumb__home'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75" /></svg>
                                    </div>
                                    <Link to={breadcrumb.url}>
                                    
                                    {breadcrumb.name}</Link>
                                </>
                            )
                                :
                                index === breadcrumbs.length - 1 ? (
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
