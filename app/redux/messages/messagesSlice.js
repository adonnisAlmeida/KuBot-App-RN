import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './messagesService'

export const messagesSlice = createSlice({
	name: 'messages',
	initialState: {
		isLoading: false,
		sentMessages: [],
		receivedMessages: [],
		conversations: []
	},
	reducers: {
		setMessagesLoading: (state, action) => {
			state.isLoading = true
		},
		addMessageToConversation: (state, action) => {
			let flag = true
			state.conversations.forEach(conver => {
				if (conver.node.conversationUser.serverId == action.payload.conversationUser.serverId) {
					conver.node.messages.unshift(action.payload.message)
					flag = false
				}
			});
			if (flag) { // si no existe el usuario en la conversacion
				let newConve = {
					node: {
						conversationUser: action.payload.conversationUser,
						messages: [action.payload.message]
					}
				}
				state.conversations.unshift(newConve)
			}
			state.conversations = state.conversations.sort((a, b) => new Date(a.node.messages[0].createdAt) - new Date(b.node.messages[0].createdAt)).reverse()
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getConversations.fulfilled, (state, action) => {
				state.conversations = action.payload
				state.isLoading = false
			})
			.addCase(setConversations.fulfilled, (state, action) => {
				state.conversations = action.payload
			})
			.addCase(getReceivedMessagesByUser.fulfilled, (state, action) => {
				state.receivedMessages = action.payload
				state.isLoading = false
			})
			.addCase(setReceivedMessagesByUser.fulfilled, (state, action) => {
				state.receivedMessages = action.payload
			})
			.addCase(getSentMessagesByUser.fulfilled, (state, action) => {
				state.sentMessages = action.payload
				state.isLoading = false
			})
			.addCase(setSentMessagesByUser.fulfilled, (state, action) => {
				state.sentMessages = action.payload
			})
			.addCase(addSentMessagesByUser.fulfilled, (state, action) => {
				state.sentMessages = action.payload
			})
			.addCase(addMessage.fulfilled, (state, action) => {
				state.conversations = action.payload
			})
	},
})

export const sentMessages = (state) => state.messages.sentMessages
export const receivedMessages = (state) => state.messages.receivedMessages
export const conversations = (state) => state.messages.conversations

export const getReceivedMessagesByUser = createAsyncThunk(
	'messages/getReceivedMessagesByUser',
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setMessagesLoading())
		return service.getReceivedMessagesByUser()
	}
)
export const getConversations = createAsyncThunk(
	'messages/getConversations',
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setMessagesLoading())
		return service.getConversations()
	}
)
export const setConversations = createAsyncThunk(
	'messages/setConversations',
	service.setConversations
)
export const getSentMessagesByUser = createAsyncThunk(
	'messages/getSentMessagesByUser',
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setMessagesLoading())
		return service.getSentMessagesByUser()
	}
)
export const setReceivedMessagesByUser = createAsyncThunk(
	'messages/setReceivedMessagesByUser',
	service.setReceivedMessagesByUser
)
export const setSentMessagesByUser = createAsyncThunk(
	'messages/setSentMessagesByUser',
	service.setSentMessagesByUser
)
export const addSentMessagesByUser = createAsyncThunk(
	'messages/addSentMessagesByUser',
	service.addSentMessagesByUser
)
export const addMessage = createAsyncThunk(
	'messages/addMessage',
	async (param, thunkAPI) => {
		console.log('ENTRO AL SERVICESSSS', param)
		let algo = thunkAPI.getState()
		let tem = []
		console.log('ENTRO AL tem antes', tem)
		algo.messages.conversation.forEach(item => tem.push(item))
		console.log('ENTRO AL tem', tem)
		tem.forEach(conver => {
			console.log('ENTRO AL SERVICESSSS FOR EAC')
			if (conver.conversationUser.serverId == param.conversationUser.serverId) {
				conver.mensajes.push(param.mensaje)
			}
		});
		//console.log('ENTRO AL SERVICESSSS ALGO ', algo.messages.conversations)
		console.log('ENTRO AL SERVICESSSS thunkAPI ', thunkAPI)
		//await AsyncStorage.setItem('@conversations', JSON.stringify(allConversations))
		return tem
	}
)

export const { setMessagesLoading, addMessageToConversation } = messagesSlice.actions

export default messagesSlice.reducer
