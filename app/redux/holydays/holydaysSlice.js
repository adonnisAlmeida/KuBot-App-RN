import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './holydaysService'

export const holydaysSlice = createSlice({
	name: 'holydays',
	initialState: {
		isLoading: false,
		hoylyDays: [],
	},
	reducers: {
		setHolyDaysLoading: (state, action) => {
			state.isLoading = true
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getHolyDaysByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
				state.isLoading = false
			})
			.addCase(setHolyDaysByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
			})
			.addCase(addHolyDaysByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
			})
			.addCase(removeHolyDaysByUser.fulfilled, (state, action) => {
				state.hoylyDays = action.payload
			})
	},
})

export const hoylyDays = (state) => state.holydays.hoylyDays

export const getHolyDaysByUser = createAsyncThunk(
	'holydays/getHolyDaysByUser',
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setHolyDaysLoading())
		return service.getHolyDaysByUser()
	}
	
)
export const setHolyDaysByUser = createAsyncThunk(
	'holydays/setHolyDaysByUser',
	service.setHolyDaysByUser
)
export const addHolyDaysByUser = createAsyncThunk(
	'holydays/addHolyDaysByUser',
	service.addHolyDaysByUser
)
export const removeHolyDaysByUser = createAsyncThunk(
	'holydays/removeHolyDaysByUser',
	service.removeHolyDaysByUser
)

export const { setHolyDaysLoading } = holydaysSlice.actions

export default holydaysSlice.reducer
