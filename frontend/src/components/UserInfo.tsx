import React, { useState, useEffect } from 'react'
import { useAuth } from './auth/Auth';
import style from './styles/Common.module.css'
import { changeUserInfo } from './api/ChangeUserInfo';
import { Button } from 'react-bootstrap';
import { set } from 'react-hook-form';

const UserInfo = () => {
    const { accessToken, userId, userName, userEmail } = useAuth()
    const [isNameEditing, setIsNameEditing] = useState(false)
    const [isEmailEditing, setIsEmailEditing] = useState(false)
    const [changeName, setChangeName] = useState<string>("")
    const [showName, setShowName] = useState<string>(userName || "")
    const [changeEmail, setChangeEmail] = useState<string>("")
    const [showEmail, setShowEmail] = useState<string>(userEmail || "")



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
            let response;
            response = await changeUserInfo({ userId, newName: changeName, accessToken })
            if (response) {
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


    return (
        <>
            <h4 className={style.title}>プロフィール編集</h4>
            <div>
                <div>
                    <span>ユーザーネーム</span>
                    <span>{showName}</span>
                </div>
                {/* 名前変更中の場合、フォームを表示！ */}
                {isNameEditing ? (
                    <>
                        <input
                            type="text"
                            value={changeName || ""}
                            onChange={(e) => setChangeName(e.target.value)}
                        />
                        {<Button className={style.miniButton} onClick={() =>
                            nameSaveClick(changeName ?? "")
                        }>保存</Button>}
                    </>
                )
                    : (
                        <></>
                    )}

                <div>
                    {!isNameEditing ? (
                        <>
                            <Button onClick={nameChangeClick} className={style.miniButton} size="sm" variant="danger" >編集する</Button>
                        </>

                    )
                        : (
                            <>
                                <Button onClick={nameChangeClick} className={style.miniButton} size="sm" variant="warning">キャンセル</Button>
                            </>
                        )
                    }
                </div>
            </div>
            <div>
                <div>
                    <span>メールアドレス</span>
                    <span>{showEmail}</span>
                </div>
                {/* email変更中の場合*/}
                {isEmailEditing ? (
                    <>
                        <input
                            type="text"
                            value={changeEmail || ""}
                            onChange={(e) => setChangeEmail(e.target.value)}
                        />
                        {<Button className={style.miniButton} onClick={() =>
                            emailSaveClick(changeEmail ?? "")
                        }>保存</Button>}
                    </>
                )
                    : (
                        <></>
                    )}
                <div>
                    {!isEmailEditing ? (
                        <>
                            <Button onClick={emailChangeClick} className={style.miniButton} size="sm" variant="danger" >編集する</Button>
                        </>

                    )
                        : (
                            <>
                                <Button onClick={emailChangeClick} className={style.miniButton} size="sm" variant="warning">キャンセル</Button>
                            </>
                        )
                    }
                </div>
            </div>


            <div>UserInfo</div>
        </>
    )
}

export default UserInfo