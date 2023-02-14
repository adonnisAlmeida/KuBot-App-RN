import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getClientsByUser,
	setClientsByUser,
	addClientsByUser,
	removeClientsByUser,
}

async function setClientsByUser(data) {
	const dataBack = await AsyncStorage.setItem('@clients', JSON.stringify(data))
	return data
}

async function getClientsByUser() {
	const data = await AsyncStorage.getItem('@clients')
	let dataParsed = JSON.parse(data)
	return dataParsed == null ? [] : dataParsed
}

async function addClientsByUser(holy_day) {
	const data = await AsyncStorage.getItem('@clients')
	let clients = JSON.parse(data)
	clients.push(holy_day)
	await AsyncStorage.setItem('@clients', JSON.stringify(clients))
	return clients
}

async function removeClientsByUser(ids) {
	const data = await AsyncStorage.getItem('@clients')
	let holidays = JSON.parse(data)
	const list = holidays.filter((list) => !ids.includes(list.id))
	holidays.length = 0
	holidays.push(...list)
	await AsyncStorage.setItem('@clients', JSON.stringify(holidays))
	return holidays
}
