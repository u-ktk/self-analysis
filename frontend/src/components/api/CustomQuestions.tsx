import React from 'react'
import { Question } from "../../types";

type CustomQuestionDetail = Question
type CustomQuestions = Question[]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

type CustomQuestionDetailProps = {
    accessToken: string;
    userId: string;
    text?: string;
    age?: string;
    answers?: string[];
    folders?: string[];
}

type addFolderProps = {
    accessToken: string;
    userId: string;
    folders: number[];
    questionId: number;
}

type removeFolderProps = {
    accessToken: string;
    userId: string;
    folder: number;
    questionId: number;
}

type fetchProps = CustomQuestionDetailProps | addFolderProps | removeFolderProps;

const fetchCustomQuestions = async (method: string, endpoint: string, props: fetchProps, body?: any) => {
    try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${props.accessToken}`,
            },
            body: body,
        });
        if (res.headers.get("content-length") === "0" || res.status === 204) {
            return null;
        }
        if (res.ok) {
            const responseData = await res.json();
            // 
            return responseData;
        } else {
            const errorData = await res.json();
            
            if (errorData.text && errorData.age) throw new Error(`${errorData.text}, ${errorData.age}`)
            if (errorData.text) throw new Error(errorData.text);
            if (errorData.age) throw new Error(errorData.age);
            // if (errorData.detail) throw new Error(errorData.detail);

        }

    } catch (error) {
        throw error;
    }
}

const getCustomQuestions = async (props: CustomQuestionDetailProps): Promise<CustomQuestions | null> => {
    try {
        const searchParams = new URLSearchParams();
        searchParams.set('user', props.userId);
        searchParams.set('text__icontains', props.text || '');
        searchParams.set('age__icontains', props.age || '');

        const endpoint = `customquestions/?${searchParams}`
        const res = await fetchCustomQuestions('GET', endpoint, props);
        return res;
    } catch (error) {
        throw error;
    }

};


const getCustomQuestionDetail = async (props: CustomQuestionDetailProps, questionId: string): Promise<Question | null> => {
    try {
        const endpoint = `customquestions/${questionId}/`;
        const res = await fetchCustomQuestions('GET', endpoint, props);
        // 
        return res;
    } catch (error) {
        
        throw error;
    }
}


const createCustomQuestions = async (props: CustomQuestionDetailProps): Promise<Question | null> => {
    const endpoint = `customquestions/`;
    return fetchCustomQuestions('POST', endpoint, props, JSON.stringify({ text: props.text, age: props.age, answers: props.answers }));
}

const deleteCustomQuestion = async (props: CustomQuestionDetailProps, questionId: string) => {
    const endpoint = `customquestions/${questionId}/`;
    try {
        const res = await fetchCustomQuestions('DELETE', endpoint, props);
        return res;
    } catch (error) {
        throw error;
    }
}

const addCustomQToFolder = async (props: addFolderProps) => {
    const endpoint = `customquestions/${props.questionId}/add_folder/`;
    return fetchCustomQuestions('PATCH', endpoint, props, JSON.stringify({ folders: props.folders }));
}

const removeCustomQFromFolder = async (props: removeFolderProps) => {
    const endpoint = `customquestions/${props.questionId}/remove_folder/`;
    return fetchCustomQuestions('POST', endpoint, props, JSON.stringify({ folder: props.folder }));
}


export {
    getCustomQuestions,
    createCustomQuestions,
    deleteCustomQuestion,
    addCustomQToFolder,
    getCustomQuestionDetail,
    removeCustomQFromFolder
};