import React, { useState, useRef, useEffect } from 'react'
import { Question, Answer } from "../../types";
import { Modal, Button, Card } from 'react-bootstrap';
import { getAnswers, updateAnswer, deleteAnswer } from '../../components/api/CustomAnswers';
import AnswerForm from './AnswerForm';
import ShowMsg from '../../components/layouts/ShowMsg';

import plus from '../../images/icon/plus.svg';
import minus from '../../images/icon/minus.svg';
import trashIcon from '../../images/icon/trash.svg';
import editIcon from '../../images/icon/edit.svg';

import detailStyles from '../../components/styles/QuestionDetail.module.css';
import styles from '../../components/styles/Common.module.css';
import listStyles from '../../components/styles/List.module.css';



// CustomQuestionsDetailから受け取り
type AnswerListProps = {
    accessToken: string | null;
    userId: string | null;
    question: Question;
    fetchQuestion: () => void;
}


const AnswerList = (props: AnswerListProps) => {
    // アコーディオンメニュー
    const [openAnswer, setOpenAnswer] = useState<number | null>(null);
    const answers = props.question.answers;

    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const answerIdRef = useRef<number | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDefault, setIsDefault] = useState<boolean>(false);

    // 編集時にフォームに表示する値
    const [titleValue, setTitleValue] = useState<string>('');
    const [text1Value, setText1Value] = useState<string>('');
    const [text2Value, setText2Value] = useState<string>('');
    const [text3Value, setText3Value] = useState<string>('');

    // 親コンポーネントの質問更新(fetchQuestion)を実行
    const updateQuestion = async () => {
        props.fetchQuestion();
    }


    const toggleAccordion = (answerTitle: number | null) => {
        if (openAnswer === answerTitle) {
            setOpenAnswer(null);
        } else {
            isEditing && setIsEditing(false);
            setOpenAnswer(answerTitle);
        }
    };

    // タイトルはHTMLタグを取り除く
    const removeTag = (html: string) => {
        return html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    };

    // HTML文字列をレンダリング
    const renderHTML = (escapedHTML: string) => {
        return <div dangerouslySetInnerHTML={{ __html: escapedHTML }} />;
    };



    // 削除ボタンを押した後
    const handleDeleteClick = async (answerId: number, isDefault: boolean) => {
        if (!props.accessToken || !props.userId) return;
        const res = await deleteAnswer({ accessToken: props.accessToken, questionId: props.question.id, userId: props.userId, isDefault }, answerId);
        if (res === null) {
            setOpenAnswer(null);
            setShowModal(false);
            // window.location.reload();
            updateQuestion();
        }
        else {
            setShowModal(false);
            setErrorMessage('削除に失敗しました');
        }
    }

    // 編集アイコンをクリックした後、エディタを表示
    const openEditor = (answerId: number) => {
        setIsEditing(!isEditing);
        answerIdRef.current = answerId;
    }


    // 編集フォームを送信
    const onSubmit = async (data: {
        isDefault: boolean,
        title: string,
        text1: string,
        text2: string,
        text3: string,
        user: string,
    }) => {

        if (!props.accessToken || !props.userId || !props.question) return;

        // 空白のみの回答は送信しない
        try {
            const stripHtmlTags = (str: string) => {
                return str.replace(/<\/?[^>]+(>|$)/g, "");
            };

            if (!data.title.trim() || /^\s*$/.test(stripHtmlTags(data.title)) || !data.text1.trim() || /^\s*$/.test(stripHtmlTags(data.text1))) {
                console.log(data.text3);
                setErrorMessage('標語、ファクトは必須です');
                return;
            }

            console.log(data.title);
            console.log(data.text3);

            let res;
            res = await updateAnswer({
                isDefault: data.isDefault,
                accessToken: props.accessToken,
                questionId: props.question.id,
                userId: props.userId,
                title: data.title,
                text1: data.text1,
                text2: data.text2,
                text3: data.text3
            }, answerIdRef.current ? answerIdRef.current : 0);

            if (res) {
                setSuccessMessage('編集しました');
                setIsEditing(false);
                console.log(res);
                updateQuestion();

                // window.location.reload();

            } else {
                setErrorMessage('編集に失敗しました');
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }



    // フォーム初期値の更新
    useEffect(() => {
        if (openAnswer) {
            const answer = answers.find((answer) => answer.id === openAnswer);
            if (answer) {
                setTitleValue(answer.title);
                setText1Value(answer.text1);
                setText2Value(answer.text2);
                setText3Value(answer.text3);
            }
        }
    }
        , [openAnswer, answers]);






    return (
        <>


            {answers.map((answer: Answer) => (

                <div key={answer.id}>
                    {/* アコーディオンメニュー */}
                    <div
                        className={detailStyles.accordion}
                        onClick={() => toggleAccordion(answer.id)}

                    >
                        <div style={{ marginLeft: '10px' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '20px' }}>
                                {removeTag(answer.title)}
                            </span>

                            <span>
                                (
                                {new Date(answer.created_at).getFullYear() + '/' +
                                    (new Date(answer.created_at).getMonth() + 1) + '/' +
                                    new Date(answer.created_at).getDate()
                                }</span>
                            作成)
                        </div>

                        <div >
                            {openAnswer === answer.id ? (
                                <span>
                                    <img src={minus} className={detailStyles.openIcon} alt='閉じる' onClick={() => { }} />
                                </span>
                            ) : (
                                <span>
                                    <img src={plus} className={detailStyles.openIcon} alt='開く' onClick={() => { }} />
                                </span>)
                            }
                        </div>



                    </div>


                    {openAnswer === answer.id && (
                        <div className={detailStyles.answerBox}>
                            <div style={{ textAlign: 'right' }}>
                                {/* 編集アイコン */}
                                {isEditing ? (
                                    <span
                                        className={listStyles.cancel}
                                        onClick={() => setIsEditing(false)}
                                    >
                                        キャンセル</span>

                                ) : (
                                    <>
                                        <span>

                                            <img src={editIcon} className={listStyles.trashIcon} style={{ width: '22px' }} alt='編集'
                                                onClick={() => (openEditor(answer.id))} />
                                        </span>
                                    </>
                                )}


                                {/* 削除アイコン */}
                                <span>
                                    <img src={trashIcon} className={listStyles.trashIcon} style={{ width: '22px' }} alt='削除'
                                        onClick={() => (setShowModal(true), answerIdRef.current = answer.id)}
                                    />
                                </span>
                            </div>

                            {/* 編集中はエディタを表示 */}
                            {isEditing ? (
                                <>
                                    <AnswerForm onSubmit={onSubmit} errorMessage={errorMessage} isEditing={true}
                                        initialData={{
                                            title: titleValue,
                                            text1: text1Value,
                                            text2: text2Value,
                                            text3: text3Value,
                                        }}
                                        isDefault={false}
                                    />
                                </>

                            ) : (

                                <div>
                                    <div className={detailStyles.mark4}>ファクト</div>
                                    <div className={detailStyles.answerText}>{renderHTML(answer.text1)}</div>

                                    {answer.text2 && (<>
                                        <div style={{ textAlign: 'center' }}>
                                        </div>
                                        <div className={detailStyles.mark4}>抽象</div>
                                        <div className={detailStyles.answerText}>{renderHTML(answer.text2)}</div>

                                    </>)}
                                    {answer.text3 && (<>
                                        <div style={{ textAlign: 'center' }}>
                                        </div>
                                        <div className={detailStyles.mark4}>転用</div>
                                        <div className={detailStyles.answerText}>{answer.text3 && renderHTML(answer.text3)}</div>
                                    </>)
                                    }
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
                                    <Button className={styles.darkButton} variant="primary" onClick={() => handleDeleteClick(answerIdRef.current ? answerIdRef.current : 0, isDefault)}>
                                        削除
                                    </Button>
                                </Modal.Footer>
                            </Modal>


                        </div>

                    )}

                </div>
            ))}
        </>
    )
}

export default AnswerList;