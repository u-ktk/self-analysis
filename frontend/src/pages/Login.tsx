import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";
import LoginForm from "../components/LoginForm";
import HeadTitle from "../components/layouts/HeadTitle";
import FetchToken from "../components/auth/FetchToken";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

export default function Login() {
    const navigate = useNavigate();
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
                //localStorageにアクセストークンを格納
                localStorage.setItem('accessToken', newAccessToken);
                setAccessToken(newAccessToken);
                navigate('/');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail);
                console.log(errorData.detail);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    }

    return (
        <>
            <HeadTitle title='ログイン' />
            {accessToken ? (
                <>
                    <div>{userName}さんとしてログイン中です</div>
                    <a className="m-2" href="/">トップページへ</a>
                    <a className="m-2" href="/logout">ログアウト</a>
                </>
            ) : (
                <div>
                    <LoginForm onSubmit={onSubmit} errorMessage={errorMessage} />
                </div>
            )}
        </>
    );
}