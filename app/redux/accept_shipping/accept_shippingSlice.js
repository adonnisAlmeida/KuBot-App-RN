import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './accept_shippingService'

export const accept_shippingSlice = createSlice({
	name: 'accept_shipping',
	initialState: {
		isLoading: false,
		listado: [],
	},
	extraReducers(builder) {
		builder
			.addCase(getAcceptShipping.fulfilled, (state, action) => {
				state.listado = action.payload
				state.isLoading = false
			})
			.addCase(setAcceptShipping.fulfilled, (state, action) => {
				state.listado = action.payload
			})
			.addCase(removeAcceptShipping.fulfilled, (state, action) => {
				state.listado = action.payload
			})
	},
})

export const listado = (state) => state.accept_shipping.listado

export const getAcceptShipping = createAsyncThunk(
	'accept_shipping/getAcceptShipping',
	service.getAcceptShipping
)
export const setAcceptShipping = createAsyncThunk(
	'accept_shipping/setAcceptShipping',
	service.setAcceptShipping
)
export const removeAcceptShipping = createAsyncThunk(
	'accept_shipping/removeAcceptShipping',
	service.removeAcceptShipping
)

export const { setAcceptShippingLoading } = accept_shippingSlice.actions
export default accept_shippingSlice.reducer
