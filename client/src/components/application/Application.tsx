import React, { useContext } from 'react'
import Chat from '../chat/Chat'
import './Application.css'
import Statistics from '../statistics/Statistics'
import { Context } from '../..'
import Account from '../account/Account'

const Application = () => {
	const {store} = useContext(Context)
	const activeTab = new URL(window.location.href).pathname.replace('/', '')
	
	function transferTo(str: string){
		if(activeTab == str) return
		window.location.href = `../${str}`
	}
	return (
		<div className='application'>
			<div className="application__leftbar">
				<div 
					className={activeTab == 'account' ? "application__block -active" : "application__block"}
					onClick={() => transferTo('account')}
				>
					<div className="application__icon" id='account'></div>
				</div>
				<div 
					className={activeTab == 'chat' || activeTab == '' ? "application__block -active" : "application__block"}
					onClick={() => transferTo('chat')}
				>
					<div className="application__icon" id='chat'></div>
				</div>
				<div 
					className={activeTab == 'statistics' ? "application__block -active" : "application__block"}
					onClick={() => transferTo('statistics')}
				>
					<div className="application__icon" id='statistics'></div>
				</div>
			</div>
			<div style={{width: '100%'}}>
				{activeTab == 'chat' || activeTab == '' ? 
					<div className="application__navbar">
						<div className="application__icon" id='chat'></div>
						Messaging
					</div>
				: 
				activeTab == 'statistics' ? 
					<div className="application__navbar">
						<div className="application__icon" id='statistics'></div>
						Statistics
					</div>
				: null
				}
				{activeTab == 'chat' ||  activeTab == '' ? 
					<Chat store={store}/> : activeTab == 'statistics' ? 
					<Statistics store={store}/> : activeTab == 'account' ? 
					<Account/> : null
				}
			</div>
		</div>
	)
}

export default Application