import React, { type FC } from 'react'
import { IModal } from '../../../types'
import './Modal.css'

const Modal: FC<IModal> = ({ title, open }) => {
  return (
    <div className='modal-auth-error' style={{top: open ? '20px' : '-50px', opacity: open ? '1' : '0'}}>
      <div>{title}</div>
    </div>
  )
}

export default Modal