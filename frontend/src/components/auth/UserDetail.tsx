import { User } from "../../types";
import { useAuth } from "./Auth";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const fetchUserDetails = async (userId: string, accessToken: string, refreshToken: string): Promise<User | null> => {

    try {
        const res = await fetch(`${BACKEND_URL}users/${userId}/`, {
            headers: {
                'Authorization': `JWT ${accessToken}`
            }
        });
        // if (!res.ok) {
        //     throw new Error("Failed to fetch user details");
        // }
        // return res.json();
        if (res.status === 401) {
            localStorage.removeItem('accessToken');
            refreshAccessToken(refreshToken);
        }
        const data = await res.json();
        if (res.ok) {
            return data;
        } else {
            console.log(data);
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

// リフレッシュトークンを使ってアクセストークンを更新する
async function refreshAccessToken(refreshToken: string) {
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
    } else {
        console.log(data);
    }
}

const userDetails = async (userId: string, accessToken: string, refreshToken: string) => {

    if (!userId) {
        throw new Error("Failed to get user id");
    }
    const userDetails = await fetchUserDetails(userId, accessToken, refreshToken);
    if (!userDetails) {
        throw new Error("Failed to get user details");
    }
    const userEmail = userDetails.email;
    const userName = userDetails.username;
    return { userEmail, userName };
}

export default userDetails;
