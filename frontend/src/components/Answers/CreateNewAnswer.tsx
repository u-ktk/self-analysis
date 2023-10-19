import React, { useState } from 'react'
import AnswerForm from './AnswerForm';
import openIcon from '../../images/icon/open.svg';
import { getAnswers, createAnswer, updateAnswer, deleteAnswer } from '../api/CustomAnswers'
import { getCustomQuestionDetail } from '../api/CustomQuestions'
import { Question } from '../../types';
import ShowMsg from '../layouts/ShowMsg';

import formStyles from '../styles/Form.module.css';
import detailStyles from '../styles/QuestionDetail.module.css';

import plus from '../../images/icon/plus.svg';
import minus from '../../images/icon/minus.svg';


type CreateAnswerProps = {
    accessToken: string | null;
    userId: string | null;
    questionId: string | undefined;
}

const CreateNewAnswer = (props: CreateAnswerProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [customQuestion, setCustomQuestion] = useState<Question | null>(null);
    const [openAnswer, setOpenAnswer] = useState<boolean>(false);


    // 回答の送信
    const onSubmit = async (data: {
        isDefault: boolean,
        title: string,
        text1: string,
        text2: string,
        text3: string,
        user: string,
    }) => {

        if (!props.accessToken || !props.userId || !props.questionId) return;
        // 空白のみの回答は送信しない
        try {
            const stripHtmlTags = (str: string) => {
                return str.replace(/<\/?[^>]+(>|$)/g, "");
            };

            if (!data.title.trim() || /^\s*$/.test(stripHtmlTags(data.title)) || !data.text1.trim() || /^\s*$/.test(stripHtmlTags(data.text1))) {
                setErrorMessage('標語、ファクトは必須です');
                window.scrollTo(0, 0)
                return;
            }

            const accessToken = props.accessToken;
            const userId = props.userId;
            const questionId = props.questionId;

            // 回答を作成
            const res = await createAnswer({
                accessToken, userId, questionId: parseInt(props.questionId),
                title: data.title, text1: data.text1, text2: data.text2, text3: data.text3, isDefault: false
            });
            if (res) {
                setSuccessMessage('回答を作成しました');
                window.scrollTo(0, 0)
                if (errorMessage) setErrorMessage(null);
                // データを更新して再レンダリング
                if (!accessToken || !userId || !questionId) return;
                const newRes = await getCustomQuestionDetail({ accessToken, userId }, questionId);
                if (newRes) {
                    setCustomQuestion(newRes);
                }

            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);

                console.log(errorMessage);

            }
        }
    }

    // アコーディオンの開閉
    const toggleAccordion = () => {
        setOpenAnswer(!openAnswer);
    };


    return (
        <>

            {/* 成功メッセージ */}
            {successMessage &&
                <ShowMsg message={successMessage} isSuccess={true} />
            }

            {/* エラーメッセージ */}
            {errorMessage &&
                <ShowMsg message={errorMessage} isSuccess={false} />
            }

            {/*   質問作成アコーディオン*/}
            <div
                className={detailStyles.accordion}
                // style={{ backgroundColor: '#ac8d7321' }}
                style={{ backgroundColor: '#d8894818' }}
                onClick={() => toggleAccordion()}
            >

                <div style={{
                    marginLeft: '10px',

                    // color: '#fafafa'
                }}>
                    <span style={{
                        fontWeight: 'bold',
                        marginRight: '10px',

                    }}>
                        回答を作成
                    </span>
                    {/* <span >
                        &nbsp;
                        <a href='/help' className={formStyles.link}>
                            詳しくはこちら
                            <span>
                                <img alt="探す" src={openIcon} width="20" height="20"></img>
                            </span>
                        </a>

                    </span> */}
                </div>



                <div>
                    {openAnswer ? (
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


            {/* アコーディオンopenの場合 */}
            {openAnswer &&
                (
                    <div className={detailStyles.answerBox}>
                        <AnswerForm onSubmit={onSubmit} errorMessage={errorMessage} isEditing={false} isDefault={false} />
                    </div>

                )

            }




        </>
    )

}

export default CreateNewAnswer;