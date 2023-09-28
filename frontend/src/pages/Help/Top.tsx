import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { useAuth } from '../../components/auth/Auth';
import NoLogin from '../../components/auth/NoLogin';


const Help = () => {
    const { accessToken } = useAuth();
    return (
        <>
            <HeadTitle title='使い方ガイド' />
            {accessToken ? (
                <div>Help</div>
            ) : (
                <NoLogin />
            )}
        </>
    )

}

export default Help