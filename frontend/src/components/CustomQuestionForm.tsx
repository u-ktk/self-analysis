import React, { useEffect, useState } from 'react';
import { Question, Answer } from '../types';
import { Button, Form, Dropdown } from 'react-bootstrap';
import open from '../images/icon/open.svg';
import formStyle from '../components/styles/Form.module.css';
import { useAuth } from './auth/Auth';

import { useForm, SubmitHandler } from 'react-hook-form';

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string | null;
};

type FormData = {
    text: string;
    age?: string;
    folder?: string | undefined;
    answer?: Answer | undefined;
};

const CustomQuestionForm: React.FC<Props> = ({ onSubmit: onSubmitHandler, errorMessage }) => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();

    const [selectAge, setSelectAge] = useState<string>("");
    const [selectFolder, setSelectFolder] = useState<string>("");
    const { accessToken } = useAuth();

    // 年代の設定
    const handleAgeSelection = (selectedAge: string) => {
        setSelectAge(selectedAge);
    };

    // フォルダの設定
    const handleFolderSelection = (selectedFolder: string) => {
        setSelectFolder(selectedFolder);
    };

    // フォームの送信時の処理
    const onSubmit = (data: FormData) => {
        // 選択された年代とフォルダをフォームデータに追加
        data.age = selectAge;
        data.folder = selectFolder;
        onSubmitHandler(data);
    };

    return (
        <>
            <div className={formStyle.bg}>
                <div className={formStyle.description}>
                    <h4 className={formStyle.title}>質問を作る</h4>
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

                <Form className={formStyle.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}

                        <div className={formStyle.formGroup}>
                            <label htmlFor="">質問<span style={{ color: '#AC8D73' }}>*</span></label>
                            <input type="textarea" className="form-control border" {...register("text")} />
                        </div>
                        <div className={formStyle.formGroup}>
                            <label htmlFor="">年代<span style={{ color: '#AC8D73' }}>*</span></label>
                            <Dropdown>
                                <Dropdown.Toggle
                                    style={{ backgroundColor: '#FAFAFA', color: 'black', borderColor: '#dddddd' }}
                                    id="dropdown-basic"
                                >
                                    {selectAge ? selectAge : <span style={{ color: '#555555' }}>年代を選択</span>}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleAgeSelection('幼少期')}>幼少期</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAgeSelection('小学校')}>小学校</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAgeSelection('中学校')}>中学校</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAgeSelection('高校')}>高校</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAgeSelection('大学')}>大学</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAgeSelection('社会人（20代）')}>社会人（20代）</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAgeSelection('現在')}>現在</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAgeSelection('未来')}>未来</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className={formStyle.formGroup}>
                            <label htmlFor="">フォルダ</label>
                            <Dropdown>
                                <Dropdown.Toggle
                                    style={{ backgroundColor: '#FAFAFA', color: 'black', borderColor: '#dddddd' }}
                                    id="dropdown-basic-folder"
                                >
                                    {selectFolder ? selectFolder : <span style={{ color: '#555555' }}>フォルダを選択</span>}

                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleFolderSelection('お気に入り')}>お気に入り</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleFolderSelection('あとで回答する')}>あとで回答する</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className={formStyle.formGroup}>
                            <label htmlFor="">回答</label>
                            <textarea className="form-control border" {...register("answer")} rows={4} />
                        </div>

                        <Button type="submit" className={formStyle.button}>作成</Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default CustomQuestionForm;
