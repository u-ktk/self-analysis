import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import formStyle from '../styles/Form.module.css';
import style from '../styles/Common.module.css';

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
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    return (
        <div className={formStyle.bg}>
            <Form className="w-50 mx-auto " onSubmit={handleSubmit(onSubmit)}>
                <h3 className={formStyle.title}>
                    新規登録
                </h3>

                <div className={formStyle.formGroup}>
                    <label htmlFor="username">ユーザー名:</label>
                    <input type="text" className="form-control border" placeholder="ユーザー名を入力" {...register("username", { required: "Username is required" })} />
                    {errors.username && <p className="text-danger">{errors.username.message}</p>}
                </div>

                <div className={formStyle.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control border" placeholder="xxx@example.com" {...register("email", { required: "Email is required" })} />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>

                <div className={formStyle.formGroup}>
                    <label htmlFor="password">パスワード(6文字以上):</label>
                    <input type="password" className="form-control border" placeholder="******" {...register("password", { required: "Password is required" })} />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>

                <Button className={formStyle.button} variant="outline-primary" type="submit" >登録</Button>
            </Form>
            <div className={style.errorMsg}>
                {errorMessages &&
                    errorMessages.map((message, index) => (
                        <p key={index} >{message}</p>
                    ))}
            </div>
        </div>
    );
}

export default RegisterForm;