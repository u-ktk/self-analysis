import React, { useState } from 'react';
import { useAuth } from '../components/auth/Auth';
import { Answer } from "../types";
import CustomQuestionForm from '../components/CustomQuestionForm';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


type FormData = {
    text: string
    age?: string
    answers?: Answer | undefined;
    category?: string | undefined;
    // created_at: string;
    created_at: Date;
}


const CreateCustomQuestions = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { accessToken, userId } = useAuth();



    const onSubmit = async (data: FormData) => {
        const { text, age, answers, category, created_at } = data;
        // postするurl確認
        const url = `${BACKEND_URL}customquestions/`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ text, age, answers, category, created_at }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${accessToken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData)
            }

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                console.log(errorMessage);
            }

        }
    }

    return (
        <div>
            <CustomQuestionForm onSubmit={onSubmit} errorMessage={errorMessage} />
        </div>
    )

}

export default CreateCustomQuestions