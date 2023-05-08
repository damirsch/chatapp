import React, { type FC } from 'react'
import { IModal } from '../../../../types'
import './Modal.css'

const Modal: FC<IModal> = ({ title }) => {
  return (
    <div className='modal-auth-error'>
      <div>{title}</div>
    </div>
  )
}

export default Modal