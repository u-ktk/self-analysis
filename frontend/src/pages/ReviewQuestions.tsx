import React from 'react'
import HeadTitle from '../components/layouts/HeadTitle'
import { useAuth } from '../components/auth/Auth';
import NoLogin from '../components/NoLogin';

const ReviewQuestions = () => {
    const { accessToken } = useAuth();

    return (
        <>
            <HeadTitle title='回答の履歴' />
            {accessToken ? (
                <div>ReviewQuestions</div>
            ) : (
                <NoLogin />
            )}

        </>
    )
}

export default ReviewQuestions