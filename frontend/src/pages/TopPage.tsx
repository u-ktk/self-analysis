import React from 'react'
import HeadTitle from '../components/layouts/HeadTitle'
import { useAuth } from '../components/auth/Auth'

const TopPage = () => {
    const { accessToken } = useAuth();

    return (
        <p>
            {accessToken ? (
                <div>
                    TopPage
                </div>

            ) : (
                <div>
                    <p>自己分析サイトを利用するには、ログインする必要があります。</p>
                    <a href="/register" className="m-5">登録</a>
                    <a href="/login" className="m-5">ログイン</a>
                </div>
            )}
            <HeadTitle title='トップページ' />



        </p>
    )
}

export default TopPage