import { View, Text, ImageBackground, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TextInput, TouchableOpacity, ActivityIndicator, FlatList, ToastAndroid, BackHandler, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Typography } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { user } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useMutation } from '@apollo/client'
import { SEND_MESSAGE } from '../../graphql/messages'
import SenderMessage from './components/SenderMessage'
import { addMessageToConversation } from '../../redux/messages/messagesSlice'

const WriteMessageScreen = ({ route, navigation, ...props }) => {
    let selecteds = route.params?.selecteds
    const [localMessages, setLocalMessages] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [otroLoading, setOtroLoading] = useState(false)
    const [titleVisible, setTitleVisible] = useState(false)
    const [sendVisible, setSendVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const user_state = useSelector(user)
    const dispatch = useDispatch()

    useEffect(() => {
        if (content.length != 0) {
            setSendVisible(true)
        } else {
            setSendVisible(false)
        }
    }, [content])

    useEffect(() => {
        let ids = []
        selecteds.forEach(element => {
            ids.push(element.serverId)
        });
        setSelectedItems(ids)
        const backAction = () => {
            navigation.navigate('MessagesScreen')
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, [])

    const [sendMessageMutation, { loading, error, data }] = useMutation(SEND_MESSAGE, {
        onCompleted: (data) => {
            console.log('LO ENVIO >> ', data.messageCreate.message.recipients)
            data.messageCreate.message.recipients.forEach(item => {
                let newM = {
                    conversationUser: item,
                    message: data.messageCreate.message
                }
                dispatch(addMessageToConversation(newM))
            })
            
            setTitle('')
            setContent('')
            setTitleVisible(false)
            setLocalMessages(previousState => {
                //let newS = previousState.push(data.messageCreate.message)
                //console.log('previousState ', previousState)
                return [{message: data.messageCreate.message}, ...previousState]
                //return  previousState
            });
        },
        onError: (error, data) => {
            if (Platform.OS === 'android')
                ToastAndroid.show('Error enviando mensaje.', ToastAndroid.LONG)
            console.log('Error enviando mensaje >> ', error)
            console.log('Error enviando mensaje data >> ', data)
        },
    })

    const handleSend = () => {
        if (content.length > 0) {
            console.log(`selectedItems >> ${user_state.serverId} >>`, selectedItems)
            sendMessageMutation({
                variables: {
                    messageInput: {
                        "title": title,
                        "content": content,
                        "author": user_state.serverId,
                        "recipients": selectedItems
                    }
                }
            })
        }
    }

    const listaNombres = () => {
        let output = ''
        let isFirst = true

        try {
            selecteds.forEach((element) => {
                if (output.length >= 40) {
                    output += '...'
                    throw new Error("Break the loop.")
                }
                if (element.firstName) {
                    isFirst ? output += element.firstName : output += ', ' + element.firstName
                    isFirst = false
                } else {
                    isFirst ? output += element.userName : output += ', ' + element.userName
                    isFirst = false
                }
            })
        } catch (error) {
            console.log(error);
        }
        return output
    }

    navigation.setOptions({
        headerTitle: (props) => (
            <>
                <Typography bold color='#fff' size={20}>{selecteds.length} {selecteds.length == 1? 'destinatario': 'destinatarios'}</Typography>
                <Typography color='#fff' size={13}>{listaNombres()}</Typography>
            </>
        ),
        headerLeft: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.navigate('MessagesScreen')} style={{
                    flexDirection: 'row',
                    marginLeft: 12,
                    padding: 5,
                    borderRadius: 100,
                }}>
                    <Ionicons
                        name='arrow-back'
                        size={24}
                        color='#fff'
                        style={{ marginTop: 4 }}
                    />
                    <View style={{
                        height: 35,
                        width: 35,
                        borderRadius: 100,
                        marginLeft: 5,
                        backgroundColor: Colors.COLORS.WEB_START_OFF,
                    }}>
                        <Ionicons
                            style={{ marginTop: 5, marginLeft: 5 }}
                            name='megaphone-outline'
                            size={24}
                            color='rgba(0,0,0,0.4)'
                        />
                    </View>
                </TouchableOpacity>
            </View>
        ),
    })

    const chatBackground = require('../../../assets/chatBackground4.jpg')

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
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <>
                            <FlatList
                                data={localMessages}
                                style={{ paddingLeft: 14, paddingHorizontal: 10 }}
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end',}}
                                inverted={-1}
                                keyExtractor={item => item.message.serverId}
                                renderItem={({ item, index }) => {
                                    return (
                                        <SenderMessage key={item.message.serverId} message={item.message} />
                                    )
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
                                    flexDirection: 'row',
                                    marginHorizontal: 5,
                                    alignItems: 'flex-end'
                                }}>

                                    <View style={{
                                        paddingHorizontal: 5,
                                        flex: 1
                                    }}>
                                        <TextInput
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: 20,
                                                paddingHorizontal: 10,
                                                paddingLeft: 15,
                                                paddingRight: 100,
                                            }}
                                            placeholder='Cuerpo'
                                            onChangeText={setContent}
                                            value={content}
                                            multiline={true}
                                        />
                                    </View>
                                    <View style={{
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
                                                onPress={() => handleSend()}
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
                        </>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    )
}

export default WriteMessageScreen