import React, { type FC } from 'react'
import './Modal.css'

interface IModal {
  title: string
  description: string
}

const Modal: FC<IModal> = ({ title, description }) => {
  return (
    <div>
      <div className='modal'>
        <div className='modal__wrapper'>
          <div className='modal__block'>
            <div className='check-mark'>
              <div className='check-mark__circle'>
                <div className='check-mark__symbol'></div>
              </div>
            </div>
            <div className='modal__title'>{title}</div>
            <div className='modal__description'>{description}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
