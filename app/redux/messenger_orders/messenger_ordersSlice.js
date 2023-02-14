import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './messenger_ordersService'

export const messenger_ordersSlice = createSlice({
	name: 'messenger_orders',
	initialState: {
		isLoading: false,
		listado: [],
		selectedOrder: {}
	},
	extraReducers(builder) {
		builder
			.addCase(getMessengerOrders.fulfilled, (state, action) => {
				state.listado = action.payload
				state.isLoading = false
			})
			.addCase(setMessengerOrders.fulfilled, (state, action) => {
				state.listado = action.payload
			})
			.addCase(getSelectedOrder.fulfilled, (state, action) => {
				state.selectedOrder = action.payload
				state.isLoading = false
			})
			.addCase(setSelectedOrder.fulfilled, (state, action) => {
				state.selectedOrder = action.payload
			})
			.addCase(setOrderShippingStatus.fulfilled, (state, action) => {
				state.listado = action.payload
			})
			.addCase(setSelectedOrderShippingStatus.fulfilled, (state, action) => {
				state.selectedOrder = action.payload
			})
	},
})

export const listado = (state) => state.messenger_orders.listado

export const getMessengerOrders = createAsyncThunk(
	'messenger_orders/getMessengerOrders',
	service.getMessengerOrders
)
export const setMessengerOrders = createAsyncThunk(
	'messenger_orders/setMessengerOrders',
	service.setMessengerOrders
)
export const getSelectedOrder = createAsyncThunk(
	'messenger_orders/getSelectedOrder',
	service.getSelectedOrder
)
export const setSelectedOrder = createAsyncThunk(
	'messenger_orders/setSelectedOrder',
	service.setSelectedOrder
)
export const setOrderShippingStatus = createAsyncThunk(
	'messenger_orders/setOrderShippingStatus',
	service.setOrderShippingStatus
)
export const setSelectedOrderShippingStatus = createAsyncThunk(
	'messenger_orders/setSelectedOrderShippingStatus',
	service.setSelectedOrderShippingStatus
)

export const { setMessengerOrdersLoading } = messenger_ordersSlice.actions
export default messenger_ordersSlice.reducer
