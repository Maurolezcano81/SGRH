import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ForwardButton = () => {
    const navigate = useNavigate();
    const [canGoForward, setCanGoForward] = useState(false);

    useEffect(() => {
        setCanGoForward(window.history.length > 1);

        const handlePopState = () => {
            setCanGoForward(window.history.length > 1);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleForward = () => {
        if (canGoForward) {
            navigate(1);
        }
    };

    return (
        <>
            {canGoForward > 0 && (
                <button className='button__back' onClick={handleForward} disabled={!canGoForward}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="4rem"
                        height="2rem"
                        viewBox="0 0 16 9">
                        <path d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5" />
                        <path d="M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z" />
                    </svg>
                    <span>Adelante</span>
                </button>
            )}
        </>

    );
};

export default ForwardButton;
