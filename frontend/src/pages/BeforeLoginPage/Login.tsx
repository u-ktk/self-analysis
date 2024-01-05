import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/Auth/Token";
import LoginForm from "../../features/Auth/LoginForm";
import HeadTitle from "../../components/layouts/HeadTitle";
import formStyle from "../../components/styles/Form.module.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// リフレッシュトークンをDBに保存
const saveRefreshToken = async (accessToken: string, refreshToken: string) => {
    try {
        const res = await fetch(`${BACKEND_URL}refresh-token-save/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`,
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        if (res.ok) {
            return;
        }
    } catch (error) {
        console.log(error)
    }
}

export default function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string[] | null>(null);
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
                const refreshToken = responseData.refresh;
                //localStorageにアクセストークンを格納
                localStorage.setItem('accessToken', newAccessToken);
                setAccessToken(newAccessToken);
                await saveRefreshToken(newAccessToken, refreshToken);
                navigate('/questions-list');
            } else {
                const errorData = await response.json();
                if (errorData.email) setErrorMessage(errorData.email);
                if (errorData.password) setErrorMessage(errorData.password);
                if (errorData.detail) setErrorMessage(errorData.detail);
                console.log(errorData);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage([error.message]);
            }
        }
    }

    return (
        <>
            <HeadTitle title='ログイン' />
            {accessToken ? (
                <>
                    <div className={formStyle.bg}>
                        <div className={formStyle.title}>
                            {userName}さんとしてログイン中です
                        </div>
                        <div className={formStyle.formGroup}>
                            <a className={formStyle.link} href="/questions-list">トップページへ</a>
                        </div>
                        <div className={formStyle.formGroup}>
                            <a className={formStyle.link} href="/logout">ログアウト</a>
                        </div>
                    </div>

                </>
            ) : (
                <div>
                    <LoginForm onSubmit={onSubmit} errorMessage={errorMessage} />
                </div>
            )}
        </>
    );
}
