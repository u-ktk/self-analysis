import React from 'react';
import Header from './components/layouts/Header';
import { AuthProvider } from './components/auth/Auth';
import 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import './sass/custom.scss'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register';
import QuestionList from './pages/QuestionList';
import TopPage from './pages/TopPage';
import DefaultQuestionsList from './pages/DefaultQuestions/DefaultQuestionsLIst';
import AnswerHistory from './pages/AnswerHistory';
import Search from './pages/SearchResults';
import ReviewQuestions from './pages/ReviewQuestions';
import CreateCustomQuestions from './pages/CreateCustomQuestions';
import MyPage from './pages/MyPage';
import Help from './pages/Help';


function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path='/' element={<TopPage />} />
          <Route path='/questions-list' element={<QuestionList />} />
          <Route path='/create-question' element={<CreateCustomQuestions />} />
          <Route path='/questions-list/default/:page' element={<DefaultQuestionsList />} />
          <Route path='/search' element={<Search />} />
          <Route path='/questions/default/:id' element={<AnswerHistory />} />
          <Route path='/review-questions' element={<ReviewQuestions />} />
          <Route path='/myPage' element={<MyPage />} />
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
