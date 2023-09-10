import React, { useState, useEffect } from 'react';
import { Question } from "../types";
import getDefaultQuestions from '../components/api/GetDefaultQuestions';
import { useAuth } from '../components/auth/Auth';
import { Pagination } from 'react-bootstrap';

const QuestionList = () => {
    const { accessToken } = useAuth();

    const [defaultQuestions, setDefaultQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!accessToken) {
            return;
        }
        getDefaultQuestions(accessToken)
            .then((data) => {
                setDefaultQuestions(data);
            })
            .catch((err) => {
                setErrorMessage(err.message);
            });
    }, [accessToken]);

    if (!defaultQuestions) {
        return <div>loading...</div>;
    }




    //仮にDefaultQuestionsの一覧表示
    return (
        <>
            {accessToken ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category</th>
                                <th>Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defaultQuestions.map((question) => (
                                <tr key={question.id}>
                                    <td>{question.id}</td>
                                    <td>{question.category}</td>
                                    <td>{question.text}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {errorMessage && <p>{errorMessage}</p>}
                </>
            ) : (
                <>
                    <p>自己分析サイトを利用するには、ログインする必要があります。</p>
                    <a href="/register" className="m-5">登録</a>
                    <a href="/login" className="m-5">ログイン</a>
                </>
            )}

        </>
    )
}


export default QuestionList