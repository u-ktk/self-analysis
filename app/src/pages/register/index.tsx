import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Head from "next/head";
import { Button, Form } from "react-bootstrap";
// import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const BACKEND_URL = process.env.BACKEND_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;


type FormData = {
    username: string;
    email: string;
    password: string;
};

export default function Register() {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { username, email, password } = data;

        try {
            const response = await fetch(`${BACKEND_URL}register/`, {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),

                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setErrorMessage("Registration successful!");

                // signIn('credentials', {
                //     callbackUrl: `${NEXTAUTH_URL}`,
                //     email,
                //     password
                // });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
            }

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    }

    return (
        <>
            {/* {session?.user ? (
                <Link href="/">{session?.user.name}さん</Link>
            ) : */}
            <div>
                <Head>
                    <title>アカウント登録</title>
                </Head>

                <Form className="w-50 mx-auto " onSubmit={handleSubmit(onSubmit)}>
                    <div className="text-center text-2xl mb-5">
                        アカウント登録
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" className="form-control border" placeholder="sample user" {...register("username", { required: "Username is required" })} />
                        {errors.username && <p className="text-danger">{errors.username.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control border" placeholder="xxx@example.com" {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control border" placeholder="******" {...register("password", { required: "Password is required" })} />
                        {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>

                    <div className="form-group">
                        {/* <button type="submit" className="btn btn-primary">Register</button> */}
                        <Button variant="primary" type="submit" >Register</Button>
                    </div>
                </Form>


                {errorMessage && <p>{errorMessage}</p>}
            </div>
            {/* } */}
        </>
    );
}
