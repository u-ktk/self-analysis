import React, { useState } from 'react';
import { useAuth } from '../../features/Auth/Token';
import { Answer, Question } from "../../types";
import { useNavigate, } from 'react-router-dom';
import CustomQuestionForm from '../../features/CreateQuestions/CreateQuestionForm';
import HeadTitle from '../../components/layouts/HeadTitle';
import NoLogin from '../../features/Auth/NoLogin';
import { addCustomQToFolder, createCustomQuestions } from '../../components/api/CustomQuestions';



type FormData = {
    text: string
    age?: string
    folders?: string[] | undefined;
    answers?: string[] | undefined;
}


const CreateQuestionsPage = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { accessToken, userId } = useAuth();
    const [customQuestions, setCustomQuestions] = useState<Question | null>(null);
    const [successMessage, setSuccessMessage] = useState<React.ReactNode | null>(null);
    const navigate = useNavigate();



    const onSubmit = async (data: FormData) => {
        const { text, age, answers, folders } = data;
        if (!accessToken || !userId) return;
        // console.log(folders)
        try {
            const res = await createCustomQuestions({ accessToken, userId, text, age, answers });
            if (res) {
                // console.log(res);
                setCustomQuestions(res);
                console.log(res)
                // setSuccessMessage(
                //     `${text}(${age})を作成しました`)
                setSuccessMessage(
                    <>
                        <a href={`/questions/custom/${userId}/${res.id}`}>{text}({age})</a>を作成しました
                    </>
                );

                window.scrollTo(0, 0);
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
                window.scrollTo(0, 0)
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

                    <CustomQuestionForm
                        accessToken={accessToken}
                        userId={userId}
                        onSubmit={onSubmit}
                        successMessage={successMessage}
                        errorMessage={errorMessage} />
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

export default CreateQuestionsPage