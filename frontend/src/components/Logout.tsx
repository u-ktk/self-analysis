import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAuth } from './auth/Auth';
import { useNavigate } from 'react-router-dom';
import HeadTitle from './layouts/HeadTitle';

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

            <div className="w-50 mx-auto ">

                <h3>{userName}さんとしてログイン中です</h3>
                <Button variant="primary" onClick={() => setShowModal(true)}>ログアウト</Button>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>ログアウトの確認</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ログアウトしますか？
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            キャンセル
                        </Button>
                        <Button variant="primary" onClick={handleLogout}>
                            ログアウト
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default Logout;
