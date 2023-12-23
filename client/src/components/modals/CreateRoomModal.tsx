import React, { useState, type FC, useEffect, useRef, RefObject } from 'react'
import './CreateRoomModal.css'
import { IModalRoom } from '../../types'

const CreateRoomModal: FC<IModalRoom> = ({ open, setOpen, setName, setPassword, sendRoom }) => {
  const [onFocus, setOnFocus] = useState(false)

  const button = useRef() as RefObject<HTMLButtonElement>

  useEffect(() => {
    function onEnterClick(e: KeyboardEvent){
      console.log(e.key === 'Enter', onFocus)
      if(e.key === 'Enter' && onFocus && button.current){
        button.current.click()
        console.log('ok');
      }
    }
    document.addEventListener('keypress', onEnterClick)
    return () => {
      document.removeEventListener('keypress', onEnterClick)
    }
  }, [onFocus])

  if(!open) return
  return(
    <div className='modal-room' onClick={() => setOpen(false)}>
      <div className="modal-room__wrapper" onClick={e => e.stopPropagation()}>
        <div className="modal-room__block">
          <div className="modal-room__title">Create room</div>
          <div className="modal-room__container">
            <input 
              type="text" 
              className="modal-room__input" 
              placeholder='Room name'
              onFocus={() => setOnFocus(true)}
              onBlur={() => setOnFocus(false)}
              onChange={e => setName(e.target.value)}
            />
            <input 
              type="password" 
              className="modal-room__input" 
              placeholder='Room password (optional)'
              onFocus={() => setOnFocus(true)}
              onBlur={() => setOnFocus(false)}
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              className="modal-room__button" 
              onClick={() => sendRoom()}
              ref={button}
            >
              Create
            </button>
          </div>
          <div className='modal-room__note'>
            <span>
              * you cannot create more than one room
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRoomModal