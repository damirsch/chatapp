import $api from '../http';
import {AxiosResponse} from 'axios'
import { AuthResponse } from '../models/AuthResponse';

export default class AuthService{
  static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>>{
    return $api.post<AuthResponse>('/login', {username, password})
  }

  static async registration(username: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>>{
    return $api.post<AuthResponse>('/registration', {username, email, password})
  }

  static async logout(): Promise<void>{
    return $api.post('/logout')
  }
}