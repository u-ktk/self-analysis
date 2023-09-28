import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/auth/Auth';
import AnswerForm from '../../components/AnswerForm';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AnswerHistory = () => {
    let { id } = useParams<{ id: string }>();
    const { accessToken, userId } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const currentId = parseInt(id ? id : "1");
    if (!currentId || currentId < 1 || currentId > 1000) {
        return <div>ページが存在しません。</div>;
    }


    const onSubmit = async (data: {
        text: string,
        user: number,
        question: number,
    }) => {
        const { text } = data;
        const url = `${BACKEND_URL}defaultquestions/${currentId}/answers/`;
        console.log(url);
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ text, user: userId, question: currentId }),
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
            <AnswerForm onSubmit={onSubmit} errorMessage={errorMessage} />
        </div>
    )
}

export default AnswerHistory;
