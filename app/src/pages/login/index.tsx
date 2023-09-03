import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Head from "next/head";
import { Button, Form } from "react-bootstrap";
// import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth";

const BACKEND_URL = process.env.BACKEND_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

type FormData = {
    email: string;
    password: string;
};

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const { data: session, status } = useSession();
    const { accessToken, setAccessToken, userName } = useAuth();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { email, password } = data;

        try {
            const response = await fetch(`${BACKEND_URL}token/`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                const newAccessToken = responseData.access;
                localStorage.setItem('accessToken', newAccessToken);
                setAccessToken(newAccessToken)
                // console.log(newAccessToken)
                router.push(`${NEXTAUTH_URL}`)


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
            {accessToken ? (
                <>
                    <div>{userName}さんとしてログイン中です</div>
                    <Link className="m-2" href="/">トップページへ</Link>
                    <Link className="m-2" href="/logout">ログアウト</Link>

                </>
            ) : (
                <div>
                    <Head>
                        <title>ログイン</title>
                    </Head>

                    <Form className="w-50 mx-auto " onSubmit={handleSubmit(onSubmit)}>
                        <div className="text-center text-2xl mb-5">
                            ログイン
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
                            <Button variant="primary" type="submit">ログイン</Button>
                        </div>
                    </Form>

                    {errorMessage && <p>{errorMessage}</p>}
                </div>
            )}
        </>
    );
}
