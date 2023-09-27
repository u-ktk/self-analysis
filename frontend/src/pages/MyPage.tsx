import React from 'react'
import HeadTitle from '../components/layouts/HeadTitle'
import { useAuth } from '../components/auth/Auth';
import UserInfo from '../components/UserInfo';
import FolderList from '../components/FolderList';
import Logout from '../components/Logout';
import style from '../components/styles/Common.module.css'

import NoLogin from '../components/NoLogin';

const MyPage = () => {
    const { accessToken } = useAuth();
    return (
        <>
            <HeadTitle title='マイページ' />
            {accessToken ? (
                <div>
                    <UserInfo />
                    <FolderList />
                    <Logout />

                </div>



            ) : (
                <NoLogin />
            )}
        </>
    )
}

export default MyPage