import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth";

const BACKEND_URL = process.env.BACKEND_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export default function Register() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { accessToken, userName } = useAuth();

    const onSubmit = async (data: { username: string, email: string, password: string }) => {
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
                router.push(`${NEXTAUTH_URL}login`);
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
                        <title>アカウント登録</title>
                    </Head>
                    <RegisterForm onSubmit={onSubmit} errorMessage={errorMessage} />
                </div>

            )}
        </>
    );

}
