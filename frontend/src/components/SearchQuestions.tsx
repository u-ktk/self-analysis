import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Question } from "../types";
import { getDefaultQuestions } from './api/DefaultQuestions';
import { useAuth } from './auth/Auth';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import style from './styles/Common.module.css';

type Inputs = {
    text__icontains: string;
    age__icontains: string;
};

const SearchQuestions = () => {
    const { accessToken } = useAuth();
    const { register, handleSubmit } = useForm<Inputs>();
    const [searchParamsByWord, setSearchParamsByWord] = useState<string>("");
    const [searchParamsByAge, setSearchParamsByAge] = useState<string>("");


    const navigate = useNavigate();

    // textの部分一致で質問を取得
    const onSubmitByWord: SubmitHandler<Inputs> = (data) => {
        setSearchParamsByWord(data.text__icontains);

    };

    // 年代で質問を取得
    const onSubmitByAge: SubmitHandler<Inputs> = (data) => {
        setSearchParamsByAge(data.age__icontains);
    };


    // 検索したら、別のページに遷移(SearchResults.tsx)

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        if (searchParamsByWord) {
            navigate(`/search?text=${encodeURIComponent(searchParamsByWord)}`);
        } else if (searchParamsByAge) {
            navigate(`/search?age=${encodeURIComponent(searchParamsByAge)}`);
        }
    }, [accessToken, searchParamsByWord, searchParamsByAge]);

    return (
        <div className='d-flex justify-content-center'>
            <div className=' p-2 '>
                <div>フリーワードで選ぶ</div>
                <div className='d-flex'>
                    <Form className="w-150" onSubmit={handleSubmit(onSubmitByWord)}>
                        <Form.Control
                            style={{ borderColor: '#8F7A59' }}
                            type="text"
                            placeholder='フリーワードを入力'
                            {...register('text__icontains')}
                        />
                        <Button className={style.button} type="submit">
                            検索
                        </Button>
                    </Form>
                </div>
            </div>

            <div className='p-2 '>
                <div>年代で選ぶ</div>
                <Form className="w-150 " onSubmit={handleSubmit(onSubmitByAge)} ></Form>
                {/* <Form.Control
                    type="text"
                    placeholder='年代を選択'
                    {...register('text__icontains')}
                />
                 */}
                <Dropdown>
                    <Dropdown.Toggle style={{ backgroundColor: '#FAFAFA', color: 'black', borderColor: '#8F7A59' }} id="dropdown-basic">
                        年代を選択
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item className='' onClick={() => setSearchParamsByAge('幼少期')}>幼少期</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchParamsByAge('小学校')}>小学校</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchParamsByAge('中学校')}>中学校</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchParamsByAge('高校')}>高校</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchParamsByAge('大学')}>大学</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchParamsByAge('社会人（20代）')}>社会人（20代）</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchParamsByAge('現在')}>現在</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchParamsByAge('未来')}>未来</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button className={style.button} type="submit">
                    検索
                </Button>

            </div>
        </div>
    );
};

export default SearchQuestions;
