import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './userLoginService'

export const userLoginSlice = createSlice({
	name: 'userlogin',
	initialState: {
		carrierInfo: {},
		user: {},
		userToken: "",
		isLogin: false,
		deviceToken: "",
		/* isCarrier: false,
		isStaff: false,
		isSeller: false */
	},
	extraReducers(builder) {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.user = action.payload
				state.userToken = action.payload.token
				state.isLogin = true
				//state.isCarrier = action.payload.isCarrier
			})
			.addCase(setUser.fulfilled, (state, action) => {
				state.user = action.payload
			})
			.addCase(logout.fulfilled, (state, action) => {
				state.user = action.payload
				state.isLogin = false
			})
			.addCase(getUser.fulfilled, (state, action) => {
				const user = action.payload
				state.user = user == null ? {} : user
				state.isLogin = user != null
			})
			.addCase(setCarrierInfo.fulfilled, (state, action) => {
				state.carrierInfo = action.payload
			})
			.addCase(setCarrierInfoOtro.fulfilled, (state, action) => {
				state.carrierInfo = action.payload
			})
			.addCase(getCarrierInfo.fulfilled, (state, action) => {
				const carrierInfo = action.payload
				state.carrierInfo = (carrierInfo && state.isLogin) ? carrierInfo : {}
			})
			.addCase(setToken.fulfilled, (state, action) => {
				state.userToken = action.payload
			})
			.addCase(getToken.fulfilled, (state, action) => {
				state.userToken = action.payload
			})
			.addCase(setUserAddresses.fulfilled, (state, action) => {
				state.user.addresses = action.payload
			})
			.addCase(setDeviceToken.fulfilled, (state, action) => {
				state.deviceToken = action.payload
			})
			.addCase(deleteDeviceToken.fulfilled, (state, action) => {
				state.deviceToken = ""
			})
	},
})

export const user = (state) => state.userlogin.user
export const userToken = (state) => state.userlogin.userToken
export const carrierInfo = (state) => state.userlogin.carrierInfo
export const isLogin = (state) => state.userlogin.isLogin
export const isCarrier = (state) => state.userlogin.isCarrier
export const deviceToken = (state) => state.userlogin.deviceToken

export const login = createAsyncThunk('userlogin/login', service.login)
export const logout = createAsyncThunk('userlogin/logout', service.logout)
export const getUser = createAsyncThunk('userlogin/getUser', service.getUser)
export const setUser = createAsyncThunk('userlogin/setUser', service.setUser)

export const setToken = createAsyncThunk('userlogin/setToken', service.setToken)
export const getToken = createAsyncThunk('userlogin/getToken', service.getToken)

export const setDeviceToken = createAsyncThunk('userlogin/setDeviceToken', service.setDeviceToken)
export const getDeviceToken = createAsyncThunk('userlogin/getDeviceToken', service.getDeviceToken)
export const deleteDeviceToken = createAsyncThunk('userlogin/deleteDeviceToken', service.deleteDeviceToken)

export const setCarrierInfo = createAsyncThunk('userlogin/setCarrierInfo', service.setCarrierInfo)
export const setCarrierInfoOtro = createAsyncThunk('userlogin/setCarrierInfoOtro', service.setCarrierInfoOtro)
export const getCarrierInfo = createAsyncThunk('userlogin/getCarrierInfo', service.getCarrierInfo)

export const setUserAddresses = createAsyncThunk('userlogin/setUserAddresses', service.setUserAddresses)

export default userLoginSlice.reducer
