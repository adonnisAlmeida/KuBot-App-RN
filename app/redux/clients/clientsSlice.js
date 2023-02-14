import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './clientsService'

export const clientsSlice = createSlice({
	name: 'clients',
	initialState: {
		isLoading: false,
		clients: [],
	},
	reducers: {
		setClientsLoading: (state, action) => {
			state.isLoading = true
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getClientsByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
				state.isLoading = false
			})
			.addCase(setClientsByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
			})
			.addCase(addClientsByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
			})
			.addCase(removeClientsByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
			})
	},
})

export const hoylyDays = (state) => state.clients.hoylyDays

export const getClientsByUser = createAsyncThunk(
	'clients/getClientsByUser',
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setClientsLoading())
		return service.getClientsByUser()
	}
	
)
export const setClientsByUser = createAsyncThunk(
	'clients/setClientsByUser',
	service.setClientsByUser
)
export const addClientsByUser = createAsyncThunk(
	'clients/addClientsByUser',
	service.addClientsByUser
)
export const removeClientsByUser = createAsyncThunk(
	'clients/removeClientsByUser',
	service.removeClientsByUser
)

export const { setClientsLoading } = clientsSlice.actions

export default clientsSlice.reducer
