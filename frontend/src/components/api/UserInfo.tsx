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
            const errorData = await res.json();
            if (errorData.username) {
                throw new Error(errorData.username);
            }
            if (errorData.email) {
                throw new Error(errorData.email);
            }
            throw new Error("サーバーとの通信に失敗しました");
        }
    } catch (error) {
        throw error;
    }
}




export { changeUserInfo };
