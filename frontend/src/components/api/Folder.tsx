import React from 'react';
import { Folder } from '../../types';

type Folders = Folder[];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

type ApiProps = {
    accessToken: string;
    userId: string;
    name?: string;

};

const fetchData = async (endpoint: string, props: ApiProps) => {
    try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${props.accessToken}`,
            },
        });
        if (res.ok) {
            const responseData = await res.json();
            console.log(responseData);
            return responseData;
        } else {
            throw new Error(`Failed to fetch data from ${endpoint}`);
        }
    } catch (error) {
        throw error;
    }
};

const getFolderList = async (props: ApiProps): Promise<Folders | null> => {
    const endpoint = `folders/?user=${props.userId}`;
    return fetchData(endpoint, props);
};

const getFolderDetail = async (props: ApiProps, name: string): Promise<Folder | null> => {
    const endpoint = `folders/?user=${props.userId}&name=${name}`;
    return fetchData(endpoint, props);
};

const createFolder = async (props: ApiProps, newFolderName: string): Promise<Folders | null> => {
    const endpoint = `folders/?user=${props.userId}`;
    try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${props.accessToken}`,
            },
            body: JSON.stringify({ name: newFolderName }),
        });
        if (res.ok) {
            const responseData = await res.json();
            console.log(responseData);
            return responseData;
        } else {
            throw new Error('Failed to create folder');
        }
    } catch (error) {
        throw error;
    }
};

export { getFolderList, getFolderDetail, createFolder };
