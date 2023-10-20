import React, { useEffect, useState } from 'react';
import { Question, Answer } from '../../types';
import { Button, Form, Alert } from 'react-bootstrap';
import open from '../../images/icon/open.svg';
import { useAuth } from '../Auth/Token';
import Select from 'react-select';
import { getFolderList } from '../../components/api/Folder';
import style from '../../components/styles/Common.module.css';
import formStyle from '../../components/styles/Form.module.css';

import ShowMsg from '../../components/layouts/ShowMsg';

import { useForm, SubmitHandler } from 'react-hook-form';

type Props = {
    accessToken: string | null;
    userId: string | null;
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string | null;
    successMessage: string | null;
};

type FormData = {
    text: string;
    age?: string;
    folders?: string[] | undefined;
    answer?: Answer | undefined;
};

const CustomQuestionForm: React.FC<Props> = ({ accessToken, userId, onSubmit: onSubmitHandler, successMessage, errorMessage }) => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();

    const [selectAge, setSelectAge] = useState<string>("");
    const [selectFolders, setSelectFolders] = useState<string[] | undefined>(undefined);
    // const { accessToken, userId } = useAuth();
    const [folderOptions, setFolderOptions] = useState<any[]>([]);

    // 年代の設定
    const handleAgeSelection = (selectedAge: any) => {
        setSelectAge(selectedAge.value);
    };

    // フォルダの設定
    const handleFolderSelection = (selectedOption: any) => {
        if (!selectedOption) {
            setSelectFolders([]);
            return;
        }
        const selectedFolderValues = selectedOption.map((option: any) => option.value.toString());
        setSelectFolders(selectedFolderValues);
        // console.log(selectedFolderValues)
    };

    // フォームの送信時の処理
    const onSubmit = (data: FormData) => {
        // 選択された年代とフォルダをフォームデータに追加
        data.age = selectAge;
        data.folders = selectFolders;
        onSubmitHandler(data);

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


    // フォルダ一覧を取得
    useEffect(() => {
        if (!accessToken || !userId) {
            return;
        }
        const fetchData = async () => {
            if (!accessToken) {
                return;
            }
            try {
                const res = await getFolderList({ accessToken, userId });
                if (res) {
                    const folderOptions = res.map((folder) => {

                        return { value: folder.id, label: folder.name };
                    });
                    setFolderOptions(folderOptions);
                }
            } catch (err: any) {
                console.log(err.message);
            }
        };
        fetchData();
    },
        [accessToken, userId]
    );





    return (
        <>
            <div className={style.bg}>
                <div className={formStyle.contents}>

                    <h4 className={formStyle.title}>質問を作る</h4>

                    {/* 作成成功メッセージ */}
                    {successMessage &&
                        <ShowMsg message={successMessage} isSuccess={true} />
                    }

                    {/* エラーメッセージ */}
                    {errorMessage &&
                        <ShowMsg message={errorMessage} isSuccess={false} />
                    }

                    {/* 説明 */}
                    <div className={formStyle.description}>

                        <div>「メモの魔力」で用意されていないオリジナル質問を作成することができます。</div>
                        <div>
                            &nbsp;使い方の例は
                            <a href='/help' className={formStyle.link}>
                                こちら
                                <span>
                                    <img alt="質問を探す" src={open} width="20" height="20"></img>
                                </span>
                            </a>
                        </div>
                        <p style={{ fontSize: '14px' }}>
                            <span style={{ color: '#AC8D73' }}>*</span>必須
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={`form-group ${formStyle.formGroup}`}>
                            <label htmlFor="text">質問<span style={{ color: '#AC8D73' }}>*</span></label>
                            <input
                                type="text"
                                className={`form-control ${formStyle.wideForm}`}
                                {...register("text")}
                            />
                        </div>

                        <div className={formStyle.formGroup}>
                            <label htmlFor="">年代<span style={{ color: '#AC8D73' }}>*</span></label>
                            <Select
                                value={ageOptions.find(option => option.value === selectAge)}
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
                        <div className={formStyle.formGroup}>
                            <label htmlFor="">フォルダ</label>
                            <Select
                                isMulti
                                options={folderOptions}
                                onChange={handleFolderSelection}
                                placeholder="フォルダを選択もしくは検索"
                                noOptionsMessage={() => "選択肢がありません"}
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
                                    // 選択肢の背景色変更
                                    option: (baseStyles, state) => ({
                                        ...baseStyles,
                                        backgroundColor: '#FAFAFA',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                        },
                                    }),
                                    // 削除ボタンの色変更
                                    multiValueRemove: (baseStyles, state) => ({
                                        ...baseStyles,
                                        color: '#AC8D73',
                                        '&:hover': {
                                            color: '#AC8D73',
                                            backgroundColor: '#E8DBD1',

                                        },
                                    }),
                                    multiValue: (baseStyles, state) => ({
                                        ...baseStyles,
                                        // backgroundColor: '#e8dbd195',
                                    }),


                                }}
                            />
                        </div>

                        <div className={formStyle.formGroup}>
                            <label htmlFor="">回答</label>
                            <textarea className="form-control border" {...register("answer")} rows={4} />
                        </div>

                        <Button type="submit" className={`mt-2 ${style.darkButton}`} variant="primary">作成</Button>
                    </form>
                </div>
            </div>

        </>
    );
};

export default CustomQuestionForm;
