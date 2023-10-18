import React, { useState } from 'react'
import AnswerForm from './AnswerForm';
import formStyles from '../styles/Form.module.css';
import openIcon from '../../images/icon/open.svg';
import { getAnswers, createAnswer, updateAnswer, deleteAnswer } from '../api/CustomAnswers'
import { getCustomQuestionDetail } from '../api/CustomQuestions'
import { Question } from '../../types';
import ShowMsg from '../layouts/ShowMsg';


type CreateAnswerProps = {
    accessToken: string | null;
    userId: string | null;
    questionId: string | undefined;
}

const CreateNewAnswer = (props: CreateAnswerProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [customQuestion, setCustomQuestion] = useState<Question | null>(null);


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


            {/* 説明 */}
            <div className={formStyles.descriptionBox} style={{ color: '#4b4b4b' }}>
                <ul>
                    <li>
                        「メモの魔力」p.136~p139を参考に
                        <br />
                        <span className={formStyles.highlighted}>「標語（ファクトをまとめたもの）」「ファクト」「抽象」「転用」</span>
                        <br />
                        を意識して回答してみましょう。
                    </li>
                    <li>
                        １つの質問に対して複数回答することもできます。
                    </li>
                </ul>
                <div style={{ color: '#6B4423' }}>
                    &nbsp;使い方の例は
                    <a href='/help' className={formStyles.link}>
                        こちら
                        <span>
                            <img alt="探す" src={openIcon} width="20" height="20"></img>
                        </span>
                    </a>

                </div>
            </div>

            <AnswerForm onSubmit={onSubmit} errorMessage={errorMessage} isEditing={false} isDefault={false} />



        </>
    )

}

export default CreateNewAnswer;