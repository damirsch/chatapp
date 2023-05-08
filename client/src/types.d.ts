export interface IAuthorizationPage {
  isForRegistration: boolean
}

export interface ILocation extends Location{
  state: {
    isAuthPageWasVerified?: boolean
  }
}

export interface IAuthorizationForm{
  isForRegistration: boolean
  setIsAuth: Function
}

export interface IForms{
  username: string,
  email: string,
  password: string,
}

export interface IModal {
  title?: string
  description?: string
}