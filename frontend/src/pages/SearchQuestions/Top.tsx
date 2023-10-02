import React, { useState, useEffect } from 'react';
import SearchQuestions from '../../components/SearchQuestions/SearchQuestions';
import { useAuth } from '../../components/auth/Auth';
import HeadTitle from '../../components/layouts/HeadTitle';
import NoLogin from '../../components/auth/NoLogin';
import style from '../../components/styles/Common.module.css';
import CategoryList from '../../components/SearchQuestions/CategoryList';

const QuestionList = () => {
    const { accessToken } = useAuth();

    return (
        <>
            <HeadTitle title='質問一覧' />
            {accessToken ? (
                <div>
                    {/* <DefaultQuestionsList /> */}

                    <SearchQuestions />

                    <div className={style.bg}>
                        <h4 className={style.title}>用意された質問から選ぶ</h4>
                        <CategoryList />
                    </div>

                    <div className={style.bg}>
                        <h4 className={style.title}>作成した質問から選ぶ</h4>
                    </div>



                </div>
            ) : (
                <NoLogin />
            )
            }

        </>
    )
}

export default QuestionList;
