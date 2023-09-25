import React from 'react'
import style from '../components/styles/Form.module.css'

const NoLogin = () => {
    return (
        <div className={style.bg}>
            <div>自己分析サイトを利用するには、ログインする必要があります。</div>
            <div className={style.formGroup}>
                <a href="/register" className={style.link}>新規登録</a>
            </div>
            <div className={style.formGroup}>
                <a href="/login" className={style.link}>ログイン</a>
            </div>
        </div>
    )
}

export default NoLogin