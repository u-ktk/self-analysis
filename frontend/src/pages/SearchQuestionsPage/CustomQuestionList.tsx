import React, { useEffect, useState, useRef } from 'react'
import { Question, Folder } from "../../types";
import { getCustomQuestions, addCustomQToFolder, getCustomQuestionDetail } from '../../components/api/CustomQuestions';
import { addQuestionToFolder } from '../../features/SearchQuestions/AddQustionToFolder';
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
    const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });
    const selectQuestionRef = useRef<number>(0);
    const [selectAddFolders, setSelectAddFolders] = useState<number[]>([]);
    const [folderList, setFolderList] = useState<Folder[]>([]);

    const navigate = useNavigate();



    /**
      ここからhandleAddQuestionToFolder()まで、トーストメニューを開くための処理
      DefaultQuestionList.tsxとほぼ同じだからあとでまとめたい...)
     */
    // トーストメニューを開く
    const toggleToast = (e: React.MouseEvent, questionId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        setToastPosition({ x, y });
        selectQuestionRef.current = questionId;
        // const currentQuestion = questions[questionId - 1];
        const currentQuestion = questions.find(q => q.id === questionId);

        if (currentQuestion && currentQuestion.folders) {
            setSelectAddFolders(currentQuestion.folders);
        } else {
            setSelectAddFolders([]);
        }
        // console.log(currentQuestion.folders)
        console.log(selectAddFolders)
        setShowToast(true);
    }

    // トーストメニューを閉じる
    useEffect(() => {
        // Escapeキーを押した場合
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowToast(false);
            }
        };
        // トースト以外の部分をクリックした場合
        const handleClickOutside = (event: MouseEvent) => {
            const toastElement = document.querySelector(`.${detailStyles.toast}`);
            if (showToast && toastElement && !toastElement.contains(event.target as Node)) {
                setShowToast(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showToast, detailStyles.toast]);


    // チェックボックスをクリック
    const handleCheckboxChange = (folderId: number) => {

        const currentQuestion = questions[selectQuestionRef.current - 1];
        const isOriginallyIncluded = currentQuestion?.folders?.includes(folderId) ?? false;

        setSelectAddFolders(prevFolders => {
            // もともと含まれているフォルダをクリックした場合
            if (isOriginallyIncluded) {
                // もし現在選択されているフォルダに含まれていれば削除、そうでなければ追加
                if (prevFolders.includes(folderId)) {
                    return prevFolders.filter(id => id !== folderId);
                } else {
                    return [...prevFolders, folderId];
                }
            } else {
                // もともと含まれていないフォルダをクリックした場合
                if (prevFolders.includes(folderId)) {
                    return prevFolders.filter(id => id !== folderId);
                } else {
                    return [...prevFolders, folderId];
                }
            }
        });

    };


    // チェックボックスの状態を返す
    const isFolderIncluded = (folderId: number): boolean => {
        const included = selectAddFolders.includes(folderId);
        console.log(included)
        return included;
    };



    // 完了ボタンをクリック後、選択したフォルダに質問を追加
    const handleAddQuestionToFolder = async () => {
        if (selectQuestionRef.current) {
            let selectQuestion = selectQuestionRef.current;
            let selectFolders = selectAddFolders;
            await addQuestionToFolder({ selectQuestion, selectFolders, accessToken, userId, Addfunction: addCustomQToFolder });
            // const result = await addQuestionToFolder({ selectQuestion, selectFolders, accessToken, userId, Addfunction: addCustomQToFolder });

            setQuestions(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                const questionIndex = updatedQuestions.findIndex(q => q.id === selectQuestion);
                if (questionIndex !== -1) {
                    updatedQuestions[questionIndex].folders = selectFolders;
                }
                return updatedQuestions;
            });


        }
        setShowToast(false);


    };


    // フォルダー一覧を取得
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getFolderList({ accessToken, userId });
                if (res) {
                    setFolderList(res);
                    setLoading(false);
                }
            }
            catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
                setLoading(false);
            }
        }
        fetchData();
    }
        , [accessToken, userId]);

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
                    setQuestions(res);
                    setReverseQuestions(res.slice().reverse());
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



    // トーストメニューを開いた時、特定の質問だけを取得（フォルダ更新時に際レンダリングするため）
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getCustomQuestionDetail({ accessToken, userId }, selectQuestionRef.current.toString());
                if (res) {
                    setQuestions(prevQuestions => {
                        const newQuestions = [...prevQuestions];
                        newQuestions[selectQuestionRef.current - 1] = res;
                        return newQuestions;
                    });
                    setReverseQuestions(prevQuestions => {
                        const newQuestions = [...prevQuestions];
                        newQuestions[prevQuestions.length - selectQuestionRef.current] = res;
                        return newQuestions;
                    })
                }

            } catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
            }
        };
        fetchData();
    }, [showToast, accessToken, selectAddFolders]);


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
                                    style={
                                        {
                                            // クリックした位置によって表示場所を変更
                                            left: windowWidth < 960
                                                ? `${toastPosition?.x - 50}px`
                                                : `${toastPosition?.x + 50}px`,
                                            top: toastPosition?.y - 200 < 0
                                                ? `${toastPosition?.y}px`
                                                : `${toastPosition?.y - 100}px`,
                                            transform: 'none'
                                        }
                                    }
                                >
                                    {(folderList === null || folderList.length === 0) ? (
                                        <div className="toast-header">
                                            <strong className="me-auto">フォルダがありません</strong>
                                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: "#4b4b4b" }}>
                                                質問{selectQuestionRef.current}をフォルダに追加</div>
                                            {folderList.map(folder => (
                                                <div key={folder.name}>
                                                    <input
                                                        type="checkbox"
                                                        style={{ accentColor: '#AC8D73' }}
                                                        checked={isFolderIncluded(folder.id)}
                                                        // {defaultQuestions[selectQuestionRef.current - 1].folders?.includes(folder.id)}
                                                        onChange={() => handleCheckboxChange(folder.id)}
                                                    />
                                                    {folder.name}
                                                </div>
                                            ))}
                                            <Button size="sm" className={`mt-2 ${styles.darkButton}`} onClick={handleAddQuestionToFolder}>完了</Button>



                                        </>
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