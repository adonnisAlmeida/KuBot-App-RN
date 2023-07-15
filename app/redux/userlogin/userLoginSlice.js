import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './userLoginService'

export const userLoginSlice = createSlice({
	name: 'userlogin',
	initialState: {
		carrierInfo: {},
		user: {},
		isLogin: false,
		isCarrier: false,
		isStaff: false,
		isSeller: false
	},
	extraReducers(builder) {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.user = action.payload
				state.isLogin = true
				state.isCarrier = action.payload.isCarrier
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
				state.user = {  ...state.user, token: action.payload }
			})
			.addCase(setUserAddresses.fulfilled, (state, action) => {
				state.user.addresses = action.payload
			})
			.addCase(userInfoUpdate.fulfilled, (state, action) => {
				/* state.isCarrier = action.payload.isCarrier
				state.isStaff = action.payload.isStaff
				state.isSeller = action.payload.isSeller */
				state.user = {
					...state.user,
					isCarrier: action.payload.isCarrier,
					isStaff: action.payload.isStaff,
					isSeller: action.payload.isSeller
				}
			})
	},
})

export const user = (state) => state.userlogin.user
export const carrierInfo = (state) => state.userlogin.carrierInfo
export const isLogin = (state) => state.userlogin.isLogin
export const isCarrier = (state) => state.userlogin.isCarrier

export const login = createAsyncThunk('userlogin/login', service.login)
export const logout = createAsyncThunk('userlogin/logout', service.logout)
export const getUser = createAsyncThunk('userlogin/getUser', service.getUser)
export const setUser = createAsyncThunk('userlogin/setUser', service.setUser)
export const setCarrierInfo = createAsyncThunk('userlogin/setCarrierInfo', service.setCarrierInfo)
export const setCarrierInfoOtro = createAsyncThunk('userlogin/setCarrierInfoOtro', service.setCarrierInfoOtro)
export const getCarrierInfo = createAsyncThunk('userlogin/getCarrierInfo', service.getCarrierInfo)
export const setToken = createAsyncThunk('userlogin/setToken', service.setToken)
export const setUserAddresses = createAsyncThunk('userlogin/setUserAddresses', service.setUserAddresses)
export const userInfoUpdate = createAsyncThunk('userlogin/userInfoUpdate', service.userInfoUpdate)

export default userLoginSlice.reducer
