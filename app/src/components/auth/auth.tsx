import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import userDetails from '@/pages/api/userDetails';
import jwt from "jsonwebtoken";

type AuthContextType = {
    accessToken: string | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;

    setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BACKEND_URL = process.env.BACKEND_URL;

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // localStrageからアクセストークンを取得
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessTokenState(token);
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);

            //アクセストークンからユーザーIDを取得
            const decoded = jwt.decode(accessToken, { complete: true });
            console.log({ decoded });
            if (!decoded || typeof decoded === 'string') {
                throw new Error('JWTのデコードに失敗しました');
            }
            setUserId(decoded.payload?.user_id);

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
        <AuthContext.Provider value={{ accessToken, userId, userName, userEmail, setAccessToken, }}>
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
