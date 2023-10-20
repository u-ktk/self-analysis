import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Question } from "../../types";
import { useAuth } from '../Auth/Token';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Dropdown } from 'react-bootstrap';
import Select from 'react-select';

import { useNavigate } from 'react-router-dom';
import style from '../../components/styles/Common.module.css';
import searchStyle from '../../components/styles/Search.module.css';



type Inputs = {
    text__icontains: string;
    age__icontains: string;
};

const SearchQuestionsByWords = () => {
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
                    <strong className='mb-2'>フリーワードで選ぶ</strong>
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
                    <strong className='mb-2'>年代で選ぶ</strong>
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
            </div >
        </div>
    );
};

export default SearchQuestionsByWords;
