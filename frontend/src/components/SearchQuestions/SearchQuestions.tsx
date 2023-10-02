import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Question } from "../../types";
import { getDefaultQuestions } from '../api/DefaultQuestions';
import { useAuth } from '../auth/Auth';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Dropdown } from 'react-bootstrap';
import Select from 'react-select';

import { useNavigate } from 'react-router-dom';
import style from '../styles/Common.module.css';
import searchStyle from '../styles/Search.module.css';



type Inputs = {
    text__icontains: string;
    age__icontains: string;
};

const SearchQuestions = () => {
    const { accessToken } = useAuth();
    const { register, handleSubmit } = useForm<Inputs>();
    const [searchParamsByWord, setSearchParamsByWord] = useState<string>("");
    const [searchParamsByAge, setSearchParamsByAge] = useState<string>("");
    const handleAgeSelection = (selectedAge: any) => {
        setSearchParamsByAge(selectedAge.value);
    };


    const navigate = useNavigate();

    // textの部分一致で質問を取得
    const onSubmitByWord: SubmitHandler<Inputs> = (data) => {
        setSearchParamsByWord(data.text__icontains);

    };

    // 年代で質問を取得
    const onSubmitByAge: SubmitHandler<Inputs> = (data) => {
        setSearchParamsByAge(data.age__icontains);
    };

    // 年代の選択肢
    const ageOptions = [
        "幼少期",
        "小学校",
        "中学校",
        "高校",
        "大学",
        "社会人（20代）",
        "現在",
        "未来",
    ].map((age) => {
        return { value: age, label: age };
    }
    );



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
        <div className={searchStyle.bg}>
            <h4 className={style.title}>質問を検索</h4>
            <div className={searchStyle.contents}>
                <div className={searchStyle.search}>
                    <div className='mb-2'>フリーワードで選ぶ</div>
                    <div >
                        <form onSubmit={handleSubmit(onSubmitByWord)} className={searchStyle.formContainer}>
                            <input
                                className={`form-control ${searchStyle.narrowForm}`}
                                type="text"
                                placeholder='フリーワードを入力'
                                {...register('text__icontains')}
                            />
                            <Button className={style.darkButton} type="submit">
                                検索
                            </Button>
                        </form>
                    </div>
                </div>

                <div className={searchStyle.search}>
                    <div className='mb-2'>年代で選ぶ</div>
                    <Select
                        value={ageOptions.find(option => option.value === searchParamsByAge)}
                        onChange={handleAgeSelection}
                        options={ageOptions}
                        placeholder="年代を選択"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 5,
                            colors: {
                                // ホバーしたときの色変更
                                ...theme.colors,
                                primary25: '#DEE2E6',
                                primary: '#DEE2E6',
                            },
                        })
                        }
                        styles={{
                            // 枠線の背景色変更
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: '#FAFAFA',
                                borderColor: '#DEE2E6',
                                '&hover': {
                                    borderColor: '#DEE2E6',
                                }
                            }),
                            option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: '#FAFAFA',
                                '&:hover': {
                                    backgroundColor: 'white',
                                },
                            }),
                        }}
                    />
                </div>

                {/* <form onSubmit={handleSubmit(onSubmitByAge)} > */}
                {/* <Form.Control
                    type="text"
                    placeholder='年代を選択'
                    {...register('text__icontains')}
                />
                 */}
                {/* <Dropdown>
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
                </Dropdown> */}

                {/* <Button className={style.button} type="submit">
                    検索
                </Button> */}
                {/* </form> */}
            </div >
        </div>
    );
};

export default SearchQuestions;
