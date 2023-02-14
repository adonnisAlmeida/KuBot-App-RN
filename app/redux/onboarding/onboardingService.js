import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getOnboarding,
	setOnboarding,
}

async function getOnboarding() {
	const value = await AsyncStorage.getItem('@onboarding')
	return value !== null ? (value == 'true' ? true : false) : true
}

function setOnboarding(value) {
	try {
		AsyncStorage.setItem('@onboarding', value.toString())
		return value
	} catch (e) {
		console.log('Error', { e })
	}
}
