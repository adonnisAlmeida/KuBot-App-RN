import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import service from './deliveryareasService'

export const deliveryareasSlice = createSlice({
	name: 'deliveryareas',
	initialState: {
		isLoading: false,
		listado: [],
		allDeliveryAreas: [],
		ids: [],
	},
	reducers: {
		setDeliveryAreasLoading: (state, action) => {
			state.isLoading = true
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getDeliveryAreas.fulfilled, (state, action) => {
				state.listado = action.payload
				state.isLoading = false
			})
			.addCase(setDeliveryAreas.fulfilled, (state, action) => {
				state.listado = action.payload
			})
			.addCase(setAllDeliveryAreas.fulfilled, (state, action) => {
				state.allDeliveryAreas = action.payload
			})
			.addCase(getAllDeliveryAreas.fulfilled, (state, action) => {
				state.allDeliveryAreas = action.payload
			})
			.addCase(getDeliveryAreasIds.fulfilled, (state, action) => {
				state.ids = action.payload
			})
			.addCase(setDeliveryAreasIds.fulfilled, (state, action) => {
				state.ids = action.payload
			})
	},
})

export const listado = (state) => state.deliveryareas.listado
export const allDeliveryAreas = (state) => state.deliveryareas.allDeliveryAreas
export const deliveryAreasIds = (state) => state.deliveryareas.ids

export const getDeliveryAreas = createAsyncThunk(
	'deliveryareas/getDeliveryAreas',
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setDeliveryAreasLoading())
		return service.getDeliveryAreas()
	}
	
)
export const setDeliveryAreas = createAsyncThunk(
	'deliveryareas/setDeliveryAreas',
	service.setDeliveryAreas
)
export const setAllDeliveryAreas = createAsyncThunk(
	'deliveryareas/setAllDeliveryAreas',
	service.setAllDeliveryAreas
)
export const getAllDeliveryAreas = createAsyncThunk(
	'deliveryareas/getAllDeliveryAreas',
	service.getAllDeliveryAreas
)
export const setDeliveryAreasIds = createAsyncThunk(
	'deliveryareas/setDeliveryAreasIds',
	service.setDeliveryAreasIds
)
export const getDeliveryAreasIds = createAsyncThunk(
	'deliveryareas/getDeliveryAreasIds',
	service.getDeliveryAreasIds
)

export const { setDeliveryAreasLoading } = deliveryareasSlice.actions
export default deliveryareasSlice.reducer
