import React, { type FC, useContext, useState } from 'react'
import { AuthorizationForm } from '../../modules'
import './AuthorizationPage.css'
import { Context } from '../..'
import Modal from '../../components/modal/Modal'
import { useLocation, useNavigate } from 'react-router-dom'

interface IAuthorizationPage {
  isForRegistration: boolean
}

interface ILocation extends Location{
  state: {
    isAuthPageWasVerified?: boolean
  }
}

const AuthorizationPage: FC<IAuthorizationPage> = ({ isForRegistration }) => {
  const { store } = useContext(Context)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const navigate = useNavigate()

  console.log(useLocation())
  if (store.isAuth || isAuth) {
    navigate('/', {state: {isAuthPageWasVerified: true}})
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
