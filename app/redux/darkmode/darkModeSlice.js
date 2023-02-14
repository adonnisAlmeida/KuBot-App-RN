import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './darkModeService'

export const darkModeSlice = createSlice({
	name: 'darkmode',
	initialState: {
		isDarkMode: false,
		loading: false,
	},
	extraReducers(builder) {
		builder
			// getDarkMode
			.addCase(getDarkMode.pending, (state, action) => {
				state.loading = true
			})
			.addCase(getDarkMode.fulfilled, (state, action) => {
				state.isDarkMode = action.payload
				state.loading = false
			})
			.addCase(getDarkMode.rejected, (state, action) => {
				state.loading = false
			})
			// setDarkMode
			.addCase(setDarkMode.fulfilled, (state, action) => {
				state.isDarkMode = action.payload
			})
	},
})

export const isDarkMode = (state) => state.darkmode.isDarkMode
export const loading = (state) => state.darkmode.loading

export const getDarkMode = createAsyncThunk(
	'darkmode/getDarkMode',
	service.getDarkMode
)
export const setDarkMode = createAsyncThunk(
	'darkmode/setDarkMode',
	service.setDarkMode
)

export default darkModeSlice.reducer
