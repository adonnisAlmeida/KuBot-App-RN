import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getHolyDaysByUser,
	setHolyDaysByUser,
	addHolyDaysByUser,
	removeHolyDaysByUser,
}

async function setHolyDaysByUser(data) {
	const dataBack = await AsyncStorage.setItem('@holydays', JSON.stringify(data))
	return data
}

async function getHolyDaysByUser() {
	const data = await AsyncStorage.getItem('@holydays')
	let dataParsed = JSON.parse(data)
	return dataParsed == null ? [] : dataParsed
}

async function addHolyDaysByUser(holy_day) {
	const data = await AsyncStorage.getItem('@holydays')
	let holydays = JSON.parse(data)
	holydays.push(holy_day)
	await AsyncStorage.setItem('@holydays', JSON.stringify(holydays))
	return holydays
}

async function removeHolyDaysByUser(ids) {
	const data = await AsyncStorage.getItem('@holydays')
	let holidays = JSON.parse(data)
	const list = holidays.filter((list) => !ids.includes(list.node.serverId))
	holidays.length = 0
	holidays.push(...list)
	await AsyncStorage.setItem('@holydays', JSON.stringify(holidays))
	return holidays
}
