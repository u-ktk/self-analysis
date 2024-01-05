import React, { useEffect, useState, useRef } from 'react'
import { Question, Folder } from "../../types";
import { getCustomQuestions, addCustomQToFolder, getCustomQuestionDetail } from '../../components/api/CustomQuestions';
import AddQuestionToFolder from '../../features/SearchQuestions/AddQustionToFolder';
import { getFolderList } from '../../components/api/Folder';
import { useAuth } from '../../features/Auth/Token';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/styles/Common.module.css'
import loadStyles from '../../components/styles/Loading.module.css'
import listStyles from '../../components/styles/List.module.css'
import detailStyles from '../../components/styles/QuestionDetail.module.css'
import HeadTitle from '../../components/layouts/HeadTitle';
import formStyles from '../../components/styles/Form.module.css';
import { Button, Alert } from 'react-bootstrap';

import newFolder from '../../images/icon/newFolder.svg'
import checkMark from '../../images/checked.png'
import errorIcon from '../../images/icon/error.svg'


type CustomQuestions = Question[]

const CustomQuestionList = () => {
    const { accessToken, userId } = useAuth()
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<CustomQuestions>([]);
    // 作成日時の降順に並び替え
    const [reverseQuestions, setReverseQuestions] = useState<CustomQuestions>([]);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [showToast, setShowToast] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectQuestion, setSelectQuestion] = useState<Question>();

    const navigate = useNavigate();



    // トーストメニューを開く
    const toggleToast = (e: React.MouseEvent, questionId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        setPosition({ x, y });
        // selectQuestionRef.current = questionId;
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


    // カスタム質問を取得

    const fetchCustomQuestionAll = async () => {
        setLoading(true);
        if (!accessToken || !userId) {
            return;
        }
        try {
            const res = await getCustomQuestions({ accessToken, userId });
            if (res) {
                // 
                setQuestions(res);
                setReverseQuestions(res.slice().reverse());
                setLoading(false);
            }
        } catch (err: any) {
            
            setErrorMessage(err.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomQuestionAll();
    }
        , [accessToken, userId])

    // トーストメニューを開いた時、特定の質問だけを取得（フォルダ更新の子コンポーネントで呼び出される）
    const fetchCustomQuestionDetail = async (questionId: number) => {
        if (!accessToken || !userId || !questionId) {
            return;
        }

        const res = await getCustomQuestionDetail({ accessToken, userId }, questionId.toString());
        if (res) {
            setQuestions(prevQuestions => {
                const newQuestions = [...prevQuestions];
                newQuestions[questionId - 1] = res;
                return newQuestions;
            });
            setReverseQuestions(prevQuestions => {
                const newQuestions = [...prevQuestions];
                newQuestions[prevQuestions.length - questionId] = res;
                return newQuestions;
            })
        }
        else {
            
        }
    }

    // 画面サイズが変更されたら再レンダリング
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <>
            <HeadTitle title='作成した質問' />
            {accessToken ? (
                <div className={styles.bg}>
                    {loading ? (
                        <div className={loadStyles.loading}>
                            <div className={loadStyles.text}>loading...</div>
                        </div>
                    ) : (
                        <>
                            {/* 見出し */}
                            <div className={`${styles.menu} mb-4 `}>
                                <a href='/questions-list' className={styles.link}>作成した質問から選ぶ </a>
                                <span> &#62; </span>
                                <span style={{ fontWeight: 'bold' }}>作成した質問一覧</span>
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
                                            isDefault={false}
                                            accessToken={accessToken}
                                            userId={userId}
                                            Addfunction={addCustomQToFolder}
                                            fetchQuestionDetail={() => fetchCustomQuestionDetail(selectQuestion.id)}
                                            showToast={showToast}
                                            setShowToast={setShowToast}

                                        />

                                    )}

                                </div>
                            )}


                            <div className={detailStyles.contents}>
                                {(!questions || questions.length === 0) ? (
                                    <Alert className={formStyles.alert}>
                                        <span>
                                            <img alt="エラー" src={errorIcon} width="40" height="40"></img>
                                        </span>
                                        <div>
                                            <strong className="m-2">質問がありません</strong>
                                        </div>
                                        <div className={detailStyles.noQuestion}>「質問を作る」メニューから作成できます。</div>
                                    </Alert>
                                ) : (
                                    reverseQuestions.map((question, index) => (
                                        <div key={question.id}>
                                            {(index === 0
                                                || new Date(question.created_at).getMonth() !== new Date(reverseQuestions[index - 1].created_at).getMonth()
                                                || new Date(question.created_at).getFullYear() !== new Date(reverseQuestions[index - 1].created_at).getFullYear()) &&
                                                <div className={detailStyles.category}>
                                                    {new Date(question.created_at).getFullYear()}年{new Date(question.created_at).getMonth() + 1}月
                                                </div>
                                            }


                                            <table className={detailStyles.questionGroup}>
                                                <tbody>
                                                    <tr>
                                                        <td className={detailStyles.id}>・</td>
                                                        <td className={detailStyles.text}>
                                                            {/* <a href={`/questions/custom/${userId}/${question.id}`} className={detailStyles.link}>
                                                                {question.text} ({question.age})
                                                            </a> */}
                                                            <span onClick={() => navigate(`/questions/custom/${userId}/${question.id}`,
                                                                { state: { previousTitle: '作成した質問一覧' } }
                                                            )} className={detailStyles.link}>{question.text}
                                                                ({question.age})</span>

                                                            <span>
                                                                <img src={newFolder} className={listStyles.trashIcon} alt='フォルダに追加'
                                                                    onClick={(e) => toggleToast(e, question.id)}
                                                                />
                                                            </span>
                                                            {(question.answers[0]) && (
                                                                <img src={checkMark} alt='回答済' className={detailStyles.check} />
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))
                                )}
                            </div>

                        </>

                    )}
                </div>
            ) : null}


        </>
    )
}

export default CustomQuestionList