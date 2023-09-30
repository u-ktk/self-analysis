import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { Question } from "../types";

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string | null;
}

type FormData = {
    text: string;
    user: number;
    question: number;
}

const AnswerForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    return (
        <div>
            <h3>このページは未実装</h3>

            <Form className='w-100 mx-auto' onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="">回答</label>
                    <input type="textarea" className="form-control border"  {...register("text")} />
                </div>
                <Button type="submit" className="btn btn-primary">回答する</Button>

            </Form>
        </div>
    )
}

export default AnswerForm

