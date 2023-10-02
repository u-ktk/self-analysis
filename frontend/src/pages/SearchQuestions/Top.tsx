import React, { useState, useEffect } from 'react';
import SearchQuestions from '../../components/SearchQuestions/SearchQuestions';
import { useAuth } from '../../components/auth/Auth';
import HeadTitle from '../../components/layouts/HeadTitle';
import NoLogin from '../../components/auth/NoLogin';
import style from '../../components/styles/Common.module.css';
import CategoryList from '../../components/SearchQuestions/CategoryList';
import CustomQuestionOverview from '../../components/SearchQuestions/CustomQuestionOverview';

const QuestionList = () => {
    const { accessToken } = useAuth();

    return (
        <>
            <HeadTitle title='質問一覧' />
            {accessToken ? (
                <div>
                    <SearchQuestions />
                    <CategoryList />
                    <CustomQuestionOverview />
                </div>
            ) : (
                <NoLogin />
            )
            }

        </>
    )
}

export default QuestionList;
