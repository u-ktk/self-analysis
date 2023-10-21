import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/Auth/Token'
import { getCustomQuestionDetail, addCustomQToFolder, deleteCustomQuestion } from '../../components/api/CustomQuestions'
import { getDefaultQuestionDetail, addDefaultQToFolder } from '../../components/api/DefaultQuestions'
import AddQuestionToFolder from '../../features/SearchQuestions/AddQustionToFolder';
import { getFolderList } from '../../components/api/Folder';
import AnswerList from '../../features/Answer/AnswerList';
import CreateNewAnswer from '../../features/Answer/CreateNewAnswer'
import { Question, Folder } from '../../types'
import ShowMsg from '../../components/layouts/ShowMsg'

import detailStyles from '../../components/styles/QuestionDetail.module.css'
import styles from '../../components/styles/Common.module.css'
import listStyles from '../../components/styles/List.module.css'
import loadStyles from '../../components/styles/Loading.module.css'
import { Button, Modal } from 'react-bootstrap';

import newFolder from '../../images/icon/newFolder.svg';
import trashIcon from '../../images/icon/trash.svg'
import checkMark from '../../images/checked.png'

type QuestionDetailProps = {
    isDefault: boolean;
    question: Question;
    fetchQuestion: () => void;
    errorMessage: string | null;
}

const CustomQuestionDetail = (props: QuestionDetailProps) => {
    const { accessToken, userId } = useAuth();
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const location = useLocation();

    const questionId = props.question.id.toString();

    // フォルダ追加メニューの表示位置
    const toggleToast = (e: React.MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        setToastPosition({ x, y });
        setShowToast(!showToast);
    }


    // 質問の取得
    useEffect(() => {
        if (!accessToken || !userId || !questionId) {
            console.log('no accessToken or userId or questionId')
            return;
        }
        try {
            props.fetchQuestion();
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);

        }

    }, [showToast, accessToken, userId]);


    // カスタム質問削除の確認
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

    const getLinkText = () => {
        if (location.state?.previousTitle) {
            return location.state?.previousTitle;
        }
        else {
            return '前のページへ戻る';
        }
    }
    const linkText = getLinkText();


    return (
        <>


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
                                {/* フォルダor 一覧からの遷移が考えられる */}
                                <span onClick={() => navigate(-1)} className={styles.link}>{linkText}</span>
                                <span> &#62; </span>
                            </div>

                            {/* フォルダのトーストメニュー */}
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

                                    <AddQuestionToFolder
                                        selectQuestion={props.question}
                                        accessToken={accessToken}
                                        userId={userId}
                                        Addfunction={props.isDefault ? addDefaultQToFolder : addCustomQToFolder}
                                        fetchQuestion={props.fetchQuestion}
                                        showToast={showToast}
                                        setShowToast={setShowToast}

                                    />
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

                            {/* 成功メッセージ */}
                            {successMessage &&
                                <ShowMsg message={successMessage} isSuccess={true} />
                            }

                            {/* エラーメッセージ */}
                            {(props.errorMessage || errorMessage) &&
                                <ShowMsg message={errorMessage} isSuccess={false} />
                            }


                            <div className={detailStyles.contents}>
                                {!props.question ? (
                                    <div>質問がありません</div>
                                ) : (
                                    <>
                                        <div>
                                            <h5 className={styles.title}>{props.question.text}({props.question.age})
                                            </h5>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span>{
                                                new Date(props.question.created_at).getFullYear() + '/' +
                                                (new Date(props.question.created_at).getMonth() + 1) + '/' +
                                                new Date(props.question.created_at).getDate()
                                            }作成</span>
                                            <span>
                                                <img src={newFolder} className={listStyles.folderIcon} alt='フォルダを更新'
                                                    onClick={(e) => toggleToast(e)}
                                                />
                                            </span>
                                            {/* カスタム質問のみ削除マーク */}
                                            {props.isDefault ? null : (
                                                <span>
                                                    <img src={trashIcon} className={listStyles.trashIcon} style={{ width: '22px' }} alt='削除'
                                                        onClick={() => setShowModal(true)}
                                                    />
                                                </span>
                                            )
                                            }

                                            {(props.question.answers[0]) && (
                                                <img src={checkMark} alt='回答済' className={detailStyles.check} />
                                            )}
                                        </div>



                                        {/* 新規回答作成 */}
                                        <CreateNewAnswer
                                            accessToken={accessToken}
                                            userId={userId}
                                            questionId={questionId}
                                            fetchQuestion={props.fetchQuestion}
                                        />

                                        {props.question.answers.length > 0 && (
                                            <>
                                                <hr style={{ marginTop: '30px' }}></hr>
                                                {/* 回答リスト */}
                                                <h5>これまでの回答</h5>
                                                <AnswerList
                                                    question={props.question}
                                                    fetchQuestion={props.fetchQuestion}
                                                    accessToken={accessToken}
                                                    userId={userId}
                                                />

                                            </>
                                        )}

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