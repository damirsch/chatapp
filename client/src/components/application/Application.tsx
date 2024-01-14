import React, { useContext } from 'react'
import Chat from '../chat/Chat'
import './Application.css'
import Statistics from '../statistics/Statistics'
import { Context } from '../..'
import Account from '../account/Account'

const Application = () => {
	const {store} = useContext(Context)
	const activeTab = new URL(window.location.href).pathname.replace('/', '').split('/')
	
	function transferTo(str: string){
		window.location.href = `/${str}`
	}	
	
	return (
		<div className='application'>
			<div className="application__leftbar">
				<div 
					className={activeTab[0] == 'account' ? "application__block -active" : "application__block"}
					onClick={() => transferTo('account')}
				>
					<div className="application__icon" id='account'></div>
				</div>
				<div 
					className={activeTab[0] == 'chat' || !activeTab[0] ? "application__block -active" : "application__block"}
					onClick={() => transferTo('chat')}
				>
					<div className="application__icon" id='chat'></div>
				</div>
				<div 
					className={activeTab[0] == 'statistics' ? "application__block -active" : "application__block"}
					onClick={() => transferTo('statistics')}
				>
					<div className="application__icon" id='statistics'></div>
				</div>
			</div>
			<div style={{width: '100%'}}>
				{activeTab[0] == 'chat' || !activeTab[0] ? 
					<div className="application__navbar">
						<div className="application__icon" id='chat'></div>
						<span>Messaging</span>
						<div className="application__burger">
							{/* <div className="application__icon" id='account'></div>
							<div className="application__icon" id='chat'></div>
							<div className="application__icon" id='statistics'></div> */}
						</div>
					</div>
				: 
				activeTab[0] == 'statistics' ? 
					<div className="application__navbar">
						<div className="application__icon" id='statistics'></div>
						<span>Statistics</span>
						{/* <div className="application__burger">
							<div className="application__icon" id='account'></div>
							<div className="application__icon" id='chat'></div>
							<div className="application__icon" id='statistics'></div>
						</div> */}
					</div>
				: 
				activeTab[0] == 'account' ? 
					<div className="application__navbar">
						<div className="application__icon" id='account'></div>
						<span>Account</span>
						{/* <div className="application__burger">
							<div className="application__icon" id='account'></div>
							<div className="application__icon" id='chat'></div>
							<div className="application__icon" id='statistics'></div>
						</div> */}
					</div>
				: null
				}
				{activeTab[0] == 'chat' ||  activeTab[0] == '' ? 
					<Chat store={store} activeTab={activeTab}/> : activeTab[0] == 'statistics' ? 
					<Statistics store={store} activeTab={activeTab}/> : activeTab[0] == 'account' ? 
					<Account store={store} activeTab={activeTab}/> : null
				}
			</div>
		</div>
	)
}

export default Application