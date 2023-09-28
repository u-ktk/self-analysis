import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAuth } from './Auth';
import { useNavigate } from 'react-router-dom';
import style from '../styles/Common.module.css'

const Logout = () => {
    const [showModal, setShowModal] = useState(false);
    const { accessToken, setAccessToken, userName } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (accessToken) {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
        }
        setShowModal(false);
        navigate('/')

    };

    return (
        <>
            <div className={style.bg}>
                <h4 className={style.title}>ログアウト</h4>
                <div style={{ "marginLeft": "100px" }}>
                    <Button className={style.button} variant='danger' onClick={() => setShowModal(true)}>ログアウトする</Button>
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>ログアウトの確認</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ログアウトしますか？
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className={style.button} variant="warning" onClick={() => setShowModal(false)}>
                            キャンセル
                        </Button>
                        <Button className={style.button} variant="danger" onClick={handleLogout}>
                            ログアウト
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default Logout;
