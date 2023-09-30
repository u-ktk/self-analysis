import React from 'react';
import Favicon from "react-favicon";
import memo from './images/icon/memo.svg';
import Header from './components/layouts/Header';
import { AuthProvider } from './components/auth/Auth';
import 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import './sass/custom.scss'
import Login from './pages/MyPage/Login'
import Logout from './components/auth/LogoutModal'
import Register from './pages/MyPage/Register';
import QuestionList from './pages/SearchQuestions/Top';
import DefaultQuestionsList from './pages/SearchQuestions/DefaultQuestionsLIst';
import AnswerHistory from './pages/ReviewQuestions/AnswerHistory';
import Search from './pages/SearchQuestions/SearchResults';
import ReviewQuestions from './pages/ReviewQuestions/Top';
import CreateCustomQuestions from './pages/CreateQuestions/Top';
import CustomQuestionList from './pages/SearchQuestions/CustomQuestionList';
import MyPage from './pages/MyPage/Top';
import Help from './pages/Help/Top';
import FolderDetail from './pages/ReviewQuestions/FolderDetail';



function App() {
  return (
    <>
      <Favicon url={memo}></Favicon>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path='/' element={<QuestionList />} />
          <Route path='/questions-list' element={<QuestionList />} />
          <Route path='/create-question' element={<CreateCustomQuestions />} />
          <Route path='/questions-list/default/:page' element={<DefaultQuestionsList />} />
          <Route path='/questions-list/custom' element={<CustomQuestionList />} />
          <Route path='/search' element={<Search />} />
          <Route path='/questions/default/:id' element={<AnswerHistory />} />
          <Route path='/review-questions' element={<ReviewQuestions />} />
          <Route path='/myPage' element={<MyPage />} />
          <Route path='/folders/detail' element={<FolderDetail />} />
          <Route path='/help' element={<Help />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
      </AuthProvider>

    </>
  );
}

export default App;
