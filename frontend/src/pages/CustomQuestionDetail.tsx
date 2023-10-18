import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import HeadTitle from '../components/layouts/HeadTitle'
import { useAuth } from '../components/auth/Auth'
import { getCustomQuestionDetail, addCustomQToFolder, deleteCustomQuestion } from '../components/api/CustomQuestions'
import { getAnswers, createAnswer, updateAnswer, deleteAnswer } from '../components/api/CustomAnswers'
import { addQuestionToFolder } from '../components/SearchQuestions/AddQustionToFolder'
import { getFolderList } from '../components/api/Folder';
import AnswerForm from '../components/Answers/AnswerForm';
import AnswerList from '../components/Answers/AnswerList';
import CreateNewAnswer from '../components/Answers/CreateNewAnswer'
import { Question, Answer, Folder } from '../types'

import detailStyles from '../components/styles/QuestionDetail.module.css'
import styles from '../components/styles/Common.module.css'
import listStyles from '../components/styles/List.module.css'
import loadStyles from '../components/styles/Loading.module.css'
import formStyles from '../components/styles/Form.module.css'
import { Button, Modal, Alert } from 'react-bootstrap';


import newFolder from '../images/icon/newFolder.svg';
import trashIcon from '../images/icon/trash.svg'
import checkMark from '../images/checked.png'
import checkIcon from '../images/icon/check.svg'
import errorIcon from '../images/icon/error.svg'
import closeIcon from '../images/icon/close.svg'
import openIcon from '../images/icon/open.svg'




