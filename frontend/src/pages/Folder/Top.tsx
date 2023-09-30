import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { useAuth } from '../../components/auth/Auth';
import NoLogin from '../../components/auth/NoLogin';
import FolderList from '../../components/ReviewQuestions/FolderList';

const ReviewQuestions = () => {
    const { accessToken, userId } = useAuth();

    return (
        <>
            <HeadTitle title='回答の履歴' />
            {accessToken ? (

                <FolderList
                    accessToken={accessToken}
                    userId={userId}
                />
            ) : (
                <NoLogin />
            )}

        </>
    )
}

export default ReviewQuestions