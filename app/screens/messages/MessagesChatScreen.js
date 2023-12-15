import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList, TouchableOpacity, ImageBackground, Modal, ActivityIndicator, Image, ToastAndroid } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'
import { useState } from 'react'
import SenderMessage from './components/SenderMessage'
import ReceiverMessage from './components/ReceiverMessage'
import { Typography, Button, Loading } from '../../components'
import Colors from '../../constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { user } from '../../redux/userlogin/userLoginSlice'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { printCreated } from '../../utils/CommonFunctions'
import { FloatingAction } from 'react-native-floating-action'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { CONVERSATION, SEND_MESSAGE, UPDATE_MESSAGE_METADATA } from '../../graphql/messages'
import { useLazyQuery, useMutation } from '@apollo/client'
import moment from 'moment';
import { setMessageRead, addMessageToConversation, conversations, receivedMessages } from '../../redux/messages/messagesSlice'
import { useEffect } from 'react'
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType'

const MessagesChatScreen = ({ route, navigation, ...props }) => {
    const { colors } = useTheme()
    //let messages = route.params?.message
    const [otroLoading, setOtroLoading] = useState(false)
    const [titleVisible, setTitleVisible] = useState(false)
    const [sendVisible, setSendVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [allMessages, setAllMessages] = useState({})
    const [conversationUser, setConversationUser] = useState({})
    const [content, setContent] = useState('')
    const [messageModal, setMessageModal] = useState(false)
    const [loadingApp, setLoadingApp] = useState(false)
    const user_state = useSelector(user)
    const dispatch = useDispatch()
    const received_messages_state = useSelector(receivedMessages)
    const conversation_reducer = useSelector(conversations)

    //console.log("conversation_reducer >> ", conversation_reducer)

    const [sendMessageMutation, { loading, error, data }] = useMutation(SEND_MESSAGE, {
        onCompleted: (data) => {
            setMessageModal(false)
            console.log('LO ENVIO >> ', data.messageCreate)
            let newM = {
                conversationUser: conversationUser,
                message: data.messageCreate.message
            }
            setTitle('')
            setContent('')
            setTitleVisible(false)
            dispatch(addMessageToConversation(newM))
            setAllMessages(previousState => {
                //let newS = previousState.push(data.messageCreate.message)
                //console.log('previousState ', previousState)
                return [{ message: data.messageCreate.message }, ...previousState]
                //return  previousState
            });
            //console.log("allMessages >> ", allMessages)
        },
        onError: (error, data) => {
            if (Platform.OS === 'android')
                ToastAndroid.show('Error enviando mensaje.', ToastAndroid.LONG)
            console.log('Error enviando mensaje >> ', JSON.stringify(error, null, 2))
            console.log('Error enviando mensaje data >> ', JSON.stringify(data, null, 2))
        },
    })

    const [updateMessageMetadata, { loadingMetadata, errorMetadata, dataMetadata }] = useMutation(UPDATE_MESSAGE_METADATA, {
        onCompleted: (dataMetadata) => {
            dispatch(setMessageRead({
                conversationUser: conversationUser
            }))
            console.log(">>>> ACTUALIZO META dataMetadata >> ", dataMetadata)
        },
        onError: (errorMetadata, dataMetadata) => {
            console.log('Error ACTUALIZO META >> ', JSON.stringify(errorMetadata, null, 2))
            console.log('Error ACTUALIZO META data >> ', JSON.stringify(dataMetadata, null, 2))
        },
    })

    const [getConversation, { loadingConversation, errorConversation, dataConversation }] = useLazyQuery(CONVERSATION, {
        onCompleted: (dataConversation) => {
            console.log("TERMINO CONVERSATIONS >> ", dataConversation)
            setConversationUser(dataConversation.conversation.conversationUser)
            setAllMessages(dataConversation.conversation.messages)
            if (dataConversation.conversation.messages[0].isRead == false) {
                updateMessageMetadata({
                    variables: {
                        id: route.params.message.messages[0].serverId,
                        input: {
                            isRead: true
                        }
                    }
                })
            }
            setLoadingApp(false)
        },
        onError: (errorConversation) => {
            navigation.navigate('MessagesScreen')
            setLoadingApp(false)
            console.log('Error Cargando Conversaciones >> ', JSON.stringify(errorConversation, null, 2))
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        if (route.params?.conversation_id) {
            setLoadingApp(true)
            getConversation({ variables: { userId: route.params?.conversation_id } })
        } else {
            if (route.params?.message) {
                setConversationUser(route.params.message.conversationUser)
                setAllMessages(route.params.message.messages)
                if (route.params.message.messages[0].isRead == false) {
                    updateMessageMetadata({
                        variables: {
                            id: route.params.message.messages[0].serverId,
                            input: {
                                isRead: true
                            }
                        }
                    })
                }
            }
        }
    }, [])

    useEffect(() => {
        if (content.length != 0) {
            setSendVisible(true)
        } else {
            setSendVisible(false)
        }
    }, [content])



    const sendMessage = () => {
        if (content.length != 0) {
            sendMessageMutation({
                variables: {
                    messageInput: {
                        "title": title,
                        "content": content,
                        "author": user_state.serverId,
                        "recipients": [conversationUser.serverId]
                    }
                }
            })
        }
    }

    const avatar = conversationUser.avatar ? {
        uri: conversationUser.avatar.url,
    } : require('../../../assets/user_avatar.png')

    navigation.setOptions({
        title: `${conversationUser.firstName ? (conversationUser.firstName) : (conversationUser.userName)}`,
        headerLeft: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                    <Ionicons
                        name='arrow-back'
                        size={24}
                        color='#fff'
                        style={{ marginTop: 4 }}
                    />
                    {loadingApp ? (
                        <View style={{ padding: 8 }}>
                            <ActivityIndicator color={'#fff'} />
                        </View>
                    ) : (
                        <Image source={avatar} style={styles.image} />
                    )}
                </TouchableOpacity>
            </View>
        ),
    })

    const chatBackground = require('../../../assets/chatBackground4.jpg')
    //const chatBackground = require('../../../assets/chat_background5.png')

    const dateSeparator = (date) => {
        const today = new Date().setHours(0, 0, 0, 0)
        const moment1 = moment(date).add(1, 'd').format('DD/MM/YY')
        const moment2 = moment(today).format('DD/MM/YY')
        const parametro = new Date(date).setHours(0, 0, 0, 0)
        if (today == parametro)
            return 'Hoy'
        if (moment1 == moment2)
            return 'Ayer'

        return printCreated(date)
    }

    if (loadingApp) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                style={{ flex: 1 }}
                source={chatBackground}
                resizeMode="cover"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={90}
                >
                    <FlatList
                        data={allMessages}
                        style={{ paddingLeft: 14, paddingHorizontal: 10 }}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', }}
                        inverted={-1}
                        //keyExtractor={item => item.id}
                        renderItem={({ item, index }) => {
                            if (item.message.author.serverId == user_state.serverId) { // Mensajes enviados
                                if (index > 0 && (new Date(allMessages[index - 1].message.createdAt).setHours(0, 0, 0, 0) != new Date(item.message.createdAt).setHours(0, 0, 0, 0))) {
                                    if (index == allMessages.length - 1) {
                                        return (
                                            <>
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(allMessages[index - 1].message.createdAt)}</Typography>
                                                </View>
                                                <SenderMessage key={item.message.serverId} message={item.message} />
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(item.message.createdAt)}</Typography>
                                                </View>
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(allMessages[index - 1].message.createdAt)}</Typography>
                                                </View>
                                                <SenderMessage key={item.message.serverId} message={item.message} />
                                            </>
                                        )
                                    }
                                } else {
                                    if (index == allMessages.length - 1) {
                                        return (
                                            <>
                                                <SenderMessage key={item.message.serverId} message={item.message} />
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(item.message.createdAt)}</Typography>
                                                </View>
                                            </>
                                        )
                                    } else {
                                        return (<SenderMessage key={item.message.serverId} message={item.message} />)
                                    }
                                }
                            } else { // Mensajes recividos
                                if (index > 0 && (new Date(allMessages[index - 1].message.createdAt).setHours(0, 0, 0, 0) != new Date(item.message.createdAt).setHours(0, 0, 0, 0))) {
                                    if (index == allMessages.length - 1) {
                                        return (
                                            <>
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(allMessages[index - 1].message.createdAt)}</Typography>
                                                </View>
                                                <ReceiverMessage key={item.message.serverId} message={item.message} />
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(item.message.createdAt)}</Typography>
                                                </View>
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(allMessages[index - 1].message.createdAt)}</Typography>
                                                </View>
                                                <ReceiverMessage key={item.message.serverId} message={item.message} />
                                            </>
                                        )
                                    }
                                } else {
                                    if (index == allMessages.length - 1) {
                                        return (
                                            <>
                                                <ReceiverMessage key={item.message.serverId} message={item.message} />
                                                <View style={styles.dateSeparator}>
                                                    <Typography style={styles.dateSeparatorText}>{dateSeparator(item.message.createdAt)}</Typography>
                                                </View>
                                            </>
                                        )
                                    } else {
                                        return (<ReceiverMessage key={item.message.serverId} message={item.message} />)
                                    }
                                }
                            }
                        }}
                    />
                    <View style={{
                        paddingVertical: 8
                    }}>
                        {titleVisible ? (
                            <View style={{
                                paddingHorizontal: 10,
                            }}>
                                <TextInput
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 20,
                                        marginBottom: 10,
                                        paddingHorizontal: 15,
                                    }}
                                    placeholder='Título (opcional)'
                                    onChangeText={setTitle}
                                    //onSubmitEditing={sendMessage}
                                    value={title}
                                    multiline={true}
                                />
                            </View>
                        ) : (null)}
                        <View style={{
                            //backgroundColor: 'blue',
                            flexDirection: 'row',
                            //justifyContent: 'space-between',
                            marginHorizontal: 5,
                            alignItems: 'flex-end'
                        }}>

                            <View style={{
                                //backgroundColor: 'orange',
                                //flexGrow: 1,
                                paddingHorizontal: 5,
                                flex: 1
                            }}>
                                <TextInput
                                    style={{
                                        backgroundColor: '#fff',
                                        //backgroundColor: 'red',
                                        borderRadius: 20,
                                        paddingHorizontal: 10,
                                        paddingLeft: 15,
                                        paddingRight: 100,
                                        //width: '50%',
                                    }}
                                    placeholder='Cuerpo'
                                    onChangeText={setContent}
                                    //onSubmitEditing={sendMessage}
                                    value={content}
                                    multiline={true}
                                />
                            </View>
                            <View style={{
                                //backgroundColor: 'red'
                                position: 'absolute',
                                bottom: 3,
                                right: sendVisible ? 60 : 11,
                            }}>
                                <TouchableOpacity
                                    onPress={() => setTitleVisible(!titleVisible)}
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: 10,
                                        borderRadius: 100
                                    }}
                                >
                                    <Fontisto
                                        name="font"
                                        color={Colors.COLORS.PRIMARY}
                                        size={22}
                                    />
                                    <View style={{ position: 'absolute', bottom: 10, left: 5 }}>
                                        <Feather
                                            name="plus"
                                            color={Colors.COLORS.PRIMARY}
                                            size={17}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {sendVisible ? (
                                <View style={{
                                    //backgroundColor: 'red'
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0
                                }}>
                                    <TouchableOpacity
                                        disabled={otroLoading}
                                        onPress={() => sendMessage()}
                                        style={{
                                            backgroundColor: '#fff',
                                            paddingLeft: 7,
                                            paddingTop: 7,
                                            paddingBottom: 7,
                                            marginRight: 15,
                                            borderRadius: 100
                                        }}
                                    >
                                        {(loading) ? (
                                            <View style={{ marginBottom: 7, marginRight: 5 }}>
                                                <ActivityIndicator color={Colors.COLORS.PRIMARY} />
                                            </View>
                                        ) : (
                                            <Ionicons
                                                name="send"
                                                color={Colors.COLORS.PRIMARY}
                                                size={31}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ) : (null)}

                        </View>
                    </View>
                    <Modal
                        visible={messageModal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setMessageModal(false)}
                    >
                        <TouchableOpacity
                            style={styles.modalView}
                            onPressOut={() => setMessageModal(false)}
                        >
                            <View style={styles.modalContent}>
                                <Typography style={styles.inputLabel} color={'#606060'}>Título (opcional)</Typography>
                                <TextInput
                                    style={[styles.textInput, , { marginBottom: 15 }]}
                                    placeholder='Título'
                                    onChangeText={setTitle}
                                    onSubmitEditing={sendMessage}
                                    value={title}
                                    multiline={true}
                                />
                                <Typography style={styles.inputLabel} color={'#606060'}>Cuerpo</Typography>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder='Cuerpo'
                                    onChangeText={setContent}
                                    onSubmitEditing={sendMessage}
                                    value={content}
                                    multiline={true}
                                />
                                <Button
                                    color={Colors.COLORS.WEB_BUTTON}
                                    style={{ alignItems: 'center', borderRadius: 10, marginVertical: 16 }}
                                    onPress={() => sendMessage()}
                                >
                                    {(loading) ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Typography color="#ffffff">Enviar</Typography>
                                    )}
                                </Button>
                                {/* <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                                <Ionicons
                                    name="send"
                                    color={Colors.COLORS.PRIMARY}
                                    size={27}
                                />
                            </TouchableOpacity> */}
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    {/* <View style={styles.inputContent}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Enviar Mensaje...'
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                        multiline={true}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons
                            name="send"
                            color={Colors.COLORS.PRIMARY}
                            size={27}
                        />
                    </TouchableOpacity>
                </View> */}
                </KeyboardAvoidingView>
            </ImageBackground>

            {/* <FloatingAction
                color={Colors.COLORS.PRIMARY}
                floatingIcon={actionIcon('email-send')}
                overrideWithAction={true}
                actions={actionNewMessage}
                onPressItem={name => {
                    doAction(name)
                }}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    chatFooter: {
        paddingHorizontal: 16,
        paddingBottom: 5,
        //backgroundColor: '#fff',
    },
    image: {
        height: 35,
        width: 35,
        borderRadius: 100,
        marginLeft: 5,
    },
    headerLeft: {
        flexDirection: 'row',
        marginLeft: 12,
        padding: 5,
        borderRadius: 100,
    },
    headerRight: {
        marginRight: 20
    },
    inputLabel: {
        marginBottom: 5,
    },
    modalContent: {
        borderWidth: 1,
        borderColor: '#000',
        borderBottomWidth: 0,
        padding: 15,
        backgroundColor: '#e6e6e9',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalView: {
        flex: 1,
    },
    dateSeparatorText: {
        backgroundColor: '#e6e6e9',
        padding: 3,
        borderRadius: 6,
        paddingHorizontal: 10
    },
    dateSeparator: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    sendButton: {
        backgroundColor: Colors.COLORS.PRIMARY,
        borderRadius: 100,
        padding: 10,
        marginBottom: 3,
    },
    inputContent: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'baseline',
        width: '100%',
        //paddingVertical: 6,
        //marginHorizontal: 5,
        justifyContent: 'space-between'
    },
    textInput: {
        backgroundColor: "#fff",
        padding: 10,
        paddingLeft: 15,
        paddingRight: 50,
        color: '#000',
        borderRadius: 20,
        width: '73%',
        //height: 45,
    },
    addTitleButton: {
        backgroundColor: Colors.COLORS.PRIMARY,
        borderRadius: 100,
        padding: 9,
        /* position: 'absolute',
        bottom: 0,
        left: -40 */
    },
})

export default MessagesChatScreen