import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { useAuth } from '../../features/Auth/Token';
import UserInfo from '../../features/MyPage/EditUserInfo';
import Logout from '../../features/Auth/LogoutModal';
import NoLogin from '../../features/Auth/NoLogin';

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