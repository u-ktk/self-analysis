import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import LogoutModal from '../../components/auth/LogoutModal';

const Logout = () => {
    return (
        <>
            <HeadTitle title='ログアウト' />
            <LogoutModal />
        </>
    )
}

export default Logout