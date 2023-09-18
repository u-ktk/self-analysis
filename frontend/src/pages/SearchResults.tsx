import React, { useEffect, useState } from 'react';
import { Question } from '../types';
import { useLocation } from 'react-router-dom';
import { getDefaultQuestions } from '../components/api/GetDefaultQuestions';
import { useAuth } from '../components/auth/Auth';
import { Table } from 'react-bootstrap';
import HeadTitle from '../components/layouts/HeadTitle';

type DefaultQuestionDetailListProps = {
    accessToken: string;
    text?: string;
    age?: string;
};

const SearchResults = () => {
    const location = useLocation();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const searchParams = new URLSearchParams(location.search);
    const textContains = searchParams.get('text');
    const ageContains = searchParams.get('age');
    const { accessToken } = useAuth();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    const fetchData = async () => {
        if (!accessToken || (!textContains && !ageContains)) {
            console.log('検索結果を取得できませんでした');
            return;
        }

        try {
            let response;

            if (textContains) {
                response = await getDefaultQuestions({ accessToken, text: textContains });
            } else if (ageContains) {
                response = await getDefaultQuestions({ accessToken, age: ageContains });
            }

            if (response) {
                setQuestions(response);
                console.log(response);
            }
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [accessToken, textContains, ageContains]);

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

    return (
        <>
            <HeadTitle title='検索結果' />

            <div>
                {(textContains || ageContains) && (
                    <div>
                        <h1>検索結果</h1>
                        {textContains && <div>検索ワード：{textContains}</div>}
                        {ageContains && <div>年代：{ageContains}</div>}

                        <Table striped bordered hover responsive className="m-4" >
                            {windowWidth > 768 ? (
                                <>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>質問</th>
                                            <th>カテゴリー</th>
                                            <th>No.</th>
                                            <th>質問</th>
                                            <th>カテゴリー</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((question, index) => {
                                            // 横に2列ずつ表示
                                            if (index % 2 === 0) {
                                                return (
                                                    <tr key={question.id}>
                                                        <td>{question.id}. </td>
                                                        <td><a href={`/questions/default/${question.id}/`}>{question.text}({question.age})</a></td>
                                                        <td>{question.category_name}</td>
                                                        <td>{questions[index + 1]?.id}. </td>
                                                        <td><a href={`/questions/default/${questions[index + 1]?.id}/`}>{questions[index + 1]?.text}({questions[index + 1]?.age})</a></td>
                                                        <td>{questions[index + 1]?.category_name}</td>
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
                                            <th>カテゴリー</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((question) => (
                                            <tr key={question.id}>
                                                <td>{question.id}. </td>
                                                <td><a href={`/questions/default/${question.id}/`}>{question.text}({question.age})</a></td>
                                                <td>{question.category_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </Table>

                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchResults;
