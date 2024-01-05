import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form, Alert } from "react-bootstrap";
import formStyle from '../../components/styles/Form.module.css';
import style from '../../components/styles/Common.module.css';
import error from '../../images/icon/error.svg';

type FormData = {
    email: string;
    password: string;
};

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string[] | null;
}

const LoginForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const { register, handleSubmit } = useForm<FormData>();

    return (
        <div className={formStyle.bg}>
            <Form className="w-50 mx-auto " onSubmit={handleSubmit(onSubmit)}>
                <h3 className={formStyle.title}>
                    ログイン
                </h3>

                {errorMessage &&
                    <Alert className={formStyle.alert}>
                        <span>
                            <img alt="エラー" src={error} width="40" height="40"></img>
                        </span>
                        <div className={formStyle.msg}>

                            {errorMessage}
                        </div>
                    </Alert>}

                <div className={formStyle.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control border" placeholder="xxx@example.com" {...register("email", { required: "Email is required" })} />
                    {/* {errors.email && <p className="text-danger">{errors.email.message}</p>} */}
                </div>

                <div className={formStyle.formGroup}>
                    <label htmlFor="password">パスワード:</label>
                    <input type="password" className="form-control border" placeholder="******" {...register("password", { required: "Password is required" })} />
                    {/* {errors.password && <p className="text-danger">{errors.password.message}</p>} */}
                </div>

                <Button className={formStyle.button} variant="outline-primary" type="submit">ログイン</Button>
            </Form>

        </div>
    );
}

export default LoginForm;
