import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './onboardingService'

export const onboardingSlice = createSlice({
	name: 'onboarding',
	initialState: {
		active: true,
	},
	extraReducers(builder) {
		builder
			.addCase(getOnboarding.fulfilled, (state, action) => {
				state.active = action.payload
			})
			.addCase(setOnboarding.fulfilled, (state, action) => {
				state.active = action.payload
			})
	},
})

export const active = (state) => state.onboarding.active

export const getOnboarding = createAsyncThunk(
	'onboarding/getOnboarding',
	service.getOnboarding
)
export const setOnboarding = createAsyncThunk(
	'onboarding/setOnboarding',
	service.setOnboarding
)

export default onboardingSlice.reducer
