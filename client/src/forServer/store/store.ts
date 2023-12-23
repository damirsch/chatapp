import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import RoomService from "../services/RoomService";
import UserService from "../services/UserService";
import axios from 'axios'
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store{
  constructor(){
    this.login = this.login.bind(this)
    this.registration = this.registration.bind(this)
    this.logout = this.logout.bind(this)
    this.checkAuth = this.checkAuth.bind(this)
  }

  user = {} as IUser
  isAuth = false

  setAuth(bool: boolean){
    this.isAuth = bool
  }

  setUser(user: IUser){
    this.user = user
  }

  async login(username: string, password: string){
    try{
      const response = await AuthService.login(username, password)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async registration(username: string, email: string, password: string){
    try{
      const response = await AuthService.registration(username, email, password)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async logout(){
    try{
      await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({} as IUser)
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async checkAuth(){
    try{
      const response = await axios.get<AuthResponse>(API_URL + '/refresh', {withCredentials: true})
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async getUsers(){
    try{
      return await UserService.fetchUsers()
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async getRooms(){
    try{
      return await RoomService.fetchRooms()
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async getMessages(roomId: string){
    try{
      return await RoomService.fetchMessages(roomId)
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async getAmountOfSentMessages(){
    try{
      return await UserService.fetchAmountOfSentMessages(this.user.id)
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }

  async deleteRoom(roomId: string){
    try{
      return await RoomService.deleteRoom(roomId, this.user.id)
    }catch(e: any){
      throw new Error(e.response?.data?.message)
    }
  }
}