import React, { useState, useEffect, useRef } from 'react';
import { Question, Folder } from "../../types";
import { getDefaultQuestions, getDefaultQuestionDetail, addDefaultQToFolder } from '../../components/api/DefaultQuestions';
import AddQuestionToFolder from '../../features/SearchQuestions/AddQustionToFolder';
import { allCount } from '../../components/function/CountAnswer';
import { useAuth } from '../../features/Auth/Token';
import { useParams, useNavigate } from 'react-router-dom';
import HeadTitle from '../../components/layouts/HeadTitle';

import loadStyles from '../../components/styles/Loading.module.css';
import listStyles from '../../components/styles/List.module.css';
import styles from '../../components/styles/Common.module.css';
import detailStyles from '../../components/styles/QuestionDetail.module.css';

import newFolder from '../../images/icon/newFolder.svg';
import plus from '../../images/icon/plus.svg';
import minus from '../../images/icon/minus.svg';
import checkMark from '../../images/checked.png';
import { ProgressBar } from 'react-bootstrap';



const DefaultQuestionsList = () => {
    const { accessToken, userId } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentCategory, setCurrentCategory] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    let { page } = useParams<string>();

    const [showToast, setShowToast] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectQuestion, setSelectQuestion] = useState<Question>();
    // アコーディオンメニューの開閉
    const [openAge, setOpenAge] = useState<string | null>(null);
    const currentPage = parseInt(page ? page : "1");
    const navigate = useNavigate();

    type AgeCount = { [key: string]: number };


    const toggleAccordion = (age: string) => {
        if (openAge === age) {
            setOpenAge(null);
        } else {
            setOpenAge(age);
        }
    };



    // トーストメニューを開く
    const toggleToast = (e: React.MouseEvent, questionId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        setPosition({ x, y });
        setSelectQuestion(questions.find(q => q.id === questionId));
        setShowToast(true);

    }

    const getToastPostion = (x: number, y: number) => {
        const scrollY = window.scrollY
        const adjustedY = scrollY + y;

        const leftStyle = window.innerWidth < 980 ? `${x - 150}px` : `${x + 50}px`;

        let topStyle;
        if (adjustedY - 100 < 0) {
            topStyle = `${adjustedY + 100}px`;
        } else if (adjustedY - 100 >= 0 && adjustedY + 100 < window.innerHeight) {
            topStyle = `${adjustedY - 100}px`;
        } else {
            topStyle = `${adjustedY - 100}px`;
        }

        return {
            left: leftStyle,
            top: topStyle,
            transform: 'none'
        };
    };
    const toastStyle = getToastPostion(position.x, position.y);




    // デフォルト質問を取得
    const fetchDefaultQuestionsAll = async () => {
        setLoading(true);
        if (!accessToken) return;
        try {
            const res = await getDefaultQuestions({ accessToken, limit: '100', offset: ((currentPage - 1) * 100).toString() });
            if (res) {
                setQuestions(res);
                // console.log(res)
                if (res[0])
                    setCurrentCategory(res[0].category_name);
                else {
                    setCurrentCategory("No category");
                }
                setLoading(false);
            }
        } catch
        (err: any) {
            console.log(err.message)
            setErrorMessage(err.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDefaultQuestionsAll();
    }
        , [accessToken, page]);


    // 特定の質問だけを取得（フォルダ更新時に再レンダリングするため）
    const fetchDefaultQuestionDetail = async (questionId: number) => {
        if (!accessToken || !questionId) return;
        try {
            const res = await getDefaultQuestionDetail({ accessToken }, questionId.toString());
            if (res) {
                setQuestions(prevQuestions => {
                    const newQuestions = [...prevQuestions];
                    newQuestions[questionId - 1] = res;
                    // 質問に紐づくフォルダがすぐに更新されないので、ここで更新
                    setSelectQuestion(res);
                    return newQuestions;
                });
            }
        }
        catch (err: any) {
            console.log(err.message);
            setErrorMessage(err.message);
        }
    }

    // 年代ごとのカウント
    const groupQuestionsByAge = (questions: Question[]): AgeCount =>
        questions.reduce((accum, question) => {
            accum[question.age] = (accum[question.age] || 0) + 1;
            return accum;
        }, {} as AgeCount);


    const ageCounts: { [key: string]: number } = groupQuestionsByAge(questions);


    // 回答済みの質問数を取得
    const answerdAgeCounts = (question: Question) => {
        const getAnsweredAgeCounts: { [key: string]: number } = groupQuestionsByAge(
            questions.filter((question) => question.answers[0])
        );
        const questionAge = question.age;
        const count = getAnsweredAgeCounts[questionAge] ? getAnsweredAgeCounts[questionAge] : 0;
        return count;
    };

    // 回答済質問の割合を取得
    const getAnsweredAgeRatio = (question: Question) => {
        const answeredAgeCounts = answerdAgeCounts(question);
        const ageCount = ageCounts[question.age];
        const ratio = answeredAgeCounts / ageCount * 100;
        return Math.round(ratio);
    }


    // 画面サイズが変更されたら再描画
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);



    return (
        <>
            <HeadTitle title={currentCategory} />

            {accessToken ? (
                <div className={styles.bg}>
                    {loading ? (
                        <div className={loadStyles.loading}>
                            <div className={loadStyles.text}>loading...</div>
                        </div>
                    ) : (
                        <>
                            {/* 見出し */}
                            <div className={`${listStyles.menu} mb-4 `}>
                                <div>
                                    <a href='/questions-list' className={styles.link}>用意された質問から選ぶ </a>
                                    <span> &#62; </span>
                                    <span style={{ fontSize: '120%' }}>レベル{currentPage}&nbsp;&nbsp;</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '120%' }}>{currentCategory}</span>
                                </div>
                            </div>
                            <div className={listStyles.progressBarWrapper}>
                                <ProgressBar now={allCount(questions, currentPage)}
                                    className={listStyles.progress}
                                    variant='secondary'
                                />
                                <span className={listStyles.progressBarLabel}>{`${allCount(questions, currentPage)}%`}</span>
                            </div>
                            {/* トーストメニュー */}
                            {showToast && (
                                <div
                                    className={detailStyles.toast}
                                    style={toastStyle}
                                >
                                    {selectQuestion && (
                                        <AddQuestionToFolder
                                            selectQuestion={selectQuestion}
                                            isDefault={true}
                                            accessToken={accessToken}
                                            userId={userId}
                                            Addfunction={addDefaultQToFolder}
                                            fetchQuestionDetail={() => fetchDefaultQuestionDetail(selectQuestion.id)}
                                            showToast={showToast}
                                            setShowToast={setShowToast}

                                        />

                                    )}
                                </div>
                            )}




                            <div className={detailStyles.contents}>

                                <>
                                    {questions.map((question: Question, index: number) => (
                                        <div key={question.id}>
                                            {/* 最初の質問 or カテゴリー名が前回と異なるときに表示 */}
                                            {(index === 0 || question.age !== questions[index - 1].age) ? (
                                                <div
                                                    className={detailStyles.accordion}
                                                    // アコーディオンメニュー
                                                    onClick={() => toggleAccordion(question.age)}
                                                >
                                                    <div className={listStyles.ageAccordion}>
                                                        <span className={listStyles.age}>{question.age}&nbsp;&nbsp;</span>
                                                        <span className={listStyles.progressBarWrapper} style={{ width: '100%' }}>
                                                            <ProgressBar
                                                                now={answerdAgeCounts(question) / ageCounts[question.age] * 100}
                                                                className={listStyles.progressDetail}
                                                                variant='secondary'
                                                            />
                                                            <span className={listStyles.progressBarLabel}>{`${getAnsweredAgeRatio(question)} %`}</span>
                                                        </span>
                                                    </div>
                                                    {openAge === question.age ? (
                                                        <span>
                                                            <img src={minus} className={detailStyles.openIcon} alt='閉じる' onClick={() => { }} />
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            <img src={plus} className={detailStyles.openIcon} alt='開く' onClick={() => { }} />
                                                        </span>)

                                                    }
                                                </div>
                                            ) : null}


                                            {openAge === question.age && (
                                                <table className={detailStyles.questionGroup}>
                                                    <tbody>
                                                        <tr>
                                                            <td className={detailStyles.id}>{question.id}.</td>
                                                            <td>
                                                                {/* <a href={`/questions/default/${question.id}`} className={detailStyles.link}>
                                                                    {question.text}
                                                                </a> */}
                                                                <span onClick={() => navigate(`/questions/default/${question.id}`,
                                                                    { state: { previousTitle: `レベル${page}　${currentCategory}` } }
                                                                )} className={detailStyles.link}>{question.text}
                                                                </span>

                                                                <span>
                                                                    <img src={newFolder} className={listStyles.trashIcon} alt='フォルダに追加' onClick={(e) => toggleToast(e, question.id)} />

                                                                </span>
                                                            </td>


                                                            {(question.answers[0]) && (
                                                                <td>
                                                                    <img src={checkMark} alt='回答済' className={detailStyles.check} />
                                                                </td>

                                                            )}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    ))}
                                </>
                            </div>
                        </>
                    )}
                </div >
            ) : null}
        </>
    );
}

export default DefaultQuestionsList;