import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { Question } from "../types";
import Editor from './layouts/Editor';
import styles from './styles/Common.module.css';
import formStyles from './styles/Form.module.css';
import openIcon from '../images/icon/open.svg';

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string | null;
}

type FormData = {
    title: string;
    text1: string;
    text2: string
    text3: string
    user: number;
    question: number;
}

const AnswerForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

    const [titleValue, setTitleValue] = useState<string>('');
    const [text1Value, setText1Value] = useState<string>('');
    const [text2Value, setText2Value] = useState<string>('');
    const [text3Value, setText3Value] = useState<string>('');


    return (
        <div>
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
                <div style={{ color: '#AC8D73' }}>
                    &nbsp;使い方の例は
                    <a href='/help' className={formStyles.link}>
                        こちら
                        <span>
                            <img alt="質問を探す" src={openIcon} width="20" height="20"></img>
                        </span>
                    </a>

                </div>
            </div>




            <Form className=' mx-auto' onSubmit={handleSubmit(onSubmit)}>
                <div className={formStyles.formGroup}>
                    <label htmlFor="">標語（ファクトをまとめたもの）</label>
                    {/* <Editor value={titleValue} onChange={setTitleValue} /> */}
                    <Editor value={titleValue} onChange={(value) => {
                        setTitleValue(value);
                        setValue('title', value);
                    }} />

                    <input type="hidden"  {...register("title")} value={titleValue} />
                </div>

                <div className="form-group">
                    <label htmlFor="">ファクト</label>
                    <Editor value={text1Value} onChange={(value) => {
                        setText1Value(value);
                        setValue('text1', value);
                    }} />
                    <input type="hidden" {...register("text1")} value={text1Value} />
                </div>

                <div className="form-group">
                    <label htmlFor="">具体</label>
                    <Editor value={text2Value} onChange={(value) => {
                        setText2Value(value);
                        setValue('text2', value);
                    }} />
                    <input type="hidden"   {...register("text2")} value={text2Value} />
                </div>

                <div className="form-group">
                    <label htmlFor="">転用</label>
                    <Editor value={text3Value} onChange={(value) => {
                        setText3Value(value);
                        setValue('text3', value);
                    }} />
                    <input type="hidden"   {...register("text3")} />
                </div>

                <Button type="submit" className={styles.darkButton}>回答する</Button>

            </Form>
        </div>
    )
}

export default AnswerForm

