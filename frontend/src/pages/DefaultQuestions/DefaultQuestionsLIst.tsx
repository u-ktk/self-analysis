import React, { useState, useEffect, useRef } from 'react';
import { Question } from "../../types";
import { getDefaultQuestions } from '../../components/api/GetDefaultQuestions';
import { useAuth } from '../../components/auth/Auth';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const DefaultQuestionsList = () => {
    const { accessToken } = useAuth();
    const [defaultQuestions, setDefaultQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const tableRef = useRef<HTMLTableElement>(null);
    let { page } = useParams<string>();

    // アクセストークンを使って質問一覧を取得
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
    }, [accessToken, page]);

    //画面サイズが変更されたら再描画
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    if (!defaultQuestions) {
        return <div>loading...</div>;
    }

    const currentPage = parseInt(page ? page : "1");
    const questionsPerPage = 100;
    //無効なページ番号の場合はエラーを表示
    if (!currentPage || currentPage < 1 || currentPage > 10) {
        return <div>ページが存在しません。</div>;
    }

    //ページに表示する質問を指定
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = defaultQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    // console.log(currentQuestions)





    return (
        <>
            {accessToken ? (
                <>
                    <Table striped bordered hover responsive className=" m-4" ref={tableRef}>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>質問</th>
                                {/* 768px以上の画面サイズでのみ表示 */}
                                {windowWidth >= 768 && (
                                    <>
                                        <th>No.</th>
                                        <th>質問</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentQuestions.map((question, index) => (
                                <tr key={question.id}>
                                    <td>{question.id}</td>
                                    <td><a href="#">{question.text}</a></td>
                                    {windowWidth >= 768 && (
                                        <>
                                            <td>{question.id}</td>
                                            <td>
                                                {/* <a href="#">{currentQuestions[index + 1].text}</a> */}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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

export default DefaultQuestionsList;
