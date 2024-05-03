import {
    useState,
    useEffect,
    createContext
} from 'react';

const AuthContext = createContext();
const AuthProvider = ({ children }) => {

    const [authData, setAuthData] = useState({});

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