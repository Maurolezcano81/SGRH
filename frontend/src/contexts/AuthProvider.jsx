import {
    useState,
    useEffect,
    createContext
} from 'react';

import {
    useNavigate
} from 'react-router-dom'

import ErrorMessage from '../components/ErrorMessage';

const AuthContext = createContext();
const AuthProvider = ({ children }) => {

    const [authData, setAuthData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);

    const Navigate = useNavigate();

    useEffect(() => {
        const storedAuthData = localStorage.getItem('token');
        if (storedAuthData) {
            setAuthData(JSON.parse(storedAuthData));
        } else {
            Navigate('/login');
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