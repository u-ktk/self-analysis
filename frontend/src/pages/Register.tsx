import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";
import RegisterForm from "../components/RegisterForm";
import HeadTitle from "../components/layouts/HeadTitle";
// import FetchToken from "../components/auth/FetchToken";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;


export default function Register() {

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
                //localStorageにアクセストークンを格納
                localStorage.setItem('accessToken', newAccessToken);
                setAccessToken(newAccessToken);
                navigate('/');
            } else {
                const errorData = await loginResponse.json();
                setLoginErrorMessage(errorData.detail);
                console.log(errorData);
            }
        } catch (error) {
            if (error instanceof Error) {
                setLoginErrorMessage([error.message]);
                console.log(error.message);
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
                let errorMessages: string[] = [];
                const error = await response.json();
                if (error.username) {
                    // setErrorMessage(error.username);
                    errorMessages.push(error.username);
                }
                if (error.email) {
                    // setErrorMessage(error.email);
                    errorMessages.push(error.email);
                }
                if (error.password) {
                    // setErrorMessage(error.password);
                    errorMessages.push(error.password);
                }
                if (errorMessages.length > 0) {
                    setErrorMessage(errorMessages);
                } else {
                    setErrorMessage(null);
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
                    <div>{userName}さんとしてログイン中です</div>
                    <a className="m-2" href="/">トップページへ</a>
                    <a className="m-2" href="/logout">ログアウト</a>
                </>
            ) : (
                <div>
                    <RegisterForm onSubmit={onSubmit} errorMessages={errorMessage || loginErrorMessage} />
                </div>

            )}
        </>
    );

}
