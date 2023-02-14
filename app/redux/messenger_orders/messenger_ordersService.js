import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getMessengerOrders,
	setMessengerOrders,
	setSelectedOrder,
	getSelectedOrder,
	setOrderShippingStatus,
	setSelectedOrderShippingStatus,
}

async function setMessengerOrders(data) {
	const dataBack = await AsyncStorage.setItem('@messenger_orders', JSON.stringify(data))
	return data
}

async function getMessengerOrders() {
	const data = await AsyncStorage.getItem('@messenger_orders')
	return data == null ? [] : JSON.parse(data)
}
async function setSelectedOrder(data) {
	const dataBack = await AsyncStorage.setItem('@selected_orders', JSON.stringify(data))
	return data
}

async function getSelectedOrder() {
	const data = await AsyncStorage.getItem('@selected_orders')
	return data == null ? [] : JSON.parse(data)
}

async function setSelectedOrderShippingStatus(status) {
	const data = await AsyncStorage.getItem('@selected_orders')
	let order = JSON.parse(data)
	order.order.shippingStatus = status 
	//console.log("selecteddd")
	await AsyncStorage.setItem('@selected_orders', JSON.stringify(order))
	return order
}

async function setOrderShippingStatus(parametros) {
	const data = await AsyncStorage.getItem('@messenger_orders')
	let orders = JSON.parse(data)

	console.log(`cambia orden id ${parametros.id} al estado ${parametros.status}`)
	//console.log(`orders del storage`, orders)
	orders.map(order => {
		if(order.id === parametros.id){
			order.shippingStatus = parametros.status
		}
	})
	/* const list = orders.filter((order) => messenger_orders_id != order.id)
	orders.length = 0
	orders.push(...list) */
	await AsyncStorage.setItem('@messenger_orders', JSON.stringify(orders))
	return orders
}
/* async function removeMessengerOrders(messenger_orders_id) {
	const data = await AsyncStorage.getItem('@messenger_orders')
	let orders = JSON.parse(data)
	const list = orders.filter((order) => messenger_orders_id != order.id)
	orders.length = 0
	orders.push(...list)
	await AsyncStorage.setItem('@deliberyschedulesSource', JSON.stringify(orders))
	return orders
} */
