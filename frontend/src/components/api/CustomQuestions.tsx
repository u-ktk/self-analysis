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

const fetchCustomQuestions = async (method: string, endpoint: string, props: CustomQuestionDetailProps | addFolderProps, body?: any) => {
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
            console.log(responseData);
            return responseData;
        } else {
            const errorData = await res.json();
            console.error("Server Response:", errorData);
            if (errorData.text && errorData.age) throw new Error(`${errorData.text}, ${errorData.age}`)
            if (errorData.text) throw new Error(errorData.text);
            if (errorData.age) throw new Error(errorData.age);
            // let errorMsg = [];
            // if (errorData.text) errorMsg.push(errorData.text);
            // if (errorData.age) errorMsg.push(errorData.age);
            // throw errorMsg;



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

const createCustomQuestions = async (props: CustomQuestionDetailProps): Promise<Question | null> => {
    const endpoint = `customquestions/`;
    return fetchCustomQuestions('POST', endpoint, props, JSON.stringify({ text: props.text, age: props.age, answers: props.answers }));
}

const addFolderToCustomQuestion = async (props: addFolderProps) => {
    const endpoint = `customquestions/${props.questionId}/add_folder/`;
    return fetchCustomQuestions('PATCH', endpoint, props, JSON.stringify({ folders: props.folders }));
}



// // フリーワードもしくは年代を指定して、questionsを取得する
// const fetchCustomQuestions = async (method: string, props: CustomQuestionDetailListProps, body?: any): Promise<CustomQuestions | null> => {
//     try {
//         const searchParams = new URLSearchParams();
//         searchParams.set('user', props.userId);
//         searchParams.set('text__icontains', props.text || '');
//         searchParams.set('age__icontains', props.age || '');

//         const res = await fetch(`${BACKEND_URL}customquestions/?${searchParams}`,
//             {
//                 headers: {
//                     'Authorization': `JWT ${props.accessToken}`
//                 }
//             });
//         if (!res.ok) {
//             throw new Error("Failed to fetch default questions");
//         }
//         return res.json();
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
// }


// const getCustomQuestions = async (props: CustomQuestionDetailListProps) => {
//     const customQuestions = await fetchCustomQuestions(props);
//     if (!customQuestions) {
//         throw new Error("Failed to get default questions");
//     }
//     return customQuestions;

// }


export { getCustomQuestions, createCustomQuestions, addFolderToCustomQuestion };


