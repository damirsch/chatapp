import React, { useEffect, useState, type FC } from 'react'
import './Chat.css'
import io from 'socket.io-client'
import { IUser } from '../../forServer/models/IUser'
import { IMessage, IRoom, IMessageContextMenuPos } from '../../types'
import Spinner from '../spinner/Spinner'
import ConfirmModal from '../modals/ConfirmModal'
import MessageContextMenu from '../contextMenu/MessageContextMenu'
import SendMessageInput from '../inputs/SendMessageInput'
import CreateRoomModal from '../modals/CreateRoomModal'
import Store from '../../forServer/store/store'
const socket = io('http://localhost:5000')

interface IChat{
	store: Store
}

const Chat: FC<IChat> = ({ store }) => {
	const [receivedMessages, setReceivedMessages] = useState<IMessage[]>([])
	const [receivedRooms, setReceivedRooms] = useState<IRoom[]>([])
	const [isJoined, setIsJoined] = useState(false)
	const [currentRoom, setCurrentRoom] = useState<IRoom>()
	const [name, setName] = useState<string | number>()
	const [password, setPassword] = useState<string | number>()
	const [users, setUsers] = useState<IUser[]>()
	const [usersLoaded, setUsersLoaded] = useState(false)
	const [usersLoadErr, setUsersLoadErr] = useState()
	const [openCreateModal, setOpenCreateModal] = useState(false)
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const [openMessageContextMenu, setOpenMessageContextMenu] = useState(false)
	const [openSettings, setOpenSettings] = useState(false)
	const [loadingRooms, setLoadingRooms] = useState(false)
	const [messageContextMenuData, setMessageContextMenuData] = useState<IMessage>()
	const [messageContextMenuPos, setMessageContextMenuPos] = useState<IMessageContextMenuPos>(
		{ posX: 0, posY: 0 }
	)

	function sendRoom(){
		if(!name) return
		socket.emit('send_room', {name, password, userId: store.user.id})
		setLoadingRooms(false)
	}

	function join(roomId: string){
		if(currentRoom?.roomId === roomId) return
		socket.emit('join', {roomId})
		returnToDefault()
	}

	function deleteRoom(){
		socket.emit('delete_room', {roomId: currentRoom.roomId, userId: store.user.id})
	}

	function deleteMessage(id: string){
		try {
			socket.emit('delete_message', {userId: store.user.id, _id: id})
			setOpenMessageContextMenu(false)
		}catch(e){}
	}

	async function getUsers(){
		try{
			const users = await store.getUsers()
			setUsers(users.data)
			setUsersLoaded(true)
		}catch(e){
			setUsersLoadErr(e)
		}
	}
	
	async function getRooms(){
		try{
			setLoadingRooms(false)
			const rooms = await store.getRooms()
			setReceivedRooms([...rooms.data])
			setLoadingRooms(true)
		}catch(e){
			setLoadingRooms(true)
		}
	}
	
	async function getMessages(currentRoom: string){
		const messages = await store.getMessages(currentRoom)
		setReceivedMessages([...receivedMessages, ...messages.data])
	}

	function showModalRoom(){
		setOpenCreateModal(true)
	}

	function returnToDefault(){
		setIsJoined(false)
		setReceivedMessages(null)
		setCurrentRoom(null)
	}

	function closeAllMenues() {
		setOpenSettings(false)
		setOpenMessageContextMenu(false)
	}

	function showMessageContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>, messageData: IMessage){
		e.stopPropagation()
		e.preventDefault()
		const posY = e.screenY - (window.outerHeight - window.innerHeight)
		setMessageContextMenuPos({posX: e.screenX, posY})
		setMessageContextMenuData(messageData)
		setOpenMessageContextMenu(true)
	}

	useEffect(() => {
		socket.on('receive_message', (message: IMessage) => {
			setReceivedMessages(prev => [...prev, message])
		})
		socket.on('joined_room', (room: IRoom) => {
			setIsJoined(true)
			getMessages(room.roomId)
			setCurrentRoom(room)
			setLoadingRooms(true)
		})
		socket.on('receive_room', (room: IRoom) => {
			setOpenCreateModal(false)
			setLoadingRooms(true)
			setReceivedRooms(prev => [...prev, room])
		})
		socket.on('deleted_room', () => {
			returnToDefault()
			getRooms()
		})
		socket.on('deleted_message', (message: IMessage) => {
			setReceivedMessages(prev => prev.filter(i => i._id !== message._id))
		})
		socket.on('error', (data) => {
			if(data === 'much rooms'){
				setLoadingRooms(true)
				setOpenCreateModal(false)
			}
			console.log(data);
		})
	}, [socket])
	
	useEffect(() => {
		getRooms()
		getUsers()
	}, [])

	return (
		<div className='chat' onClick={() => closeAllMenues()}>
			<CreateRoomModal 
				open={openCreateModal} 
				setOpen={setOpenCreateModal} 
				setName={setName} 
				setPassword={setPassword} 
				sendRoom={sendRoom}
			/>
			<ConfirmModal open={openDeleteModal} setOpen={setOpenDeleteModal} actionConfirm={deleteRoom} text='Delete room'/>
			<MessageContextMenu 
				open={openMessageContextMenu}
				fnDelete={deleteMessage}
				messageData={messageContextMenuData}
				posX={messageContextMenuPos.posX} 
				posY={messageContextMenuPos.posY}
			/>
			<div className='chat__container'>
				<div className="chat__sections">
					<div className="chat__section left-section">
						<div className="left-section__nav">
							<div className="left-section__title">Chats</div>
							<div className="left-section__search"></div>
							<div className="left-section__add" onClick={() => showModalRoom()}>
								+
							</div>
						</div>
						{loadingRooms && receivedRooms ?
							<div className="left-section__groups">
								{receivedRooms.map(i => {
									const roomName = i.name
									return(
										<div 
											key={i.roomId} 
											className={currentRoom?.roomId == i.roomId ? 
												"left-section__group -active" : "left-section__group"
											}
											onClick={() => join(i.roomId)}
										>
											<div className="left-section__avatar"></div>
											<div style={{width: 'calc(100% - 45px)', marginLeft: '10px'}}>
												<div className="left-section__name">{roomName}</div>
												<div className="left-section__message">
													<div>Last message</div>
													<div className="left-section__time">4 h</div>
												</div>
											</div>
										</div>
									)
								})}
							</div> : 
							<div className="left-section__groups">
								{Array(4).fill(null).map((_, index) => {
									return(
										<div className="left-section__group-fill" key={index}></div>
									)
								})}
							</div>
						}
					</div>
					<div className="chat__section middle-section">
						{isJoined ? 
							<div>
								<div className="middle-section__nav">
									<div className="middle-section__name">{currentRoom.name}</div>
									<div className="middle-section__settings-button">
										<div 
											className="middle-section__bg" 
											onClick={e => {e.stopPropagation(); setOpenSettings(true)}}
										></div>
										<div 
											className={openSettings ? "middle-section__settings" : "middle-section__settings -hide"}
											onClick={e => e.stopPropagation()}
										>
											{currentRoom.roomId == store.user.id ? null
												: null
											}
												<div className="middle-section__settings-item" onClick={() => setOpenDeleteModal(true)}>
													<div className="middle-section__img delete"></div>
													<div className="middle-section__text delete">
														Delete room
													</div>
												</div>
											<div className="middle-section__settings-item">...</div>
											<div className="middle-section__settings-item">...</div>
										</div>
									</div>
								</div>
								<div 
									className="middle-section__correspondence"
									style={!receivedMessages ? {alignItems: 'center', justifyContent: 'center'} : {}}
								>
									{/* ! Delete Math.random() !*/}
									{receivedMessages ? receivedMessages.map((i, index) => {
										return(
											<div 
												key={Math.random()} 
												className={
													i.userId == store.user.id ? 
													"middle-section__message my-message" : "middle-section__message"
												}
												onContextMenu={e => showMessageContextMenu(e, receivedMessages[index])}
											>
												{i.text}
											</div>
										)
									}) : <Spinner/>}
								</div>
								<SendMessageInput socket={socket} userId={store.user.id}/>
							</div> : currentRoom ? <div>Loading...</div> : null
						}
					</div>
					<div className="chat__section right-section"></div>
				</div>
			</div>
		</div>
	)
}

export default Chat