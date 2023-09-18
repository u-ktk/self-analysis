import React, { useState, useEffect, useRef } from 'react';
import { Question } from "../../types";
import { getDefaultQuestions } from '../../components/api/GetDefaultQuestions';
import { useAuth } from '../../components/auth/Auth';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import HeadTitle from '../../components/layouts/HeadTitle';

const DefaultQuestionsList = () => {
    const { accessToken } = useAuth();
    const [defaultQuestions, setDefaultQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentCategory, setCurrentCategory] = useState<string>("");
    const tableRef = useRef<HTMLTableElement>(null);
    let { page } = useParams<string>();

    const currentPage = parseInt(page ? page : "1");
    console.log(currentPage)
    // アクセストークンを使って質問一覧を取得
    useEffect(() => {
        if (!accessToken) {
            return;
        }
        getDefaultQuestions({ accessToken })
            .then((data) => {
                setDefaultQuestions(data);
                // カテゴリー名を取得
                if (data[0]) {
                    setCurrentCategory(data[currentPage * 100 - 1].category_name);
                } else {
                    setCurrentCategory("No category");
                }
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
            <HeadTitle title={currentCategory} />

            <p>{currentCategory}</p>
            {accessToken ? (
                <>
                    <Table striped bordered hover responsive className=" m-4" ref={tableRef}>
                        {/* 768px以上なら１行に２列表示、それ以下なら1列表示 */}

                        {windowWidth >= 768 ? (
                            <>

                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>質問</th>
                                        <th>No.</th>

                                        <th>質問</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentQuestions.map((question, index) => {
                                        //　奇数の質問は左側の列、偶数の質問は右側の列
                                        if (index % 2 === 0) {
                                            return (
                                                <tr key={question.id}>
                                                    {/* <td>{question.subcategory}</td> */}
                                                    <td>{question.id}</td>
                                                    <td><a href={`/questions/default/${question.id}/`}>{question.text}({question.age})</a></td>
                                                    {/* <td>{currentQuestions[index + 50].subcategory}</td> */}
                                                    <td>{currentQuestions[index + 1].id}</td>
                                                    <td><a href={`/questions/default/${question.id + 1}/`}>{currentQuestions[index + 1].text}({currentQuestions[index + 1].age})</a></td>
                                                </tr>
                                            )
                                        };
                                        return null;
                                    })}
                                </tbody>
                            </>
                        ) : (
                            <>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>質問</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentQuestions.map((question) => (
                                        <tr key={question.id}>
                                            <td>{question.id}</td>
                                            <td><a href={`/questions/default/${question.id}/`}>{question.text}({question.age})</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}


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
