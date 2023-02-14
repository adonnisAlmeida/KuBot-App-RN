import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getDarkMode,
	setDarkMode,
}

async function getDarkMode() {
	const value = await AsyncStorage.getItem('@darkmode')
	return value !== null ? (value == 'true' ? true : false) : false
}

function setDarkMode(value) {
	try {
		AsyncStorage.setItem('@darkmode', value.toString())
		return value
	} catch (e) {
		console.log('Error', { e })
	}
}
