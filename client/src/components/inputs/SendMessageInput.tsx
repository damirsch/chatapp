import React, { type FC, useEffect, useState } from 'react'
import { ISendMessageInput } from '../../types'

const SendMessageInput: FC<ISendMessageInput> = ({socket, userId}) => {
	const [message, setMessage] = useState<string>('')

	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if(e.key === 'Enter' && !e.repeat && message){	
				sendMessage(message)
			}
		}
		document.addEventListener('keyup', listener)
		return () => document.removeEventListener('keyup', listener)
	}, [message])

	function sendMessage(msg: string | number){
		msg = msg.toString()
		socket.emit('send_message', {message: msg, userId: userId, time: new Date()})
		setMessage('')
	}

	return(
		<div className="middle-section__footer">
			<input 
				type="text"
				placeholder="Write a message..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<div 
				className="middle-section__send-button" 
				onClick={() => sendMessage(message)}
			></div>
		</div>
	)
}

export default SendMessageInput