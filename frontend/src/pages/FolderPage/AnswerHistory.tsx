import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../features/Auth/Token';
import AnswerForm from '../../features/Answer/AnswerForm';

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
        title: string,
        text1: string | null,
        text2: string | null,
        text3: string | null,
        user: string,
        question: number,
    }) => {
        const url = `${BACKEND_URL}defaultquestions/${currentId}/answers/`;
        console.log(url);
        console.log(data)
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ ...data, user: userId, question: currentId }),
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
            {/* <AnswerForm onSubmit={onSubmit} errorMessage={errorMessage} /> */}
        </div>
    )
}

export default AnswerHistory;
