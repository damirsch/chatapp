import $api from "../http";
import {AxiosResponse} from 'axios'
import { IUser } from "../models/IUser";
import { IAmountOfSentMessages } from "../../types";

export default class UserService{
  static fetchUsers(): Promise<AxiosResponse<IUser[]>>{
    return $api.get<IUser[]>('/users')
  }

  static fetchAmountOfSentMessages(userId: string): Promise<AxiosResponse<IAmountOfSentMessages[]>>{
    return $api.post<IAmountOfSentMessages[]>('/amountOfSentMessages', {userId})
  }
}