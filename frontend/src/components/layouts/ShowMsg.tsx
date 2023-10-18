import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap';
import formStyles from '../styles/Form.module.css';
import closeIcon from '../../images/icon/close.svg';
import checkIcon from '../../images/icon/check.svg';
import errorIcon from '../../images/icon/error.svg';


type MsgProps = {
    message: string;
    isSuccess: boolean;
}

const ShowMsg = ({ message, isSuccess }: MsgProps) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)


    useEffect(() => {
        if (message && isSuccess) {
            setSuccessMessage(message);
            setErrorMessage(null);
        }
        else if (message) {
            setErrorMessage(message);
            setSuccessMessage(null);
        }
    }, [message]);


    return (
        <>

            {/* 成功メッセージの場合 */}
            {successMessage &&
                <Alert variant='primary' className={formStyles.alert}>
                    <span>
                        <img alt="作成成功" src={checkIcon} width="40" height="40" />
                    </span>
                    <div className={formStyles.msg}>
                        <div style={{ fontWeight: 'bold' }}>
                            {successMessage}
                        </div>
                        <div >
                            <img alt="閉じる" src={closeIcon} width="18" height="18" onClick={() => setSuccessMessage(null)} />
                        </div>
                    </div>
                </Alert>
            }

            {/* エラーメッセージの場合 */}
            {errorMessage &&
                <Alert className={formStyles.alert}>
                    <span>
                        <img alt="エラー" src={errorIcon} width="40" height="40"></img>
                    </span>
                    <div className={formStyles.msg}>
                        <div >
                            {errorMessage}
                        </div>
                        <div >
                            <img alt="閉じる" src={closeIcon} width="18" height="18" onClick={() => setErrorMessage(null)} />
                        </div>
                    </div>
                </Alert>}

        </>
    )
}

export default ShowMsg