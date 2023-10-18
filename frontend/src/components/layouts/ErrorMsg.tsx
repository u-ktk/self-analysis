import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap';
import formStyles from '../styles/Form.module.css';
import closeIcon from '../../images/icon/close.svg';
import errorIcon from '../../images/icon/error.svg';

type ErrorMsgProps = {
    message: string;
}


const ErrorMsg = ({ message }: ErrorMsgProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        if (message) {
            setErrorMessage(message);
        }
    }
        , [message]);

    return (
        <>
            {/* エラーメッセージ */}
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

export default ErrorMsg