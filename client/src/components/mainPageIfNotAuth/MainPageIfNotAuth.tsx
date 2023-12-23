import React from 'react'
import './MainPageIfNotAuth.css'

const MainPageIfNotAuth = () => {
  return (
    <div className='default__wrapper'>
      <div className='attraction'>
        <div className="attraction__description">
          <div className='typing'>Welcome to my messenger!</div>
          <div>
            To continue using the service, you need to log in.
            <br />
            Signing in only takes a few seconds and gives you access to a wide range of features that we provide to our users.
            <br />
            Chat with friends, send voice messages and more.
          </div>
          <div className='attraction__buttons'>
            <button 
              className='attraction__button' 
              onClick={() => window.location.href = './signin'}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPageIfNotAuth