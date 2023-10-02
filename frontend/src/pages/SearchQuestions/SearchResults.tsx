import React, { useEffect, useState } from 'react';
import { Question } from '../../types';
import { useLocation } from 'react-router-dom';
import { getDefaultQuestions } from '../../components/api/DefaultQuestions';
import { getCustomQuestions } from '../../components/api/CustomQuestions';
import { useAuth } from '../../components/auth/Auth';
import { Table, Alert } from 'react-bootstrap';
import HeadTitle from '../../components/layouts/HeadTitle';

import styles from '../../components/styles/Common.module.css';
import loadStyles from '../../components/styles/Loading.module.css';
import detailStyles from '../../components/styles/QuestionDetail.module.css';
import formStyles from '../../components/styles/Form.module.css';

import error from '../../images/icon/error.svg';


const SearchResults = () => {
    const location = useLocation();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const searchParams = new URLSearchParams(location.search);
    const textContains = searchParams.get('text');
    const ageContains = searchParams.get('age');
    const { accessToken, userId } = useAuth();



    const fetchData = async () => {
        if (!accessToken || !userId || (!textContains && !ageContains)) {
            console.log('検索結果を取得できませんでした');
            return;
        }

        try {
            let defaultResults: Question[] | null;
            let customResults: Question[] | null;
            let res: Question[] = [];
            if (textContains) {
                defaultResults = await getDefaultQuestions({ accessToken, text: textContains });
                customResults = await getCustomQuestions({ accessToken, text: textContains, userId });
            } else if (ageContains) {
                defaultResults = await getDefaultQuestions({ accessToken, age: ageContains });
                customResults = await getCustomQuestions({ accessToken, age: ageContains, userId });
            }
            res = defaultResults!.concat(customResults!);
            if (res && res.length === 0) {
                setErrorMessage('検索結果がありませんでした');
            } else if (res) {
                setQuestions(res);
                console.log(res);
            }


        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [accessToken, textContains, ageContains]);



    return (
        <>
            <HeadTitle title='検索結果' />


            <div className={styles.bg}>
                {/* ローディング */}
                {!accessToken && (
                    <div className={loadStyles.loading}>
                        <span className={loadStyles.text}>Loading...</span>
                    </div>
                )}



                {(textContains || ageContains) && (
                    <div>
                        <div className={`${styles.menu} mb-4 `}>
                            <a href='/review-questions' className={styles.link}>質問を検索 </a>
                            <span> &#62; </span>
                            <span style={{ fontWeight: 'bold' }}>
                                {textContains && <span>フリーワードから選ぶ：{textContains}</span>}
                                {ageContains && <span>年代から選ぶ：{ageContains}</span>}
                            </span>
                        </div>

                        <div className={detailStyles.contents}>

                            {/* 検索結果なしの場合エラーメッセージ */}
                            {!questions.length ? (
                                <>
                                    {errorMessage &&
                                        <Alert className={formStyles.alert}>
                                            <span>
                                                <img alt="エラー" src={error} width="40" height="40"></img>
                                            </span>
                                            <div className={formStyles.msg}>

                                                {errorMessage}
                                            </div>
                                        </Alert>}
                                </>
                            ) : (

                                // 検索結果ありの場合
                                <div>
                                    {questions.map((question: Question, index: number) => (
                                        <div key={question.id}>
                                            {(question.category_name && index === 0) || (index > 0 && questions[index - 1] && question.category_name !== questions[index - 1].category_name) ? (
                                                <div className={detailStyles.category}>{question.category_name}</div>
                                            ) : null}

                                            {/* [自分で作成した質問]も初回のみ表示 */}
                                            {index > 0 && question.category_name == null && questions[index - 1].category_name !== null ? (
                                                <div className={detailStyles.category}>自分で作成した質問</div>
                                            ) : null}

                                            {/* デフォルト質問なら質問の番号表示、カスタム質問ならメモアイコン追加 */}
                                            <table className={detailStyles.questionGroup}>
                                                <tbody >
                                                    <tr>
                                                        {question.category_name ? (
                                                            <td className={detailStyles.id}>{question.id}.</td>
                                                        ) : (
                                                            <td className={detailStyles.id}>
                                                                {/* <img src={noteIcon} alt='memo' className={detailStyles.icon} width="20" height="20" /> */}
                                                                ・
                                                            </td>
                                                        )}
                                                        <td className={detailStyles.text}>
                                                            <a href={`/questions/detail/?id=${question.id}`} className={detailStyles.link}>{question.text}
                                                                ({question.age})
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    ))}
                                </div>
                            )}


                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchResults;
