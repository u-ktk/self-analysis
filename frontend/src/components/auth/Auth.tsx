import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import userDetails from './UserDetail';
import jwtDecode from 'jwt-decode';
import { User } from "../../types";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


type AuthContextType = {
    accessToken: string | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    setAccessToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
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
    const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // アクセストークン取得してlocalStorageに保存
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        if (token) {
            setAccessTokenState(token);
        }
        if (refresh) {
            setRefreshTokenState(refresh);
        }
    }, [accessToken, refreshToken]);



    useEffect(() => {
        if (accessToken) {
            // localStorage.setItem('accessToken', accessToken);
            const decoded = jwtDecode<DecodedAccessToken>(accessToken);
            setUserId(decoded.user_id);
            localStorage.setItem('userId', decoded.user_id);

        }
        // else {
        //     localStorage.removeItem('accessToken');
        // }
    }, [userId, accessToken]);

    useEffect(() => {

        async function fetchUserDetails() {
            const userId = localStorage.getItem('userId');
            try {
                const res = await fetch(`${BACKEND_URL}users/${userId}/`, {
                    headers: {
                        'Authorization': `JWT ${accessToken}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setUserName(data.username);
                    setUserEmail(data.email);
                } else if (res.status === 401 && refreshToken) {
                    const refreshed = await refreshAccessToken(refreshToken);
                    if (refreshed) {
                        const newAccessToken = refreshed.access;
                        setAccessTokenState(newAccessToken);
                        const newRes = await fetch(`${BACKEND_URL}users/${userId}/`, {
                            headers: {
                                'Authorization': `JWT ${newAccessToken}`
                            }
                        });
                        const newData = await newRes.json();
                        if (newRes.ok) {
                            setUserName(newData.username);
                            setUserEmail(newData.email);
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserDetails();
    }, [accessToken, refreshToken]);



    async function refreshAccessToken(refreshToken: string) {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: refreshToken })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('accessToken', data.access);
                setAccessTokenState(data.access);
                console.log('アクセストークンを更新しました')
                return data;
            } else {
                console.log(data);
                return null;
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    const setAccessToken = (token: string | null) => {
        setAccessTokenState(token);
    };

    const setRefreshToken = (token: string | null) => {
        setRefreshTokenState(token);
    }



    return (
        <AuthContext.Provider value={{ accessToken, userId, userName, userEmail, setAccessToken, setRefreshToken }}>
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
