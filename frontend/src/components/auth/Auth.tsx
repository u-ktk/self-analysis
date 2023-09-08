import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import userDetails from './UserDetail';
import jwtDecode from 'jwt-decode';

type AuthContextType = {
    accessToken: string | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    setAccessToken: (token: string | null) => void;
};

type DecodedAccessToken = {
    user_id: string;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessTokenState(token);
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);

            const decoded = jwtDecode<DecodedAccessToken>(accessToken); // <-- 変更
            console.log({ decoded });
            setUserId(decoded.user_id);

        } else {
            localStorage.removeItem('accessToken');
        }
    }, [accessToken]);

    useEffect(() => {
        async function fetchUserDetails() {
            if (userId && accessToken) {
                const details = await userDetails(userId, accessToken);
                setUserName(details.userName);
                setUserEmail(details.userEmail);
            }
        }
        fetchUserDetails();
    }, [userId]);

    const setAccessToken = (token: string | null) => {
        setAccessTokenState(token);
    };

    return (
        <AuthContext.Provider value={{ accessToken, userId, userName, userEmail, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('context must be used within a AuthProvider');
    }
    return context;
};
