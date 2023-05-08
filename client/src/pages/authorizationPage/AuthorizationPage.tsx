import React, { type FC, useContext, useState, useEffect } from 'react'
import { AuthorizationForm } from '../../modules'
import './AuthorizationPage.css'
import { Context } from '../..'
import Modal from '../../components/modal/Modal'
import { useNavigate } from 'react-router-dom'
import Preloader from '../../ui/preloader/Preloader'
import { IAuthorizationPage } from '../../types'


const AuthorizationPage: FC<IAuthorizationPage> = ({ isForRegistration }) => {
  const { store } = useContext(Context)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoaded(true)
    if (store.isAuth && !isAuth) {
      navigate('/', {state: {isAuthPageWasVerified: true}})
    }else if(isAuth){
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [isAuth])

  if(!loaded){
    return <Preloader/>
  }
  return (
    <div className='default__wrapper'>
      {store.isAuth || isAuth
        ? <Modal title='Successfully!' description='You will be redirected.'/>
        : null
      }
      <div className='authorization-page'>
        <div className='authorization-info'>
          <div className='authorization-info__logo'>
            chatapp
          </div>
          <div className='authorization-info__description'>
            My messaging platform allows you to send real-time messages to anyone, anywhere.
          </div>
          <div className='authorization-info__initials'>
            <div>
              look at my github ↓
            </div>
            <a className='link' href='https://github.com/pudgepicker'>
              https://github.com/pudgepicker
            </a>
          </div>
        </div>
        <AuthorizationForm
          isForRegistration={isForRegistration}
          setIsAuth={setIsAuth}
        />
      </div>
    </div>
  )
}

export default AuthorizationPage
