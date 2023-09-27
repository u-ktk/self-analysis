import React, { useState } from 'react'
import { User } from '../../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

type ChangeUserInfoProps = {
    accessToken: string;
    userId: string;
    newName?: string;
    newEmail?: string;
}

const changeUserInfo = async (props: ChangeUserInfoProps): Promise<User | null> => {
    const { newName, newEmail } = props;

    try {
        const res = await fetch(`${BACKEND_URL}users/${props.userId}/update/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${props.accessToken}`
            },
            body: JSON.stringify({ username: newName, email: newEmail }),
        });

        if (res.ok) {
            const responseData = await res.json();
            console.log(newName)
            console.log(responseData);
            return responseData;
        } else {
            throw new Error("Failed to fetch user info");
        }
    } catch (error) {
        throw error;
    }
}




export { changeUserInfo };