import React, { useState } from 'react';
import { useAuth } from '../components/auth/Auth';
import { Answer } from "../types";
import CustomQuestionForm from '../components/CustomQuestionForm';
import HeadTitle from '../components/layouts/HeadTitle';
import NoLogin from '../components/NoLogin';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


type FormData = {
    text: string
    age?: string
    folder?: string | undefined;
    answers?: Answer | undefined;
}


const CreateCustomQuestions = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { accessToken, userId } = useAuth();



    const onSubmit = async (data: FormData) => {
        const { text, age, answers, folder } = data;
        // postするurl確認
        const url = `${BACKEND_URL}customquestions/`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ text, age, answers, folder }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${accessToken}`
                }
            });
            if (res.ok) {
                const responseData = await res.json();
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
            {accessToken ? (
                <>

                    <HeadTitle title='質問を作る' />

                    <CustomQuestionForm onSubmit={onSubmit} errorMessage={errorMessage} />
                </>
            ) : (
                <NoLogin />
            )
            }
        </div>
    )

}

export default CreateCustomQuestions