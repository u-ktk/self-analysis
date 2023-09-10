import React from 'react'
import { Question, Category } from "../../types";

type DefaultQuestionDetail = Question
type DefaultQuestions = Question[]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const fetchDefaultQuestions = async (accessToken: string): Promise<DefaultQuestions | null> => {
    try {
        const res = await fetch(`${BACKEND_URL}defaultquestions/`, {
            headers: {
                'Authorization': `JWT ${accessToken}`
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


const getDefaultQuestions = async (accessToken: string) => {
    const defaultQuestions = await fetchDefaultQuestions(accessToken);
    if (!defaultQuestions) {
        throw new Error("Failed to get default questions");
    }
    return defaultQuestions;

}


const getCategoryList = async (accessToken: string): Promise<string[] | null> => {
    try {
        const defaultQuestions = await fetchDefaultQuestions(accessToken);
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


