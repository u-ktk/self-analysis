import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth";
import LoginForm from "@/components/auth/LoginForm";

const BACKEND_URL = process.env.BACKEND_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export default function Login() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { accessToken, setAccessToken, userName } = useAuth();

    const onSubmit = async (data: { email: string, password: string }) => {
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
                setAccessToken(newAccessToken);
                router.push(`${NEXTAUTH_URL}`);
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
                    <LoginForm onSubmit={onSubmit} errorMessage={errorMessage} />
                </div>
            )}
        </>
    );
}
