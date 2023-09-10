import React, { useState, useEffect } from 'react';
import { Question } from "../types";
import { getDefaultQuestions } from './api/GetDefaultQuestions';
import { useAuth } from './auth/Auth';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type Inputs = {
    text__icontains: string;
};

const SearchQuestions = () => {
    const { accessToken } = useAuth();
    const { register, handleSubmit } = useForm<Inputs>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [searchParams, setSearchParams] = useState<string>("");
    const navigate = useNavigate();

    // textの部分一致で質問を取得
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setSearchParams(data.text__icontains);
    };

    useEffect(() => {
        if (!accessToken || !searchParams) {
            return;
        }
        navigate(`/search?text=${encodeURIComponent(searchParams)}`)
    }, [accessToken, searchParams]);

    return (
        <div>
            <Form className="w-50 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <Form.Control
                    type="text"
                    placeholder='フリーワードを入力'
                    {...register('text__icontains')}
                />
                <Button variant="primary" type="submit">
                    検索
                </Button>
            </Form>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
    );
};

export default SearchQuestions;
