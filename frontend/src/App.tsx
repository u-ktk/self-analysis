import React from 'react';
import Favicon from "react-favicon";
import memo from './images/icon/memo.svg';
import Header from './components/layouts/Header';
import { AuthProvider } from './features/Auth/Token';
import 'react-bootstrap';
import './sass/custom.scss'
import RoutesComponent from './routes';

import 'react-quill/dist/quill.snow.css';


function App() {
  return (
    <>
      <Favicon url={memo}></Favicon>
      <AuthProvider>
        <Header />
        <RoutesComponent />
      </AuthProvider>
    </>
  );
}

export default App;
