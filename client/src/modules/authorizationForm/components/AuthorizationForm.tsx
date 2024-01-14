import React, { FC, useContext, useEffect, useState, useRef } from 'react'
import { Context } from '../../..'
import './AuthorizationForm.css'
import { IAuthorizationForm, IForms } from '../../../types'
import Modal from '../ui/Modal'
import Spinner from '../ui/spiner/Spinner'

const AuthorizationForm: FC<IAuthorizationForm> = ({isForRegistration, setIsAuth}) => {
	const {store} = useContext(Context)
	const [password, setPassword] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [username, setUsername] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [errors, setErrors] = useState<IForms>({
		username: '',
		email: '',
		password: ''
	})
	const [isButtonClick, setIsButtonClick] = useState<boolean>(false)
	const [serverError, setServerError] = useState<string>('')

	const buttonRef = useRef<HTMLButtonElement>()

	useEffect(() => {
		const [errUsername, errEmail, errPassword] = validateAll(username, email, password)
		setErrors({username: errUsername, email: errEmail, password: errPassword})
	}, [username, email, password])

	useEffect(() => {
		function onEnterClick(e: KeyboardEvent){
			if(e.key === 'Enter'){
				buttonRef.current.click()
			}
		}
		document.addEventListener('keypress', onEnterClick);
		return () => {
			document.removeEventListener('keypress', onEnterClick);
		}
	}, [])
	
	const registration = async () => {
		const [errUsername, errEmail, errPassword] = validateAll(username, email, password)
		setIsButtonClick(true)
		if(errUsername || errEmail || errPassword){
			return setLoading(false)
		}
		try{
			setLoading(true)
			await store.registration(username, email, password)
			setIsAuth(true)
		}catch(e: any){
			if(e instanceof Error){
				setServerError(e.message)
				setIsModalOpen(true)
				setTimeout(() => setIsModalOpen(false), 1000)
			}
		}finally{
			setLoading(false)
		}
	}

	const login = async () => {
		const [errUsername, _, errPassword] = validateAll(username, email, password)
		setIsButtonClick(true)
		if(errUsername || errPassword){
			return setLoading(false)
		}
		try{
			setLoading(true)
			await store.login(username, password)
			setIsAuth(true)
		}catch(e: any){
			if(e instanceof Error){
				setServerError(e.message)
				setIsModalOpen(true)
				setTimeout(() => setIsModalOpen(false), 1000)
			}
		}finally{
			setLoading(false)
		}
	}
	
	const validationUsername = (username: string): string => {
		if(username.length < 3){
			return 'Name must be more than 2 characters'
		}
		return ''
	}
	const validationEmail = (email: string): string => {
		const EMAIL_REGEXP = 
		/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
		if(!EMAIL_REGEXP.test(email)){
			return 'This is not an email'
		}
		return ''
	}
	const validationPassword = (password: string): string => {
		if(password.length < 7){
			return 'Password must be more than 6 symbols'
		}
		return ''
	}
	const validateAll = (username: string, email: string, password: string) => {
		return [validationUsername(username), validationEmail(email), validationPassword(password)]
	}

	function handleInput(e) {
		const inputs = document.querySelectorAll<HTMLInputElement>('.authorization-form__input')
		if(e.key === 'ArrowDown'){
			inputs.forEach((i, index) => {
				let next = index + 1
				if(i.type === e.target.type && next < inputs.length){
					inputs[next].focus()
				}
			})
		}
		if(e.key === 'ArrowUp'){
			inputs.forEach((i, index) => {
				let prev = index - 1
				if(i.type === e.target.type && prev >= 0){
					inputs[prev].focus()
				}
			})
		}
	}

	return(
		<div className='authorization-form'>
			<div className='authorization-form__wrapper'>
				<Modal title={serverError} open={isModalOpen}/>
				<div className='authorization-form__block'>
					{isForRegistration 
						?
						<div className='authorization-form__title'>
							Create an account
						</div>
						:
						<div className='authorization-form__title'>
							Welcome back, bro
						</div>
					}
					<label>
						Name
						<input
							type='text'
							className='authorization-form__input'
							value={username}
							onChange={(e) => loading || store.isAuth ? setUsername(username) : setUsername(e.target.value)}
							onKeyDown={(e) => handleInput(e)}
						/>
						<span></span>
						<div className='error-validation'>
							{username || isButtonClick ? errors.username : null}
						</div>
					</label>
					{isForRegistration 
						? 
						<label>
							Email
							<input 
								type='email' 
								className='authorization-form__input' 
								value={email}
								onChange={(e) => loading || store.isAuth ? setEmail(username) : setEmail(e.target.value)}
								onKeyDown={(e) => handleInput(e)}
							/>
							<span></span>
							<div className='error-validation'>
								{email || isButtonClick ? errors.email : ''}
							</div>
						</label>
						:
						null
					}
					<label>
						Password
						<input 
							type='password' 
							className='authorization-form__input' 
							value={password}
							onChange={(e) => loading || store.isAuth ? setPassword(username) : setPassword(e.target.value)}
							onKeyDown={(e) => handleInput(e)}
						/>
						<span></span>
						<div className='error-validation'>
							{password || isButtonClick ? errors.password : null}
						</div>
					</label>
					{isForRegistration 
						? 
						<button onClick={() => registration()} ref={buttonRef} className='authorization-form__button'>
							{loading ? <Spinner/> : 'Registration'}
						</button>
						:
						<button onClick={() => login()} ref={buttonRef} className='authorization-form__button'>
							{loading ? <Spinner/> : 'Sign in'}
						</button>
					}
					{isForRegistration 
						?
						<div className='authorization-form__description'>
							Already have an account? <a href='./signin'>Sign in</a>
						</div>
						:
						<div className='authorization-form__description'>
							Don&apos;t have an account? <a href='./registration'>Sign up</a>
						</div>
					}
				</div>
			</div>
		</div>
	)
}

export default AuthorizationForm