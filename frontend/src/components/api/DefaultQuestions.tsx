import React from 'react'
import { Question } from "../../types";

type DefaultQuestionDetail = Question
type DefaultQuestions = Question[]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

type DefaultQuestionDetailListProps = {
    accessToken: string;
    text?: string;
    age?: string;
}


// フリーワードもしくは年代を指定して、defaultquestionsを取得する
const fetchDefaultQuestions = async (props: DefaultQuestionDetailListProps): Promise<DefaultQuestions | null> => {
    try {
        const searchParams = new URLSearchParams();
        searchParams.set('text__icontains', props.text || '');
        searchParams.set('age__icontains', props.age || '');


        const res = await fetch(`${BACKEND_URL}defaultquestions/?${searchParams}`,
            {
                headers: {
                    'Authorization': `JWT ${props.accessToken}`
                }
            });
        if (!res.ok) {
            throw new Error("Failed to fetch default questions");
        }
        return res.json();
    } catch (error) {
        console.log(error);
        return [];
    }
}


const getDefaultQuestions = async (props: DefaultQuestionDetailListProps) => {
    const defaultQuestions = await fetchDefaultQuestions(props);
    if (!defaultQuestions) {
        throw new Error("Failed to get default questions");
    }
    return defaultQuestions;

}

// const FilterDefaultQuestions = async (accessToken: string, text: string) => {
//     const defaultQuestions = await fetchDefaultQuestions(accessToken);
//     if (!defaultQuestions) {
//         throw new Error("Failed to get default questions");
//     }
//     const filteredDefaultQuestions = defaultQuestions.filter(question => question.text === text);
//     return filteredDefaultQuestions;
// }



const getCategoryList = async (accessToken: string): Promise<string[] | null> => {
    try {
        const defaultQuestions = await fetchDefaultQuestions({ accessToken });
        if (!defaultQuestions) {
            throw new Error("Failed to get default questions");
        }

        const categorySet = new Set(defaultQuestions.map(question => question.category_name));
        return Array.from(categorySet);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export { getDefaultQuestions, getCategoryList };


