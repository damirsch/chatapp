import React, { type FC } from 'react'
import './MessageContextMenu.css'
import { IMessageContextMenu } from '../../types'

const MessageContextMenu: FC<IMessageContextMenu> = ({ posX, posY, open, fnDelete, messageData }) => {
	const _id = messageData?._id
	return (
		<div 
			className={open ? 'message-context-menu' : 'message-context-menu -hide'}
			style={{position: 'fixed', top: posY + 'px', left: posX + 'px'}}
			onClick={e => e.stopPropagation()}
		>
			<div className="message-context-menu__item" onClick={() => fnDelete(_id)}>Delete message</div>
			<div className="message-context-menu__item">Rewrite message</div>
		</div>
	)
}

export default MessageContextMenu