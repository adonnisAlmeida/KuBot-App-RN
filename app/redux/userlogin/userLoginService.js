import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getUser,
	setUser,
	login,
	logout,
	setCarrierInfo,
	getCarrierInfo,
	setCarrierInfoOtro,
}

function login(user) {
	AsyncStorage.setItem('@userlogin', JSON.stringify(user))
	return user
}

function setCarrierInfo(carrier) {
	const carrierInfo = carrier.carriers.edges[0].node
	AsyncStorage.setItem('@carrierInfo', JSON.stringify(carrierInfo))
	return carrierInfo
}

function setCarrierInfoOtro(carrier) {
	AsyncStorage.setItem('@carrierInfo', JSON.stringify(carrier))
	return carrier
}

async function getCarrierInfo() {
	const carrier = await AsyncStorage.getItem('@carrierInfo')
	return carrier == null ? null : JSON.parse(carrier)
}

function setUser(user) {
	return login(user)
}

async function getUser() {
	const user = await AsyncStorage.getItem('@userlogin')
	return user == null ? null : JSON.parse(user)
}

function logout() {
	try {
		AsyncStorage.removeItem('@userlogin')
		return {}
	} catch (e) {
		console.log('Error', { e })
	}
}