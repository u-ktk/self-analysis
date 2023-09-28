import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { useAuth } from '../../components/auth/Auth';
import UserInfo from '../../components/MyPage/EditUserInfo';
import FolderList from '../../components/ReviewQuestions/FolderList';
import Logout from '../../components/auth/LogoutModal';

import NoLogin from '../../components/auth/NoLogin';

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

                    <Logout />

                </div>



            ) : (
                <NoLogin />
            )}
        </>
    )
}

export default MyPage