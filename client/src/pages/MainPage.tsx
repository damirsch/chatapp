import React, { useContext } from 'react'
import { Context } from '..'
import Chat from '../components/chat/Chat'
import MainPageIfNotAuth from '../components/mainPageIfNotAuth/MainPageIfNotAuth'
import Application from '../components/application/Application'

const MainPage = () => {
  const {store} = useContext(Context)

  if(store.isAuth){
    return(
      <Application/> 
    )
  }
  return <MainPageIfNotAuth/>
}

export default MainPage