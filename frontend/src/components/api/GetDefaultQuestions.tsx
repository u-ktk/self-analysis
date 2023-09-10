import React from 'react'
import { Question } from "../../types";

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

export default getDefaultQuestions;


    // const userDetails = async (userId: string, accessToken: string) => {

    //     if (!userId) {
    //         throw new Error("Failed to get user id");
    //     }
    //     const userDetails = await fetchUserDetails(userId, accessToken);
    //     if (!userDetails) {
    //         throw new Error("Failed to get user details");
    //     }
    //     const userEmail = userDetails.email;
    //     const userName = userDetails.username;
    //     return { userEmail, userName };
    // }
