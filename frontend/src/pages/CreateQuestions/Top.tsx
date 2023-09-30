import React, { useState } from 'react';
import { useAuth } from '../../components/auth/Auth';
import { Answer, Question } from "../../types";
import CustomQuestionForm from '../../components/CreateQuestions/CustomQuestionForm';
import HeadTitle from '../../components/layouts/HeadTitle';
import NoLogin from '../../components/auth/NoLogin';
import CustomQuestionList from '../SearchQuestions/CustomQuestionList';
import { addCustomQToFolder, createCustomQuestions } from '../../components/api/CustomQuestions';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


type FormData = {
    text: string
    age?: string
    folders?: string[] | undefined;
    answers?: string[] | undefined;
}


const CreateCustomQuestions = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { accessToken, userId } = useAuth();
    const [customQuestions, setCustomQuestions] = useState<Question | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);



    const onSubmit = async (data: FormData) => {
        const { text, age, answers, folders } = data;
        if (!accessToken || !userId) return;
        // console.log(folders)
        try {
            const res = await createCustomQuestions({ accessToken, userId, text, age, answers });
            if (res) {
                // console.log(res);
                setCustomQuestions(res);
                setSuccessMessage(`${text}(${age})`);
                if (errorMessage) {
                    setErrorMessage(null);
                }


            }
            if (folders && res?.id) {
                addFolder((folders?.map((folder) => parseInt(folder))), res.id);

            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                if (successMessage) {
                    setSuccessMessage(null);
                }
            }
        }
    }

    const addFolder = async (folders: number[], questionId: number) => {

        if (!accessToken || !userId) return;
        try {
            const res = await addCustomQToFolder({ accessToken, userId, folders: folders, questionId });
            if (res) {
                // console.log(res);
                setCustomQuestions(res);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                // console.log(errorMessage);
            }
        }
    }


    return (
        <div>
            {accessToken ? (
                <>

                    <HeadTitle title='質問を作る' />

                    <CustomQuestionForm accessToken={accessToken} userId={userId} onSubmit={onSubmit} successMessage={successMessage} errorMessage={errorMessage} />
                    {/* <CustomQuestionList  /> */}
                    {/* {responseData ? (
                        
                    ) : ( */}
                </>
            ) : (
                <NoLogin />
            )
            }
        </div>
    )

}

export default CreateCustomQuestions