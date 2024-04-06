import $api, { API_URL } from "../http";
import {AxiosResponse} from 'axios'
import { IAmountOfSentMessages, IUserWithtokens, IUser } from "../../types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export default class UserService{
	static fetchUsers(): Promise<AxiosResponse<IUser[]>>{
		return $api.get<IUser[]>('/users')
	}

	static fetchAmountOfSentMessages(userId: string): Promise<AxiosResponse<IAmountOfSentMessages[]>>{
		return $api.post<IAmountOfSentMessages[]>('/amount-of-sent-messages', {userId})
	}

	static changeUsername(userId: string, username: string): Promise<AxiosResponse<IUserWithtokens>>{
		return $api.post<IUserWithtokens>('/change-username', {userId, username})
	}

	static changeEmail(userId: string, email: string): Promise<AxiosResponse<IUserWithtokens>>{
		return $api.post<IUserWithtokens>('/change-email', {userId, email})
	}

	static deleteAccount(userId: string): Promise<AxiosResponse<string>>{
		return $api.delete<string>('/delete-account', {params: {userId}})
	}
}

export const userAPI = createApi({
	reducerPath: 'userAPI',
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL, 
		prepareHeaders: (headers) => {
			headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
			return headers
		}
	}),
	endpoints: (build) => ({
		fetchUsers: build.query<IUser[], number>({
			query: () => ({
				url: '/users',
			})
		}),
		fetchAmountOfSentMessages: build.mutation<IAmountOfSentMessages[], string>({
			query: (userId: string) => ({
				url: '/amount-of-sent-messages',
				method: 'POST',
				body: {userId}
			})
		})
	})
})

export const { useFetchAmountOfSentMessagesMutation } = userAPI