import React, { type FC } from 'react'
import { IConfirmModal } from '../../types'
import './ConfirmModal.css'

const ConfirmModal: FC<IConfirmModal> = ({ open, setOpen, actionConfirm, text}) => {
  if(!open) return
  return (
    <div className='modal-room' onClick={() => setOpen(false)}>
      <div className="modal-room__wrapper" onClick={e => e.stopPropagation()}>
        <div className="modal-room__block -confirm">
          <div className="modal-room__title">{text}</div>
          <div className="modal-room__container -confirm">
            <button className="modal-room__button -confirm -green" onClick={() => {actionConfirm(); setOpen(false)}}>
              Done
            </button>
            <button className="modal-room__button -confirm -red" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal