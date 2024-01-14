import React, { useState, type FC } from 'react'
import Store from '../../forServer/store/store'
import './Account.css'
import Loader from '../spinners/Loader'
import ConfirmModal from '../modals/ConfirmModal'

interface IAccount{
	store: Store
	activeTab: string[]
}

const Account: FC<IAccount> = ({ store }) => {
	const [isEditProfile, setIsEditProfile] = useState(false)
	const [newUsername, setNewUsername] = useState('')
	const [newEmail, setNewEmail] = useState('')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [loadingEmail, setLoadingEmail] = useState(false)
	const [loadingUsername, setLoadingUsername] = useState(false)
	const [openModal, setOpenModal] = useState(false)
	const [error, setError] = useState()

	const user = store.user
	const condition = user.amount_of_sent_messages.map(i => i.amount) 
	const amountOfSentMessages = condition.length ? condition.reduce((a, b) => a + b) : 0

	async function changeUsername(username: string){
		try{
			if(username == user.username || !username) return
			setLoadingUsername(true)
			const { data } = await store.changeUsername(username)
			setLoadingUsername(false)
			setNewUsername(data.user.username)
		}catch(e){
			setLoadingUsername(false)
			setError(e)
		}
	}

	async function changeEmail(email: string){
		try{
			if(email == user.email || !email) return
			setLoadingEmail(true)
			const { data } = await store.changeEmail(email)
			setLoadingEmail(false)
			setNewEmail(data.user.email)
		}catch(e){
			setLoadingEmail(false)
			setError(e)
		}
	}

	async function deleteAccount(){
		try{
			await store.deleteAccount()
		}catch(e){
		}
	}

	return(
		<div style={{height: '100%', display: 'flex'}}>
			<ConfirmModal 
				actionConfirm={deleteAccount} 
				open={openModal} 
				setOpen={setOpenModal} 
				text='Delete Account'
			/>
			<div className="account-left">
				<div className={isEditProfile ? "account-main -active" : "account-main -close"}>
					<div className="account-main__bg"></div>
					<div className="account-main__block">
						<div className={isEditProfile ? "account-main__avatar -active" : "account-main__avatar"}>
							<div className={isEditProfile ? "account-main__img -active" : "account-main__img"}></div>
						</div>
						<div className="account-main__wrapper">
							<div className="account-main__text">
								Username: {!loadingUsername ? (newUsername || user.username) :
									<span className="account-main__text-loading">
										<span>{user.username}</span>
										{loadingUsername ? <Loader/> : null}
									</span>
								}
							</div>
							<div className="account-main__text">
								Email: {!loadingEmail ? (newEmail || user.email) :
									<span className="account-main__text-loading">
										<span>{user.email}</span>
										{loadingEmail ? <Loader/> : null}
									</span>
								}
							</div>
						</div>
						<div className="account-main__actions">
							<button onClick={() => setIsEditProfile(prev => !prev)}>
								{isEditProfile ? 'Close' : 'Edit profile'}
							</button>
						</div>
					</div>
				</div>
				<div className={isEditProfile ? "account-edit -active" : "account-edit"}>
					<div className="account-edit__wrapper -scroll">
						<input 
							className="account-edit__input" 
							type='text' 
							name='username'
							placeholder='New username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<br />
						<input 
							className="account-edit__input" 
							type='email' 
							name='email'
							placeholder='New email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<br />
						<button 
							className="account-edit__button -green"
							onClick={() => {changeEmail(email); changeUsername(username)}}
						>
							Save
						</button>
						<br />
						<button 
							className="account-edit__button"
							onClick={() => {store.logout(); window.location.reload()}}
						>
							Logout
						</button>
						<button 
							className="account-edit__button -red"
							onClick={() => setOpenModal(true)}
						>
							Delete account
						</button>
					</div>
				</div>
			</div>
			<div className="account-right">
				<div>Additional Information:</div>
				<div className="account-right__block">
					<div>Your ID: <span className="-id">{user.id}</span></div>
					<div>Rooms: {user.userRooms.map((i, index, arr) => {
						return(
							<span key={i.roomId}>
								<a className="-link" href={'./chat/' + i.roomId}>
									{i.name}{index + 1 !== arr.length ? ', ' : null}
								</a>
							</span>
						)
					})}</div>
					<div>Number of rooms: {user.amount_of_rooms}</div>
					<div>Amount of sent messages: {amountOfSentMessages}</div>
					<div>
						Subscription plan: 
						<a className="-link" href='subscription'>
							{user.access_to_create_much_rooms ? ' Pro' : ' Free'}
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Account