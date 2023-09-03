import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";

type FormData = {
    username: string;
    email: string;
    password: string;
};

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string | null;
}

const RegisterForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    return (
        <div>
            <Form className="w-50 mx-auto " onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center text-2xl mb-5">
                    新規登録
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" className="form-control border" placeholder="username" {...register("username", { required: "Username is required" })} />
                    {errors.username && <p className="text-danger">{errors.username.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control border" placeholder="email" {...register("email", { required: "Email is required" })} />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" className="form-control border" placeholder="password" {...register("password", { required: "Password is required" })} />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>

                <div className="form-group">
                    <Button variant="primary" type="submit" >Register</Button>
                </div>
            </Form>

            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default RegisterForm;