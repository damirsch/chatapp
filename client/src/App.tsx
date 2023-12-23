import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Context } from '.';
import './App.css';
import MainPage from './pages/MainPage';
import RegistrationPage from './pages/RegistrationPage';
import SigninPage from './pages/SigninPage.jsx';
import Preloader from './ui/preloader/Preloader';

function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const {store} = useContext(Context)

  useEffect(() => {
    (async () => {
      if(localStorage.getItem('token')){
        await store.checkAuth()
      }
    })()
      .finally(() => setLoading(false))
  }, [])

  if(!loading){
    return (
      <Router>
        <Routes>
          <Route path="*" element={<MainPage/>}/>
          <Route path="/statistics" element={<MainPage/>}/>
          <Route path="/chat" element={<MainPage/>}/>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/registration" element={<RegistrationPage/>}/>
          <Route path="/signin" element={<SigninPage/>}/>
          <Route path="/preloader" element={<Preloader/>}/>
        </Routes>
      </Router>
    )
  }
  return <Preloader/>
}

export default App;
