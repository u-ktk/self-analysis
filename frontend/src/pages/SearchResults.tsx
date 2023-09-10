import React, { useEffect, useState } from 'react'
import { Question } from "../types";
import { useLocation } from "react-router-dom";
import { getDefaultQuestions } from '../components/api/GetDefaultQuestions';
import { useAuth } from '../components/auth/Auth';
import { text } from 'stream/consumers';



const SearchResults = () => {
    const location = useLocation();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const searchParams = new URLSearchParams(location.search);
    const textContains = searchParams.get('text');
    const { accessToken } = useAuth();


    useEffect(() => {
        if (!accessToken || !textContains) {
            return;
        }
        getDefaultQuestions(accessToken, textContains)
            .then((data) => {
                setQuestions(data);
            })
            .catch((err) => {
                setErrorMessage(err.message);
            });
    }, [accessToken, searchParams]);


    return (
        <div>

            <h1>検索結果</h1>
            <div>検索ワード：{textContains}</div>
            {questions && questions.map((question) => (
                <div>
                    <span>{question.id}. </span>
                    <a href={`/questions/default/${question.id}/`}>
                        <span key={question.id}>{question.text}({question.subcategory})</span>
                    </a>
                </div>
            ))}

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

        </div>
    );
};

export default SearchResults;


