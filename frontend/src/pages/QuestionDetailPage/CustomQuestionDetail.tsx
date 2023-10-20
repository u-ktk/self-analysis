import React, { useEffect, useState } from 'react'
import QuestionDetail from './QuestionDetail';
import HeadTitle from '../../components/layouts/HeadTitle';
import { getCustomQuestionDetail } from '../../components/api/CustomQuestions';
import { useAuth } from '../../features/Auth/Token';
import { Question } from '../../types';
import { useParams } from 'react-router-dom';
import ShowMsg from '../../components/layouts/ShowMsg';

import styles from '../../components/styles/Common.module.css';

const CustomQuestionDetail = () => {
    const { accessToken, userId } = useAuth();
    const { questionId } = useParams<{ questionId: string }>();
    const { user } = useParams<{ user: string }>();
    const [question, setQuestion] = useState<Question | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // このメソッドは子コンポーネントからも呼び出される
    const fetchCustomQuestion = async () => {
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
            fetchCustomQuestion();
        }
        catch (error) {
            console.log(error);
        }

    }, [accessToken, userId]);

    return (
        <>
            <HeadTitle title={question?.text ? question.text : '質問の詳細'} />
            {(accessToken && user === userId) ? (

                <>
                    {question && (
                        <QuestionDetail
                            isDefault={false}
                            question={question}
                            fetchQuestion={fetchCustomQuestion}
                            errorMessage={errorMessage}
                        />
                    )}
                </>
            ) :
                // 他のユーザーの質問詳細ページにアクセスした場合
                <div className={styles.bg}>
                    <ShowMsg message={'アクセス権がありません'} isSuccess={false} />
                </div>
            }
        </>
    );
}


export default CustomQuestionDetail