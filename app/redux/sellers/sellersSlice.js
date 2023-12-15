import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './sellersService'

export const sellersSlice = createSlice({
	name: 'sellers',
	initialState: {
		isLoading: false,
		sellers: [],
	},
	reducers: {
		setSellersLoading: (state, action) => {
			state.isLoading = true
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getSellersByUser.fulfilled, (state, action) => {
				state.sellers = action.payload
				state.isLoading = false
			})
			.addCase(setSellersByUser.fulfilled, (state, action) => {
				state.sellers = action.payload
			})
			.addCase(addSellersByUser.fulfilled, (state, action) => {
				state.sellers = action.payload
			})
			.addCase(removeSellersByUser.fulfilled, (state, action) => {
				state.sellers = action.payload
			})
	},
})

export const hoylyDays = (state) => state.sellers.hoylyDays
export const sellers = (state) => state.sellers.sellers

export const getSellersByUser = createAsyncThunk(
	'sellers/getSellersByUser',
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setSellersLoading())
		return service.getSellersByUser()
	}
	
)
export const setSellersByUser = createAsyncThunk(
	'sellers/setSellersByUser',
	service.setSellersByUser
)
export const addSellersByUser = createAsyncThunk(
	'sellers/addSellersByUser',
	service.addSellersByUser
)
export const removeSellersByUser = createAsyncThunk(
	'sellers/removeSellersByUser',
	service.removeSellersByUser
)

export const { setSellersLoading } = sellersSlice.actions

export default sellersSlice.reducer
