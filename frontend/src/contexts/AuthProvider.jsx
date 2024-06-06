import {
    useState,
    useEffect,
    createContext
} from 'react';

import {
    useNavigate
} from 'react-router-dom'

import ALertError from '../components/Alerts/AlertError';

const AuthContext = createContext();
const AuthProvider = ({ children }) => {

    const [authData, setAuthData] = useState({});

    const Navigate = useNavigate();

    useEffect(() => {
        const storedAuthData = localStorage.getItem('token');
        if (storedAuthData) {
            setAuthData(JSON.parse(storedAuthData));
        }
    }, []);

    const storageAuthData = (authData) => {
        setAuthData(authData);
    }

    const deleteAuthData = () => {
        setAuthData(null);
    }

    return (
        <AuthContext.Provider
            value={{
                authData,
                storageAuthData,
                deleteAuthData
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;