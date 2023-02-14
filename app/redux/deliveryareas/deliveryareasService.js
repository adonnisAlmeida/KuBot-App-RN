import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDeliveryAreasLoading } from './deliveryareasSlice';

export default {
	getDeliveryAreas,
	setDeliveryAreas,
	getAllDeliveryAreas,
	setAllDeliveryAreas,
	getDeliveryAreasIds,
	setDeliveryAreasIds,
}

/* function setDeliveryAreas(data) {
	console.log('DEL SERVICIO',{ data: JSON.stringify(data) })
	AsyncStorage.setItem('@deliveryareas', JSON.stringify(data))
	return user
} */

async function setDeliveryAreas(data) {
	const dataBack = await AsyncStorage.setItem('@deliveryareas', JSON.stringify(data))
	return data
}

async function getDeliveryAreas() {
	const data = await AsyncStorage.getItem('@deliveryareas')
	return data == null ? [] : JSON.parse(data)
}

async function setAllDeliveryAreas(data) {
	const dataBack = await AsyncStorage.setItem('@alldeliveryareas', JSON.stringify(data))
	return data
}

async function getAllDeliveryAreas() {
	const data = await AsyncStorage.getItem('@alldeliveryareas')
	return data == null ? [] : JSON.parse(data)
}

async function setDeliveryAreasIds(data) {
	const dataBack = await AsyncStorage.setItem('@deliveryareasIds', JSON.stringify(data))
	return data
}

async function getDeliveryAreasIds() {
	const data = await AsyncStorage.getItem('@deliveryareasIds')
	return data == null ? [] : JSON.parse(data)
}
