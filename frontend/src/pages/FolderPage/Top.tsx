import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { useAuth } from '../../features/Auth/Token';
import NoLogin from '../../features/Auth/NoLogin';
import FolderList from '../../features/Folder/FolderList';

const FolderPage = () => {
    const { accessToken, userId } = useAuth();

    return (
        <>
            <HeadTitle title='フォルダ一覧' />
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

export default FolderPage