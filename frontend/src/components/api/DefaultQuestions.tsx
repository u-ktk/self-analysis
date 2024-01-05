import React, { useCallback } from 'react'
import { Question, Category } from "../../types";

type DefaultQuestions = Question[]
type Categories = Category[]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

type DefaultQuestionDetailListProps = {
    accessToken: string;
    text?: string;
    age?: string;
    limit?: string;
    offset?: string;
}

type addFolderProps = {
    accessToken: string;
    folders: number[];
    questionId: number;
}

type removeFolderProps = {
    accessToken: string;
    folder: number;
    questionId: number;
}


type fetchProps = DefaultQuestionDetailListProps | addFolderProps | removeFolderProps;





// フリーワードもしくは年代を指定して、defaultquestionsを取得する
const fetchDefaultQuestions = async (method: string, endpoint: string, props: fetchProps, body?: any) => {
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
            
            // エラーハンドリング後で詳しく
        }
    } catch (error) {
        throw error;
    }
}



const getDefaultQuestions = async (props: DefaultQuestionDetailListProps): Promise<DefaultQuestions | null> => {
    try {
        const searchParams = new URLSearchParams();
        searchParams.set('text__icontains', props.text || '');
        searchParams.set('age__icontains', props.age || '');
        searchParams.set('limit', props.limit || '1000');
        searchParams.set('offset', props.offset || '0');
        const endpoint = `defaultquestions/?${searchParams}`;
        const res = await fetchDefaultQuestions('GET', endpoint, props);
        return res.results;
    } catch (error) {
        
        throw error;
    }
}

const getDefaultQuestionDetail = async (props: DefaultQuestionDetailListProps, questionId: string): Promise<Question | null> => {
    try {
        const endpoint = `defaultquestions/${questionId}/`;
        const res = await fetchDefaultQuestions('GET', endpoint, props);
        return res;
    } catch (error) {
        
        throw error;
    }
}


const getCategoryOverView = async (accessToken: string): Promise<Categories | null> => {
    try {
        const endpoint = `categoryoverview/`;
        const res = await fetchDefaultQuestions('GET', endpoint, { accessToken });
        return res;
    }
    catch (error) {
        
        throw error;
    }

}

const addDefaultQToFolder = async (props: addFolderProps) => {
    const endpoint = `defaultquestions/${props.questionId}/add_folder/`;
    // 
    return fetchDefaultQuestions('PATCH', endpoint, props, JSON.stringify({ folders: props.folders }));
}

const removeDefaultQFromFolder = async (props: removeFolderProps) => {
    const endpoint = `defaultquestions/${props.questionId}/remove_folder/`;
    return fetchDefaultQuestions('POST', endpoint, props, JSON.stringify({ folder: props.folder }));
}


export {
    getDefaultQuestions,
    getCategoryOverView,
    getDefaultQuestionDetail,
    addDefaultQToFolder,
    removeDefaultQFromFolder
};