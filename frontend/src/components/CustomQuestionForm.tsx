import React from 'react'
import { Question, Answer } from "../types";
import { Button, Form } from "react-bootstrap";

import { useForm, SubmitHandler } from 'react-hook-form'

type Props = {
    onSubmit: SubmitHandler<FormData>
    errorMessage: string | null
}

type FormData = {
    text: string
    age?: string
    answers?: Answer | undefined;
    category?: string | undefined;
    // created_at: string;
    created_at: Date;
}


const CustomQuestionForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();
    // 現在の日時を取得
    const currentDateTime = new Date();
    const currentDateTimeString = currentDateTime.toISOString();
    return (
        <div>
            <h3>質問を作る</h3>
            <div>「メモの魔力」で用意されていないオリジナル質問を作成することができます。</div>

            <Form className='w-100 mx-auto' onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <div>
                        <label htmlFor="">質問<span style={{ color: '#AC8D73' }}>*</span></label>
                        <input type="textarea" className="form-control border"  {...register("text")} />
                    </div>
                    <div>
                        <label htmlFor="">年代</label>
                        <input type="textarea" className="form-control border"  {...register("age")} />
                    </div>
                    <div>
                        <label htmlFor="">フォルダ</label>
                        <input type="textarea" className="form-control border"  {...register("age")} />
                    </div>


                    <Button type="submit" className="btn btn-primary">作成</Button>
                </div>
            </Form>
        </div>
    )
}

export default CustomQuestionForm