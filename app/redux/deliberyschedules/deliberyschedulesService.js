import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getDeliberySchedules,
	setDeliberySchedules,
	getDeliberySchedulesSource,
	setDeliberySchedulesSource,
	removeDeliberySchedulesSource,
	addDeliberySchedulesSource,
	updateDeliberySchedulesSource
}

async function setDeliberySchedules(data) {
	const dataBack = await AsyncStorage.setItem('@deliberyschedules', JSON.stringify(data))
	return data
}

async function getDeliberySchedules() {
	const data = await AsyncStorage.getItem('@deliberyschedules')
	return data == null ? [] : JSON.parse(data)
}

async function setDeliberySchedulesSource(data) {
	const dataBack = await AsyncStorage.setItem('@deliberyschedulesSource', JSON.stringify(data))
	return data
}

async function getDeliberySchedulesSource() {
	const data = await AsyncStorage.getItem('@deliberyschedulesSource')
	return data == null ? [] : JSON.parse(data)
}

async function addDeliberySchedulesSource(delibery_schedule) {
	const data = await AsyncStorage.getItem('@deliberyschedulesSource')
	let events = JSON.parse(data)
	events.unshift(delibery_schedule)
	await AsyncStorage.setItem('@deliberyschedulesSource', JSON.stringify(events))
	return events
}

async function removeDeliberySchedulesSource(delibery_schedule_id) {
	const data = await AsyncStorage.getItem('@deliberyschedulesSource')
	let events = JSON.parse(data)
	const list = events.filter((event) => delibery_schedule_id != event.node.id)
	events.length = 0
	events.push(...list)
	await AsyncStorage.setItem('@deliberyschedulesSource', JSON.stringify(events))
	return events
}

async function updateDeliberySchedulesSource(delibery_schedule) {
	const data = await AsyncStorage.getItem('@deliberyschedulesSource')
	let events = JSON.parse(data)
	const list = events.filter((event) => delibery_schedule.node.id != event.node.id)
	events.length = 0
	events.push(delibery_schedule, ...list)
	await AsyncStorage.setItem('@deliberyschedulesSource', JSON.stringify(events))
	return events
}




