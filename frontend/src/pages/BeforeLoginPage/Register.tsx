import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/Auth/Token";
import RegisterForm from "../../features/Auth/RegisterForm";
import HeadTitle from "../../components/layouts/HeadTitle";
import formStyle from "../../components/styles/Form.module.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;


export default function Register() {

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
            
        }
    }


    const login = async (data: { email: string, password: string }) => {
        const { email, password } = data;

        try {
            const loginResponse = await fetch(`${BACKEND_URL}token/`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (loginResponse.ok) {
                const responseData = await loginResponse.json();
                const newAccessToken = responseData.access;
                const refreshToken = responseData.refresh;
                //localStorageにアクセストークンを格納
                localStorage.setItem('accessToken', newAccessToken);
                setAccessToken(newAccessToken);
                await saveRefreshToken(newAccessToken, refreshToken);
                navigate('/questions-list');
            } else {
                const errorData = await loginResponse.json();
                setLoginErrorMessage(errorData.detail);
                
            }
        } catch (error) {
            if (error instanceof Error) {
                setLoginErrorMessage([error.message]);
                
            }
        }
    }
    const [errorMessage, setErrorMessage] = useState<string[] | null>(null);
    const [loginErrorMessage, setLoginErrorMessage] = useState<string[] | null>(null);
    const { accessToken, setAccessToken, userName } = useAuth();
    const navigate = useNavigate();
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
                login({ email, password });

            }

            else {
                const errorData = await response.json();
                if (errorData.username) {
                    setErrorMessage(errorData.username);
                }
                if (errorData.email) {
                    setErrorMessage(errorData.email);
                }
                if (errorData.password) {
                    setErrorMessage(errorData.password);
                }
                
            }

        } catch (error) {
            if (error instanceof Error) {

                setErrorMessage([error.message]);
            }
        }
    }

    return (
        <>
            <HeadTitle title='アカウント登録' />
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
                    <RegisterForm onSubmit={onSubmit} errorMessages={errorMessage || loginErrorMessage} />
                </div>

            )}
        </>
    );

}
