import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/Auth/Token'
import { addCustomQToFolder, deleteCustomQuestion } from '../../components/api/CustomQuestions'
import { addDefaultQToFolder } from '../../components/api/DefaultQuestions'
import AddQuestionToFolder from '../../features/SearchQuestions/AddQustionToFolder';
import AnswerList from '../../features/Answer/AnswerList';
import CreateNewAnswer from '../../features/Answer/CreateNewAnswer'
import { Question } from '../../types'
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
            
            return;
        }
        try {
            props.fetchQuestion();
            setLoading(false);
        }
        catch (error) {
            
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
        else if (location.state?.previousUrl) {
            return '前のページへ戻る';
        }
        else {
            return 'レベル' + props.question.category + '.' + props.question.category_name;
        }
    }
    const linkText = getLinkText();

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
                                {/* フォルダからの遷移or 質問一覧からの遷移 or 質問作成後が考えられる */}
                                {linkText.includes('レベル') ? (
                                    <a href={`/questions-list/default/${props.question.category}`} className={styles.link}>{linkText}</a>
                                ) : (
                                    <span onClick={() => navigate(-1)} className={styles.link}>{linkText}</span>
                                )}
                                <span> &#62; </span>


                            </div>

                            {/* フォルダのトーストメニュー */}
                            {showToast && (
                                <div
                                    className={detailStyles.toast}
                                    style={
                                        {
                                            // クリックした位置によって表示場所を変更
                                            left:
                                                `${toastPosition?.x - 150}px`,
                                            top: toastPosition?.y - 200 < 0
                                                ? `${toastPosition?.y}px`
                                                : `${toastPosition?.y - 100}px`,
                                            transform: 'none'
                                        }
                                    }
                                >

                                    <AddQuestionToFolder
                                        selectQuestion={props.question}
                                        isDefault={props.isDefault}
                                        accessToken={accessToken}
                                        userId={userId}
                                        Addfunction={props.isDefault ? addDefaultQToFolder : addCustomQToFolder}
                                        fetchQuestionDetail={props.fetchQuestion}
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


                                            <h5 className={styles.title}>
                                                {props.isDefault ? (
                                                    <span>{props.question.id}.　</span>
                                                ) : (
                                                    null
                                                )}
                                                {props.question.text}({props.question.age})
                                            </h5>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {props.isDefault ? null : (
                                                <span>{
                                                    new Date(props.question.created_at).getFullYear() + '/' +
                                                    (new Date(props.question.created_at).getMonth() + 1) + '/' +
                                                    new Date(props.question.created_at).getDate()
                                                }作成</span>
                                            )}

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


                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}
                                            className='mt-4'>

                                            {props.isDefault && props.question.id > 1 ? (
                                                <>
                                                    <a
                                                        href={`/questions/default/${props.question.id - 1}`}
                                                        className={listStyles.link}
                                                        style={{ 'color': '#6f6e6e' }}
                                                    // >&#60;&#60; 前の質問</a>
                                                    >← 前の質問</a>
                                                    {/* <span onClick={() => navigate(`/questions/default/${props.question.id - 1}`,
                                                        { state: { previousUrl: `${props.question.text}` } }
                                                    )} className={listStyles.link}
                                                        style={{ 'color': '#6f6e6e' }}

                                                    >← 前の質問
                                                    </span> */}


                                                </>
                                            ) : (
                                                <span></span>
                                            )}

                                            {props.isDefault && props.question.id < 1000 ? (
                                                <a
                                                    href={`/questions/default/${props.question.id + 1}`}
                                                    className={listStyles.link}
                                                    style={{ 'color': '#6f6e6e' }}

                                                // >次の質問 &#62;&#62; </a>
                                                >次の質問 → </a>

                                            ) : (
                                                <span></span>
                                            )}
                                        </div>

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