import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/BeforeLoginPage/Login';
import Register from '../pages/BeforeLoginPage/Register';
import DefaultQuestionDetail from '../pages/QuestionDetailPage/DefaultQuestionDetail';
import CustomQuestionDetail from '../pages/QuestionDetailPage/CustomQuestionDetail';
import SearchResults from '../pages/SearchQuestionsPage/SearchResults';
import FolderPage from '../pages/FolderPage/Top';
import CreateQuestionsPage from '../pages/CreateQuestionsPage/Top';
import CustomQuestionList from '../pages/SearchQuestionsPage/CustomQuestionList';
import MyPage from '../pages/MyPage/Top';
import HelpPage from '../pages/HelpPage/Top';
import FolderDetail from '../pages/FolderPage/FolderDetail';
import DefaultQuestionsList from '../pages/SearchQuestionsPage/DefaultQuestionsList';
import SearchQuestionsPage from '../pages/SearchQuestionsPage/Top';
import SearchQuestionsByWords from '../features/SearchQuestions/SearchQuestionsByWords';
import Logout from '../features/Auth/LogoutModal';

function RoutesComponent() {
    return (
        <Routes>
            {/* ログイン前(BeforeLoginPage) */}
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            {/* <Route path='/logout' element={<Logout />} /> */}

            {/* 質問を作る（CreateQuestionsPage */}
            <Route path='/create-question' element={<CreateQuestionsPage />} />

            {/* フォルダー一覧(FoldersPage) */}
            <Route path='/folder-list' element={<FolderPage />} />
            <Route path='/folders/detail/:user/:folderName/' element={<FolderDetail />} />

            {/* ヘルプ(HelpPage) */}
            <Route path='/help' element={<HelpPage />} />

            {/* マイページ */}
            <Route path='/myPage' element={<MyPage />} />

            {/* ログアウト */}
            <Route path='/logout' element={<Logout />} />

            {/* 質問の詳細（メニューにはない) (QuestionDetailPage) */}
            <Route path='/questions/default/:id' element={<DefaultQuestionDetail />} />
            <Route path='/questions/custom/:user/:questionId' element={<CustomQuestionDetail />} />


            {/* 質問を探す(SearchQuestionsPage) */}
            <Route path='/' element={<SearchQuestionsPage />} />
            <Route path='/questions-list' element={<SearchQuestionsPage />} />
            <Route path='/questions-list/default/:page' element={<DefaultQuestionsList />} />
            <Route path='/questions-list/custom' element={<CustomQuestionList />} />
            <Route path='/search' element={<SearchResults />} />
            <Route path='/search-questions' element={<SearchQuestionsByWords />} />
        </Routes>
    );
}

export default RoutesComponent;
