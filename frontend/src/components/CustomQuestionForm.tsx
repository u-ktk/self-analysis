import React, { useState } from 'react'
import { Question, Answer } from "../types";
import { Button, Form, Dropdown, FormGroup } from "react-bootstrap";
import open from '../images/icon/open.svg';
import formStyle from '../components/styles/Form.module.css';
import { useAuth } from './auth/Auth';

import { useForm, SubmitHandler } from 'react-hook-form'

type Props = {
    onSubmit: SubmitHandler<FormData>
    errorMessage: string | null
}

type FormData = {
    text: string
    age?: string
    folder?: string | undefined;
    answer?: Answer | undefined;
}


const CustomQuestionForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();
    // 現在の日時を取得
    // const currentDateTime = new Date();
    // const currentDateTimeString = currentDateTime.toISOString();
    const [searchParamsByAge, setSearchParamsByAge] = useState<string>("");
    const [searchParamsByFolder, setSearchParamsByFolder] = useState<string>("");
    const { accessToken } = useAuth();

    return (
        <>
            <div className={formStyle.bg}>
                <div className={formStyle.description}>
                    <h4 className={formStyle.title}>質問を作る</h4>
                    <div>「メモの魔力」で用意されていないオリジナル質問を作成することができます。</div>
                    <div>&nbsp;使い方の例は
                        <a href='/help' className={formStyle.link}>こちら
                            <span>
                                <img alt="質問を探す" src={open} width="20" height="20"></img>
                            </span>
                        </a>
                    </div>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#AC8D73' }}>*</span>必須</p>

                </div>


                <Form className={formStyle.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}

                        <div className={formStyle.formGroup}>
                            <label htmlFor="">質問<span style={{ color: '#AC8D73' }}>*</span></label>
                            <input type="textarea" className="form-control border"  {...register("text")} />
                        </div>
                        <div className={formStyle.formGroup}>
                            <label htmlFor="">年代</label>
                            <Dropdown>
                                <Dropdown.Toggle style={{ backgroundColor: '#FAFAFA', color: 'black', borderColor: '#dddddd' }} id="dropdown-basic">
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
                        </div>
                        <div className={formStyle.formGroup}>
                            <label htmlFor="">フォルダ</label>
                            <Dropdown>
                                <Dropdown.Toggle style={{ backgroundColor: '#FAFAFA', color: 'black', borderColor: '#dddddd' }} id="dropdown-basic">
                                    フォルダを選択
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item className='' onClick={() => setSearchParamsByFolder('お気に入り')}>お気に入り</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSearchParamsByAge('あとで回答する')}>あとで回答する</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSearchParamsByAge('')}></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className={formStyle.formGroup}>
                            <label htmlFor="">回答</label>
                            <textarea className="form-control border"  {...register("answer")} rows={4} />
                        </div>


                        <Button type="submit" className={formStyle.button}>作成</Button>
                    </div>
                </Form>
            </div>

        </>
    )
}

export default CustomQuestionForm