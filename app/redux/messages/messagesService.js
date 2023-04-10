import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	getReceivedMessagesByUser,
	getSentMessagesByUser,
	setReceivedMessagesByUser,
	setSentMessagesByUser,
	addSentMessagesByUser,
	getConversations,
	setConversations,
	addMessage,
}

async function setReceivedMessagesByUser(data) {
	const dataBack = await AsyncStorage.setItem('@received_messages', JSON.stringify(data))
	return data
}
async function setSentMessagesByUser(data) {
	const dataBack = await AsyncStorage.setItem('@sent_messages', JSON.stringify(data))
	return data
}

async function getSentMessagesByUser() {
	const data = await AsyncStorage.getItem('@sent_messages')
	let dataParsed = JSON.parse(data)
	return dataParsed == null ? [] : dataParsed
}
async function getReceivedMessagesByUser() {
	const data = await AsyncStorage.getItem('@received_messages')
	let dataParsed = JSON.parse(data)
	return dataParsed == null ? [] : dataParsed
}

async function setConversations(data) {
	const dataBack = await AsyncStorage.setItem('@Conversations', JSON.stringify(data))
	return data
}
async function getConversations() {
	const data = await AsyncStorage.getItem('@conversations')
	let dataParsed = JSON.parse(data)
	return dataParsed == null ? [] : dataParsed
}

async function addSentMessagesByUser(message) {
	const data = await AsyncStorage.getItem('@sent_messages')
	let messages = JSON.parse(data)
	messages.push(message)
	await AsyncStorage.setItem('@sent_messages', JSON.stringify(messages))
	return messages
}

async function addMessage(message) {
	console.log('ENTRO AL SERVICESSSS')
	const conversations = await AsyncStorage.getItem('@conversations')
	let allConversations = JSON.parse(conversations)
	allConversations.forEach(conver => {
		console.log('ENTRO AL SERVICESSSS FOR EAC')
		if(conver.usuario.serverId == message.usuario.serverId){
			conver.mensajes.push(message.mensaje)
		}
	});
	console.log('ENTRO AL SERVICESSSS ENDDD')
	await AsyncStorage.setItem('@conversations', JSON.stringify(allConversations))
	return allConversations
}
