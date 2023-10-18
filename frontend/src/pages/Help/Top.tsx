import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { useAuth } from '../../components/auth/Auth';
import NoLogin from '../../components/auth/NoLogin';

import formStyles from '../../components/styles/Form.module.css';

import openIcon from '../../images/icon/open.svg';


const Help = () => {
    const { accessToken } = useAuth();
    return (
        <>
            <HeadTitle title='使い方ガイド' />
            {accessToken ? (
                <>
                    <div className={formStyles.descriptionBox} style={{ color: '#4b4b4b' }}>
                        <ul>
                            <li>
                                「メモの魔力」p.136~p139を参考に
                                <br />
                                <span className={formStyles.highlighted}>「標語（ファクトをまとめたもの）」「ファクト」「抽象」「転用」</span>
                                <br />
                                を意識して回答してみましょう。
                            </li>
                            <li>
                                １つの質問に対して複数回答することもできます。
                            </li>
                        </ul>

                    </div>
                </>
            ) : (
                <NoLogin />
            )}
        </>
    )

}

export default Help