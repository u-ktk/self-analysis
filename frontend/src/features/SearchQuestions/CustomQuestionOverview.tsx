import React, { useState, useEffect } from 'react'
import { Question } from "../../types";
import { getCustomQuestions } from '../api/CustomQuestions';
import { useAuth } from '../Auth/Token';
import { Alert } from 'react-bootstrap';

import styles from '../styles/Common.module.css';
import detailStyles from '../styles/QuestionDetail.module.css';
import formStyles from '../styles/Form.module.css';

import error from '../../images/icon/error.svg';
import checkMark from '../../images/checked.png';


const CustomQuestionOverview = () => {
    const { accessToken, userId } = useAuth();
    const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
    const [reverseQuestions, setReverseQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // カスタム質問を取得
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getCustomQuestions({ accessToken, userId });
                if (res) {
                    console.log(res)
                    setCustomQuestions(res);
                    setReverseQuestions(res.reverse().slice(0, 5));
                    setLoading(false);
                }
            } catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [accessToken, userId])


    return (
        <>
            <div className={styles.bg}>
                <h4 className={styles.title}>作成した質問から選ぶ</h4>

                <div className={styles.contents}>

                    {/*  質問がない時 */}
                    {(!customQuestions || customQuestions.length === 0) ? (
                        <Alert className={formStyles.alert}>
                            <span>
                                <img alt="エラー" src={error} width="40" height="40"></img>
                            </span>
                            <div>
                                <strong className="m-2">質問がありません</strong>
                            </div>
                            <div className={detailStyles.noQuestion}>「質問を作る」メニューから作成できます。</div>
                        </Alert>

                    ) : (
                        // 質問がある時
                        <>
                            {reverseQuestions.map((question, index) => (
                                <div key={question.id}>
                                    {/* {(index === 0
                                        || new Date(question.created_at).getMonth() !== new Date(reverseQuestions[index - 1].created_at).getMonth()
                                        || new Date(question.created_at).getFullYear() !== new Date(reverseQuestions[index - 1].created_at).getFullYear()) &&
                                        <div className={detailStyles.category}>
                                            {new Date(question.created_at).getFullYear()}年{new Date(question.created_at).getMonth() + 1}月

                                            (question.created_at)
                                        </div>
                                    } */}

                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className={detailStyles.id}>・</td>
                                                <td className={detailStyles.text}>
                                                    <a href={`/questions/custom/${userId}/${question.id}`} className={detailStyles.link}>
                                                        {question.text} ({question.age})
                                                    </a>
                                                    {(question.answers[0]) && (
                                                        <img src={checkMark} alt='回答済' className={detailStyles.check} />
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>


                                </div>


                            ))}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                <a href={`/questions-list/custom/`} className={styles.link}>&#62;&#62; もっと見る</a>
                            </div>

                        </>
                    )}


                </div>
            </div >
        </>
    )
}

export default CustomQuestionOverview