import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form, Alert } from "react-bootstrap";
import formStyle from '../styles/Form.module.css';
import style from '../styles/Common.module.css';
import error from '../../images/icon/error.svg';


type FormData = {
    username: string;
    email: string;
    password: string;
};

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessages: string[] | null;
}

const RegisterForm: React.FC<Props> = ({ onSubmit, errorMessages }) => {
    const { register, handleSubmit } = useForm<FormData>();

    return (
        <div className={formStyle.bg}>
            <Form className="w-50 mx-auto " onSubmit={handleSubmit(onSubmit)}>
                <h3 className={formStyle.title}>
                    新規登録
                </h3>

                {errorMessages &&
                    <Alert className={formStyle.alert}>
                        <span>
                            <img alt="エラー" src={error} width="40" height="40"></img>
                        </span>
                        <div className={formStyle.msg}>

                            {errorMessages.map((message, index) => (
                                <p key={index} >{message}</p>
                            ))}

                        </div>
                    </Alert>}

                <div className={formStyle.formGroup}>
                    <label htmlFor="username">ユーザー名:</label>
                    <input type="text" className="form-control border" placeholder="ユーザー名を入力" {...register("username", { required: "Username is required" })} />
                </div>

                <div className={formStyle.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control border" placeholder="xxx@example.com" {...register("email", { required: "Email is required" })} />
                </div>

                <div className={formStyle.formGroup}>
                    <label htmlFor="password">パスワード(6文字以上):</label>
                    <input type="password" className="form-control border" placeholder="******" {...register("password", { required: "Password is required" })} />
                </div>

                <Button className={formStyle.button} variant="outline-primary" type="submit" >登録</Button>
            </Form>
        </div>
    );
}

export default RegisterForm;