import $api from "../http";
import {AxiosResponse} from 'axios'
import { IMessage, IRoom } from "../../types";

export default class UserService{
  static fetchRooms(): Promise<AxiosResponse<IRoom[]>>{
    return $api.get<IRoom[]>('/rooms')
  }

  static fetchMessages(roomId: string): Promise<AxiosResponse<IMessage[]>>{
    return $api.post<IMessage[]>('/messages', {roomId})
  }

  static deleteRoom(roomId: string, userId: string): Promise<AxiosResponse<IRoom>>{
    return $api.delete<IRoom>('/room', {params: {roomId, userId}})
  }
}