import React, { useEffect, useState } from 'react'
import QuestionDetail from './QuestionDetail';
import HeadTitle from '../../components/layouts/HeadTitle';
import { getCustomQuestionDetail } from '../../components/api/CustomQuestions';
import { useAuth } from '../../features/Auth/Token';
import { Question } from '../../types';
import { useParams } from 'react-router-dom';

const CustomQuestionDetail = () => {
    const { accessToken, userId } = useAuth();
    const { questionId } = useParams<{ questionId: string }>();
    const [question, setQuestion] = useState<Question | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // このメソッドは子コンポーネントからも呼び出される
    const fetchQuestion = async () => {
        if (!accessToken || !userId || !questionId) return;
        const res = await getCustomQuestionDetail({ accessToken, userId }, questionId);
        if (res) {
            setQuestion(res);
        }
        else {
            setErrorMessage('質問読み込みエラー');
        }
    }

    // 質問の取得
    useEffect(() => {
        if (!accessToken || !userId || !questionId) {
            console.log('no accessToken or userId or questionId')
            return;
        }
        try {
            fetchQuestion();
        }
        catch (error) {
            console.log(error);
        }

    }, [accessToken, userId]);

    return (
        <>
            <HeadTitle title="質問の詳細" />
            {accessToken ? (

                <>
                    {question && (
                        <QuestionDetail
                            isDefault={false}
                            question={question}
                            fetchQuestion={fetchQuestion}
                            errorMessage={errorMessage}
                        />
                    )}
                </>
            ) : null}
        </>
    );
}


export default CustomQuestionDetail