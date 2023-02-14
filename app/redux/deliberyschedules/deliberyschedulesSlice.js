import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './deliberyschedulesService'

export const deliberyschedulesSlice = createSlice({
	name: 'deliberyschedules',
	initialState: {
		list: {}, // estos son los que tiene las reglas aplicadas, van directo a agenda
		source: [] // esta es del grahql, sin aplicarle reglas
	},
	extraReducers(builder) {
		builder
			.addCase(getDeliberySchedules.fulfilled, (state, action) => {
				state.list = action.payload
			})
			.addCase(setDeliberySchedules.fulfilled, (state, action) => {
				state.list = action.payload
			})
			.addCase(getDeliberySchedulesSource.fulfilled, (state, action) => {
				state.source = action.payload
			})
			.addCase(setDeliberySchedulesSource.fulfilled, (state, action) => {
				state.source = action.payload
			})
			.addCase(addDeliberySchedulesSource.fulfilled, (state, action) => {
				state.source = action.payload
			})
			.addCase(removeDeliberySchedulesSource.fulfilled, (state, action) => {
				state.source = action.payload
			})
			.addCase(updateDeliberySchedulesSource.fulfilled, (state, action) => {
				state.source = action.payload
			})
	},
})

export const delivery_schedules_list = (state) => state.deliberyschedules.list
export const delivery_schedules_source = (state) => state.deliberyschedules.source

export const getDeliberySchedules = createAsyncThunk(
	'deliberyschedules/getDeliberySchedules',
	service.getDeliberySchedules
)
export const setDeliberySchedules = createAsyncThunk(
	'deliberyschedules/setDeliberySchedules',
	service.setDeliberySchedules
)
export const getDeliberySchedulesSource = createAsyncThunk(
	'deliberyschedules/getDeliberySchedulesSource',
	service.getDeliberySchedulesSource
)
export const setDeliberySchedulesSource = createAsyncThunk(
	'deliberyschedules/setDeliberySchedulesSource',
	service.setDeliberySchedulesSource
)
export const addDeliberySchedulesSource = createAsyncThunk(
	'deliberyschedules/addDeliberySchedulesSource',
	service.addDeliberySchedulesSource
)
export const removeDeliberySchedulesSource = createAsyncThunk(
	'deliberyschedules/removeDeliberySchedulesSource',
	service.removeDeliberySchedulesSource
)
export const updateDeliberySchedulesSource = createAsyncThunk(
	'deliberyschedules/updateDeliberySchedulesSource',
	service.updateDeliberySchedulesSource
)

export default deliberyschedulesSlice.reducer
