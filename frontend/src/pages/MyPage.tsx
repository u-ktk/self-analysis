import React from 'react'
import HeadTitle from '../components/layouts/HeadTitle'
import { useAuth } from '../components/auth/Auth';
import UserInfo from '../components/UserInfo';
import FolderList from '../components/FolderList';
import Logout from '../components/Logout';
import style from '../components/styles/Common.module.css'

import NoLogin from '../components/NoLogin';

const MyPage = () => {

    const { accessToken, userId, userName, userEmail } = useAuth()


    return (
        <>
            <HeadTitle title='マイページ' />
            {accessToken ? (
                <div>
                    <UserInfo
                        accessToken={accessToken}
                        userId={userId}
                        userName={userName}
                        userEmail={userEmail}
                    />
                    <FolderList
                        accessToken={accessToken}
                        userId={userId}
                    />
                    <Logout />

                </div>



            ) : (
                <NoLogin />
            )}
        </>
    )
}

export default MyPage