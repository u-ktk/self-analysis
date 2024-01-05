import React, { useState, useEffect } from 'react'
import QuestionDetail from './QuestionDetail';
import HeadTitle from '../../components/layouts/HeadTitle';
import { getDefaultQuestionDetail } from '../../components/api/DefaultQuestions';
import { useAuth } from '../../features/Auth/Token';
import { Question } from '../../types';
import { useParams } from 'react-router-dom';
import ShowMsg from '../../components/layouts/ShowMsg';

const DefaultQuestionDetail = () => {
    const { accessToken } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [question, setQuestion] = useState<Question | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const fetchDefaultQuestion = async () => {
        if (!accessToken || !id)
            return;
        const questionId = id;
        const res = await getDefaultQuestionDetail({ accessToken }, questionId);
        if (res) {
            setQuestion(res);
        }
        else {
            setErrorMessage('質問読み込みエラー');
        }
    }

    // 質問の取得
    useEffect(() => {
        if (!accessToken || !id) {
            
            return;
        }
        try {
            fetchDefaultQuestion();
        }
        catch (error) {
            
        }
    }, [accessToken]);

    return (
        <>
            <HeadTitle title={question?.text ? question.text : '質問の詳細'} />
            {(accessToken && id) ? (

                <>

                    {question && (
                        <QuestionDetail
                            isDefault={true}
                            question={question}
                            fetchQuestion={fetchDefaultQuestion}
                            errorMessage={errorMessage}
                        />
                    )}

                </>
            ) : (
                <div>
                    <ShowMsg message={'質問がありません'} isSuccess={false} />
                </div>
            )}
        </>
    )
}

export default DefaultQuestionDetail