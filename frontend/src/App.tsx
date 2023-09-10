import React from 'react';
import Header from './components/layouts/Header';
import { AuthProvider } from './components/auth/Auth';
import 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './sass/custom.scss'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register';
import QuestionList from './pages/QuestionList';
import TopPage from './pages/TopPage';
import Settings from './pages/Settings';
import DefaultQuestionsList from './pages/DefaultQuestions/DefaultQuestionsLIst';


function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path='/' element={<TopPage />} />

          <Route path='/questions-list' element={<QuestionList />} />
          <Route path='/questions/default/:page' element={<DefaultQuestionsList />} />

          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </AuthProvider>

    </>
  );
}

export default App;
