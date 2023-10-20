import React, { useState, useEffect } from 'react';
import SearchQuestionsByWords from '../../features/SearchQuestions/SearchQuestionsByWords';
import { useAuth } from '../../features/Auth/Token';
import HeadTitle from '../../components/layouts/HeadTitle';
import NoLogin from '../../features/Auth/NoLogin';
import CategoryList from '../../features/SearchQuestions/CategoryList';
import CustomQuestionOverview from '../../features/SearchQuestions/CustomQuestionOverview';

const SearchQuestionsPage = () => {
    const { accessToken } = useAuth();

    return (
        <>
            <HeadTitle title='質問一覧' />
            {accessToken ? (
                <div>
                    <SearchQuestionsByWords />
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

export default SearchQuestionsPage;
