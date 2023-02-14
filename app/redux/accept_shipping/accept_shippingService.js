import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDeliveryAreasLoading } from './deliveryareasSlice';

export default {
	getAcceptShipping,
	setAcceptShipping,
	removeAcceptShipping,
}

async function setAcceptShipping(data) {
	const dataBack = await AsyncStorage.setItem('@accept_shipping', JSON.stringify(data))
	return data
}

async function removeAcceptShipping(accept_shipping_id) {
	const data = await AsyncStorage.getItem('@accept_shipping')
	let orders = JSON.parse(data)
	const list = orders.filter((order) => accept_shipping_id != order.id)
	orders.length = 0
	orders.push(...list)
	await AsyncStorage.setItem('@deliberyschedulesSource', JSON.stringify(orders))
	return orders
}

async function getAcceptShipping() {
	const data = await AsyncStorage.getItem('@accept_shipping')
	return data == null ? [] : JSON.parse(data)
}