const CustomQuestionDetail = () => {
    const { questionId } = useParams<{ questionId: string }>();
    // const { user } = useParams<{ user: string }>();
    const { accessToken, userId } = useAuth();
    const [customQuestion, setCustomQuestion] = useState<Question>();
    const [folderList, setFolderList] = useState<Folder[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectAddFolders, setSelectAddFolders] = useState<number[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoding] = useState(true);
    const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });

    // console.log(accessToken, userId, questionId)

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;



    // トーストメニューを開く
    const toggleToast = (e: React.MouseEvent, questionId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        setToastPosition({ x, y });
        // const currentQuestion = questions.find(q => q.id === questionId);

        if (customQuestion && customQuestion.folders) {
            setSelectAddFolders(customQuestion.folders);
        } else {
            setSelectAddFolders([]);
        }
        // console.log(currentQuestion.folders)
        console.log(selectAddFolders)
        setShowToast(true);
    }

    // トーストメニュー閉じる
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

        const isOriginallyIncluded = customQuestion?.folders?.includes(folderId) ?? false;

        // チェックされていない部分をクリックしたら
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
        return included;
    };

    // 完了ボタンをクリック後、選択したフォルダに質問を追加
    const handleAddQuestionToFolder = async () => {
        if (!accessToken || !userId || !customQuestion) return;
        let selectQuestion = customQuestion.id;
        let selectFolders = selectAddFolders;
        await addQuestionToFolder({ selectQuestion, selectFolders, accessToken, userId, Addfunction: addCustomQToFolder });

        setShowToast(false);
    };


    // 質問の取得
    useEffect(() => {
        if (!accessToken || !userId || !questionId) {
            console.log('no accessToken or userId or questionId')
            return;

        }
        const fetchQuestion = async () => {
            try {
                const res = await getCustomQuestionDetail({ accessToken, userId }, questionId);
                if (res) {
                    setCustomQuestion(res);
                    setLoding(false)
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchQuestion();

    }, [showToast, accessToken, userId, selectAddFolders]);


    // フォルダの取得
    useEffect(() => {
        if (!accessToken || !userId) return;
        const fetchFolders = async () => {
            try {
                const res = await getFolderList({ accessToken, userId });
                if (res) {
                    setFolderList(res);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchFolders();
    }, [accessToken, userId,]);

    // 質問削除の確認

    const handleDeleteClick = async () => {
        if (!accessToken || !userId || !questionId) return;
        const res = await deleteCustomQuestion({ accessToken, userId }, questionId);
        if (res === null) {
            window.location.href = '/questions-list/custom/';
        }
        else {
            setShowModal(false);
            setErrorMessage('削除に失敗しました');
        }

    }

    // 回答の送信
    // const onSubmit = async (data: {
    //     isDefault: boolean,
    //     title: string,
    //     text1: string,
    //     text2: string,
    //     text3: string,
    //     user: string,
    // }) => {

    //     if (!accessToken || !userId || !questionId) return;
    //     // 空白のみの回答は送信しない
    //     try {
    //         const stripHtmlTags = (str: string) => {
    //             return str.replace(/<\/?[^>]+(>|$)/g, "");
    //         };

    //         if (!data.title.trim() || /^\s*$/.test(stripHtmlTags(data.title)) || !data.text1.trim() || /^\s*$/.test(stripHtmlTags(data.text1))) {
    //             console.log(data.text3)
    //             setErrorMessage('標語、ファクトは必須です');
    //             return;
    //         }

    //         const res = await createAnswer({ accessToken, userId, questionId: parseInt(questionId), title: data.title, text1: data.text1, text2: data.text2, text3: data.text3, isDefault: false });
    //         if (res) {
    //             setSuccessMessage('回答を作成しました');
    //             if (errorMessage) setErrorMessage(null);
    //             // データを更新して再レンダリング
    //             if (!accessToken || !userId || !questionId) return;
    //             const res = await getCustomQuestionDetail({ accessToken, userId }, questionId);
    //             if (res) {
    //                 setCustomQuestion(res);
    //             }
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             setErrorMessage(error.message);
    //             console.log(errorMessage);
    //         }
    //     }

    // }



    return (
        <>
            <HeadTitle title="質問の詳細" />


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
                                <a href='/questions-list/custom/' className={styles.link}>作成した質問一覧 </a>
                                <span> &#62; </span>
                                {/* <span style={{ fontWeight: 'bold', fontSize: '120%' }}>{}</span> */}
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
                                                質問をフォルダに追加</div>
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

                            {/* 削除確認モーダル */}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>削除の確認</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    質問を削除しますか？
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className={styles.lightButton} variant="outline-primary" onClick={() => setShowModal(false)}>
                                        キャンセル
                                    </Button>
                                    <Button className={styles.darkButton} variant="primary" onClick={handleDeleteClick}>
                                        削除
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <div className={detailStyles.contents}>
                                {!customQuestion ? (
                                    <div>質問がありません</div>
                                ) : (
                                    <>
                                        <div>
                                            <h5 className={styles.title}>{customQuestion.text}({customQuestion.age})
                                            </h5>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span>{
                                                new Date(customQuestion.created_at).getFullYear() + '/' +
                                                (new Date(customQuestion.created_at).getMonth() + 1) + '/' +
                                                new Date(customQuestion.created_at).getDate()
                                            }作成</span>
                                            <span>
                                                <img src={newFolder} className={listStyles.folderIcon} alt='フォルダを更新'
                                                    onClick={(e) => toggleToast(e, questionId ? parseInt(questionId) : 0)}
                                                />
                                            </span>
                                            <span>
                                                <img src={trashIcon} className={listStyles.trashIcon} style={{ width: '22px' }} alt='削除'
                                                    onClick={() => setShowModal(true)}
                                                />
                                            </span>
                                            {(customQuestion.answers[0]) && (
                                                <img src={checkMark} alt='回答済' className={detailStyles.check} />
                                            )}
                                        </div>

                                        {/* 回答作成成功 */}
                                        {/* {successMessage &&
                                            <Alert variant='primary' className={formStyles.alert}>
                                                <span>
                                                    <img alt="作成成功" src={checkIcon} width="40" height="40" />
                                                </span>
                                                <div className={formStyles.msg}>
                                                    <div style={{ fontWeight: 'bold' }}>
                                                        {successMessage}
                                                    </div>
                                                    <div >
                                                        <img alt="閉じる" src={closeIcon} width="18" height="18" onClick={() => setSuccessMessage(null)} />
                                                    </div>
                                                </div>
                                            </Alert>
                                        } */}

                                        {/* エラーメッセージ */}
                                        {/* {errorMessage &&
                                            <Alert className={formStyles.alert}>
                                                <span>
                                                    <img alt="エラー" src={errorIcon} width="40" height="40"></img>
                                                </span>
                                                <div className={formStyles.msg}>
                                                    <div >
                                                        {errorMessage}
                                                    </div>
                                                    <div >
                                                        <img alt="閉じる" src={closeIcon} width="18" height="18" onClick={() => setSuccessMessage(null)} />
                                                    </div>
                                                </div>
                                            </Alert>} */}





                                        {/* 新規回答作成 */}
                                        <CreateNewAnswer accessToken={accessToken} userId={userId} questionId={questionId} />

                                        <hr style={{ marginTop: '30px' }}></hr>
                                        {/* 回答リスト */}
                                        <h5>これまでの回答</h5>
                                        <AnswerList
                                            question={customQuestion}
                                            accessToken={accessToken}
                                            userId={userId}
                                        />

                                    </>
                                )}
                            </div>



                        </>
                    )}
                </div>
            ) : null}




        </>
    )
}

export default CustomQuestionDetail