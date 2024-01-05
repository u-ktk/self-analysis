import React, { useState, useEffect } from 'react'
import style from '../../components/styles/Common.module.css'
import userInfoStyle from '../../components/styles/UserInfo.module.css'
import { changeUserInfo } from '../../components/api/UserInfo';
import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import formStyle from '../../components/styles/Form.module.css';
import ShowMsg from '../../components/layouts/ShowMsg';
import loadStyle from '../../components/styles/Loading.module.css';

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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


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
                setSuccessMessage("ユーザー名を編集しました")
                if (errorMessage) {
                    setErrorMessage(null);
                }
                // setTimeout(() => {
                //     setSuccessMessage(null);
                // }, 5000);
            }
        } catch (error: any) {
            // 
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
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
                setSuccessMessage("メールアドレスを編集しました")
                if (errorMessage) {
                    setErrorMessage(null);
                }
            }
        } catch (error: any) {
            // 
            if (error instanceof Error) {
                setErrorMessage(error.message);
                if (successMessage) {
                    setSuccessMessage(null);
                }
            }
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

                {/* 成功メッセージ */}
                {successMessage &&
                    <ShowMsg message={successMessage} isSuccess={true} />
                }

                {/* エラーメッセージ */}
                {errorMessage &&
                    <ShowMsg message={errorMessage} isSuccess={false} />
                }





                <Row className={userInfoStyle.subContainer}>
                    <Col md={4} xs={5}>
                        <span className={userInfoStyle.key}>ユーザー名：</span>
                    </Col>
                    <Col md={4} sm={7}>
                        {!isNameEditing ? (
                            <span className={userInfoStyle.value} > {showName || userName}</span>
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


                    <Col md={4} sm={9} className='mt-2'>
                        {!isNameEditing ? (
                            <div className={userInfoStyle.editButton}>
                                <Button onClick={nameChangeClick} className={style.lightButton} size="sm" >編集する</Button>
                            </div>
                        )
                            : (
                                <div className={userInfoStyle.editButton}>
                                    <Button className={style.darkButton} size="sm" onClick={() => nameSaveClick(changeName ?? "")}>保存</Button>
                                    <Button className={style.lightButton} size="sm" onClick={nameChangeClick} >キャンセル</Button>
                                </div>
                            )}
                    </Col>

                </Row>





                <Row className={userInfoStyle.subContainer}>
                    <Col md={4} xs={5}>
                        <span className={userInfoStyle.key}>メールアドレス：</span>
                    </Col>
                    <Col md={4} xs={7}>
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
                    </Col>
                    <Col md={4} sm={9} >

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