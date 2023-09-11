import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getUser,
	setUser,
	login,
	logout,
	setCarrierInfo,
	getCarrierInfo,
	setCarrierInfoOtro,
	setToken,
	getToken,
	setUserAddresses,
	setDeviceToken,
	deleteDeviceToken,
}

function setDeviceToken(token) {
	AsyncStorage.setItem('@deviceToken', JSON.stringify(token))
	return token
}

function deleteDeviceToken() {
	AsyncStorage.removeItem('@deviceToken')
	return {}
}

function login(user) {
	AsyncStorage.setItem('@userlogin', JSON.stringify(user))
	AsyncStorage.setItem('@usertoken', JSON.stringify(user.token))
	return user
}

function setUser(user) {
	AsyncStorage.setItem('@userlogin', JSON.stringify(user))
	return user
}

async function getUser() {
	const user = await AsyncStorage.getItem('@userlogin')
	return user == null ? null : JSON.parse(user)
}

async function setToken(token) {
	AsyncStorage.setItem('@usertoken', JSON.stringify(token))
	return token
}

async function getToken() {
	const token = await AsyncStorage.getItem('@usertoken')
	return token == null ? null : JSON.parse(token)
}

function logout() {
	try {
		AsyncStorage.removeItem('@userlogin')
		return {}
	} catch (e) {
		console.log('Error', { e })
	}
}

async function setUserAddresses(addresses) {
	const data = await AsyncStorage.getItem('@userlogin')
	let userInfo = JSON.parse(data)
	userInfo.addresses = addresses
	await AsyncStorage.setItem('@userlogin', JSON.stringify(userInfo))
	return addresses
}

function setCarrierInfo(carrier) {
	//const carrierInfo = carrier.carriers.edges[0].node
	AsyncStorage.setItem('@carrierInfo', JSON.stringify(carrier))
	return carrier
}

function setCarrierInfoOtro(carrier) {
	AsyncStorage.setItem('@carrierInfo', JSON.stringify(carrier))
	return carrier
}

async function getCarrierInfo() {
	const carrier = await AsyncStorage.getItem('@carrierInfo')
	return carrier == null ? null : JSON.parse(carrier)
}
