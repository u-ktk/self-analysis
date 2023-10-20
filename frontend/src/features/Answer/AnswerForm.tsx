import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { Question } from "../../types";
import { Editor, SimpleEditor } from '../../components/layouts/Editor';
import styles from '../../components/styles/Common.module.css';
import formStyles from '../../components/styles/Form.module.css';
import openIcon from '../images/icon/open.svg';

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string | null;
    isEditing: boolean;
    isDefault: boolean;
    initialData?: { title: string, text1: string, text2: string, text3: string };
}

type FormData = {
    isDefault: boolean;
    title: string;
    text1: string;
    text2: string
    text3: string
    user: string;
}

const AnswerForm: React.FC<Props> = ({ onSubmit, errorMessage, isEditing, isDefault, initialData }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({

        defaultValues: {
            title: initialData?.title || '',
            text1: initialData?.text1 || '',
            text2: initialData?.text2 || '',
            text3: initialData?.text3 || '',
            isDefault: isDefault,
        },
    });

    const [titleValue, setTitleValue] = useState<string>(initialData?.title || '');
    const [text1Value, setText1Value] = useState<string>(initialData?.text1 || '');
    const [text2Value, setText2Value] = useState<string>(initialData?.text2 || '');
    const [text3Value, setText3Value] = useState<string>(initialData?.text3 || '');


    return (
        <div>



            <Form className=' mx-auto' onSubmit={handleSubmit(onSubmit)}>
                <div className={formStyles.formGroup}>

                    <label htmlFor="">標語（ファクトをまとめたもの）
                        <span style={{ color: '#AC8D73' }}>*</span>
                    </label>
                    {/* <Editor value={titleValue} onChange={setTitleValue} /> */}
                    <SimpleEditor value={titleValue} onChange={(value) => {
                        setTitleValue(value);
                        setValue('title', value);
                    }} />

                    <input type="hidden"  {...register("title")} />
                </div>

                <div className="form-group">
                    <label htmlFor="">ファクト
                        <span style={{ color: '#AC8D73' }}>*</span>
                    </label>
                    <Editor value={text1Value}
                        onChange={(value) => {
                            setText1Value(value);
                            setValue('text1', value);
                        }} />
                    <input type="hidden" {...register("text1")} />
                </div>

                <div className="form-group">
                    <label htmlFor="">抽象</label>
                    <Editor value={text2Value} onChange={(value) => {
                        setText2Value(value);
                        setValue('text2', value);
                    }} />
                    <input type="hidden"   {...register("text2")} />
                </div>

                <div className="form-group">
                    <label htmlFor="">転用</label>
                    <Editor value={text3Value} onChange={(value) => {
                        setText3Value(value);
                        setValue('text3', value);
                    }} />
                    <input type="hidden"   {...register("text3")} />
                </div>

                <input type="hidden" {...register("isDefault")} />


                <Button type="submit" className={styles.darkButton}>
                    {(isEditing) ? (
                        <span>編集する</span>
                    ) : (
                        <span>回答する</span>
                    )}

                </Button>


            </Form>
        </div>
    )
}

export default AnswerForm

