import React from 'react'
import HeadTitle from '../components/layouts/HeadTitle'
import { useAuth } from '../components/auth/Auth';
import UserInfo from '../components/UserInfo';
import FolderList from '../components/FolderList';
import Logout from '../components/Logout';

import NoLogin from '../components/NoLogin';

const MyPage = () => {
    const { accessToken } = useAuth();
    return (
        <>
            <HeadTitle title='マイページ' />
            {accessToken ? (
                <>
                    <UserInfo />
                    <FolderList />
                    <Logout />

                </>



            ) : (
                <NoLogin />
            )}
        </>
    )
}

export default MyPage