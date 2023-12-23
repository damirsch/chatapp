import { Dispatch } from "react"
import { Socket } from "socket.io-client"

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

export interface IModal{
  title?: string
  description?: string
  open?: boolean
}

export interface IModalRoom{
  open: boolean
  setOpen: Dispatch
  setName: Dispatch
  setPassword: Dispatch
  sendRoom: Dispatch
}

export interface IRoom{
  name: string
  roomId: string
  password?: string
  messages?: []
}

export interface IMessage{
  text: string
  roomId: string
  userId: string
  time: Date
  _id: string
}

export interface IConfirmModal{
  text: string
  actionConfirm: () => void
  open: boolean
  setOpen: Dispatch
}

export interface IMessageContextMenuPos{
  posX: number
  posY: number
}
export interface IMessageContextMenu extends IMessageContextMenuPos{
  open: boolean
  fnDelete: (id: string) => void
  messageData: IMessage | null
}

export interface ISendMessageInput{
  socket: Socket
  userId: string
}

export interface IAmountOfSentMessages{
  time: string,
  amount: number
}

declare module '*.jpg'