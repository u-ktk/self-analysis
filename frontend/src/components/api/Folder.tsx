import React from 'react';
import { Folder } from '../../types';

type Folders = Folder[];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

type ApiProps = {
    accessToken: string;
    userId: string;
    name?: string;

};

const fetchData = async (method: string, endpoint: string, props: ApiProps, body?: any) => {
    try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${props.accessToken}`,
            },
            body: body,
        });
        if (res.status === 204) {
            return null;
        }
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
    return fetchData('GET', endpoint, props);
};

const getFolderDetail = async (props: ApiProps, name: string): Promise<Folders | null> => {
    const endpoint = `folders/?user=${props.userId}&name=${name}`;
    return fetchData('GET', endpoint, props);
};

const createFolder = async (props: ApiProps, newFolderName: string): Promise<Folder | null> => {
    const endpoint = `folders/`;
    return fetchData('POST', endpoint, props, JSON.stringify({ name: newFolderName, user: props.userId, }));
}

const deleteFolder = async (props: ApiProps, folderId: string) => {
    const endpoint = `folders/${folderId}/`;
    try {
        const res = await fetchData('DELETE', endpoint, props);
        return res;
    } catch (error) {
        throw error;
    }
}




export { getFolderList, getFolderDetail, createFolder, deleteFolder };
