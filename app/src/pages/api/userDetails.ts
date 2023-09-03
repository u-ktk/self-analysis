import { User } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL;

const fetchUserDetails = async (userId: string, accessToken: string): Promise<User | null> => {
    try {
        const res = await fetch(`${BACKEND_URL}users/${userId}/`, {
            headers: {
                'Authorization': `JWT ${accessToken}`
            }
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user details");
        }
        return res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const userDetails = async (userId: string, accessToken: string) => {

    if (!userId) {
        throw new Error("Failed to get user id");
    }
    const userDetails = await fetchUserDetails(userId, accessToken);
    if (!userDetails) {
        throw new Error("Failed to get user details");
    }
    const userEmail = userDetails.email;
    const userName = userDetails.username;
    return { userEmail, userName };
}

export default userDetails;
