import React from 'react'
import HeadTitle from '../components/layouts/HeadTitle'
import { useAuth } from '../components/auth/Auth';
import NoLogin from '../components/NoLogin';

const MyPage = () => {
    const { accessToken } = useAuth();
    return (
        <>
            <HeadTitle title='マイページ' />
            {accessToken ? (
                <div>MyPage</div>
            ) : (
                <NoLogin />
            )}
        </>
    )
}

export default MyPage