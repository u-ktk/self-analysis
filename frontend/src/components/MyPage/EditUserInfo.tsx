import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/Auth';
import style from '../styles/Common.module.css'
import userInfoStyle from '../styles/UserInfo.module.css'
import { changeUserInfo } from '../api/UserInfo';
import { Button, Row, Col, Form } from 'react-bootstrap';

type authInfo = {
    accessToken: string | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
}

const UserInfo = (props: authInfo) => {
    // const { accessToken, userId, userName, userEmail } = useAuth()
    const { accessToken, userId, userName, userEmail } = props
    const [isNameEditing, setIsNameEditing] = useState(false)
    const [isEmailEditing, setIsEmailEditing] = useState(false)
    const [changeName, setChangeName] = useState<string>("")
    const [showName, setShowName] = useState<string>("")
    const [changeEmail, setChangeEmail] = useState<string>("")
    const [showEmail, setShowEmail] = useState<string>("")
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)



    const nameChangeClick = () => {
        setIsNameEditing(!isNameEditing)
    }
    const emailChangeClick = () => {
        setIsEmailEditing(!isEmailEditing)
    }



    const nameSaveClick = async (changeName: string) => {
        if (!accessToken || !userId) {
            return;
        }

        try {
            let res;
            res = await changeUserInfo({ userId, newName: changeName, accessToken })
            if (res) {
                setChangeName("")
                setShowName(changeName)
                setIsNameEditing(false)
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const emailSaveClick = async (changeName: string) => {
        if (!accessToken || !userId) {
            return;
        }

        try {
            let response;
            response = await changeUserInfo({ userId, newEmail: changeEmail, accessToken })
            if (response) {
                setChangeEmail("")
                setShowEmail(changeName)
                setIsEmailEditing(false)
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

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
        <div className={style.bg}>
            <h4 className={style.title}>プロフィール編集</h4>
            <div className={userInfoStyle.contents}>
                <Row>

                    {windowWidth < 600 ? (
                        <>
                            <div className={userInfoStyle.key}>ユーザー名：</div>

                            {!isNameEditing ? (
                                <div className={userInfoStyle.value}>{showName || userName}</div>

                            ) : (
                                <Form
                                    className={userInfoStyle.form}
                                >
                                    <input
                                        type="text"
                                        value={changeName || ""}
                                        onChange={(e) => setChangeName(e.target.value)}
                                    />
                                </Form>

                                // </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Col className={userInfoStyle.subContainer}>
                                <span className={userInfoStyle.key}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ユーザー名：</span>
                                {!isNameEditing ? (
                                    <span className={userInfoStyle.value}>{showName || userName}</span>

                                ) : (
                                    <span className={userInfoStyle.form}>
                                        <input
                                            type="text"
                                            value={changeName || ""}
                                            onChange={(e) => setChangeName(e.target.value)}
                                        />

                                    </span>
                                )}
                            </Col>

                        </>
                    )
                    }

                    <Col xs={3}>
                        {!isNameEditing ? (
                            <div className={userInfoStyle.editButton}>
                                <Button onClick={nameChangeClick} className={style.lightButton} size="sm" variant="outline-primary">編集する</Button>
                            </div>
                        ) : (
                            <div className={userInfoStyle.editButton}>
                                <Button className={style.darkButton} size="sm" onClick={() => nameSaveClick(changeName ?? "")} variant="primary" >保存</Button>
                                <Button className={style.lightButton} size="sm" onClick={nameChangeClick} variant="outline-primary">キャンセル</Button>
                            </div>
                        )
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className={userInfoStyle.subContainer}>
                        <span className={userInfoStyle.key}>メールアドレス：</span>
                        {!isEmailEditing ? (
                            <span className={userInfoStyle.value} > {showEmail || userEmail}</span>
                        ) : (
                            <span className={userInfoStyle.form}>
                                <input
                                    type="text"
                                    value={changeEmail || ""}
                                    onChange={(e) => setChangeEmail(e.target.value)}
                                />
                            </span>
                        )}

                        {!isEmailEditing ? (
                            <div className={userInfoStyle.editButton}>
                                <Button onClick={emailChangeClick} className={style.lightButton} size="sm" variant="outline-primary">編集する</Button>
                            </div>
                        )
                            : (
                                <div className={userInfoStyle.editButton}>
                                    <Button className={style.darkButton} size="sm" variant="primary" onClick={() => emailSaveClick(changeEmail ?? "")}>保存</Button>
                                    <Button className={style.lightButton} size="sm" onClick={emailChangeClick} variant="outline-primary">キャンセル</Button>
                                </div>
                            )}
                    </Col>
                </Row>
            </div>
        </div >
    );

}

export default UserInfo