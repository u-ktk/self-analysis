import React from 'react';
import { Answer } from '../../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


type AnswerProps = {
    isDefault: boolean;
    accessToken: string;
    questionId: number;
    title?: string;
    text1?: string;
    text2?: string;
    text3?: string;
    userId: string;
}

type fetchProps = AnswerProps;



const fetchAnswers = async (method: string, endpoint: string, props: fetchProps, body?: any) => {

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
            return responseData;
        } else {
            const errorData = await res.json();
            
        }

    } catch (error) {
        throw error;
    }

}

const getAnswers = async (props: AnswerProps): Promise<Answer[] | null> => {
    let endpoint: string;

    if (props.isDefault) {
        endpoint = `defaultquestions/${props.questionId}/answers/`;
    } else {
        endpoint = `customquestions/${props.questionId}/answers/`;
    }

    return fetchAnswers('GET', endpoint, props);
}


const createAnswer = async (props: AnswerProps): Promise<Answer | null> => {
    let endpoint: string;
    if (props.isDefault) {
        endpoint = `defaultquestions/${props.questionId}/answers/`;
    }
    else {
        endpoint = `customquestions/${props.questionId}/answers/`;
    }
    return fetchAnswers('POST', endpoint, props, JSON.stringify({
        question: props.questionId,
        user: props.userId,
        title: props.title,
        text1: props.text1,
        text2: props.text2,
        text3: props.text3,
    }));
}

const updateAnswer = async (props: AnswerProps, answerId: number): Promise<Answer | null> => {
    let endpoint: string;
    if (props.isDefault) {
        endpoint = `defaultquestions/${props.questionId}/answers/${answerId}/`;
    }
    else {
        endpoint = `customquestions/${props.questionId}/answers/${answerId}/`;
    }
    return fetchAnswers('PATCH', endpoint, props, JSON.stringify({
        title: props.title,
        text1: props.text1,
        text2: props.text2,
        text3: props.text3,
    }));
}

const deleteAnswer = async (props: AnswerProps, answerId: number): Promise<Answer | null> => {
    let endpoint: string;
    if (props.isDefault) {
        endpoint = `defaultquestions/${props.questionId}/answers/${answerId}/`;
    } else {
        endpoint = `customquestions/${props.questionId}/answers/${answerId}/`;
    }
    return fetchAnswers('DELETE', endpoint, props);
}

export { getAnswers, createAnswer, updateAnswer, deleteAnswer };