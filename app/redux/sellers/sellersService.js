import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getSellersByUser,
	setSellersByUser,
	addSellersByUser,
	removeSellersByUser,
}

async function setSellersByUser(data) {
	const dataBack = await AsyncStorage.setItem('@sellers', JSON.stringify(data))
	return data
}

async function getSellersByUser() {
	const data = await AsyncStorage.getItem('@sellers')
	let dataParsed = JSON.parse(data)
	return dataParsed == null ? [] : dataParsed
}

async function addSellersByUser(holy_day) {
	const data = await AsyncStorage.getItem('@sellers')
	let sellers = JSON.parse(data)
	sellers.push(holy_day)
	await AsyncStorage.setItem('@sellers', JSON.stringify(sellers))
	return sellers
}

async function removeSellersByUser(ids) {
	const data = await AsyncStorage.getItem('@sellers')
	let holidays = JSON.parse(data)
	const list = holidays.filter((list) => !ids.includes(list.id))
	holidays.length = 0
	holidays.push(...list)
	await AsyncStorage.setItem('@sellers', JSON.stringify(holidays))
	return holidays
}
