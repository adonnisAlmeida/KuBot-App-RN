import { View, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native'
import { useLazyQuery } from '@apollo/client'
import { Loading, NetworkError } from '../../components'
import MessagesList from './components/MessagesList'
import { RECEIVED_MESSAGES, SENT_MESSAGES } from '../../graphql/messages'
import { useDispatch, useSelector } from 'react-redux'
import { conversations, receivedMessages, sentMessages, setConversations, setReceivedMessagesByUser, setSentMessagesByUser } from '../../redux/messages/messagesSlice'
import { user } from '../../redux/userlogin/userLoginSlice'
import { FloatingAction } from 'react-native-floating-action'
import Colors from '../../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

let fake_messages = [
    {
        id: 1,
        'usuario': {
            id: 1,
            nombre: 'Manolo',
            avatar: 'bonito'
        },
        'mensaje': 'Esto es una prueba',
        'fecha': '24-05-2022',
        'leido': true
    },
    {
        id: 2,
        'usuario': {
            id: 1,
            nombre: 'Manolo',
            avatar: 'bonito'
        },
        'mensaje': 'Otro mensaje',
        'fecha': '24-05-2022',
        'leido': false
    },
    {
        id: 3,
        'usuario': {
            id: 1,
            nombre: 'Manolo',
            avatar: 'bonito'
        },
        'mensaje': 'Este tiene mas texto de pueba para ver como queda en una burbuja bien grande que no quepa en el telefono',
        'fecha': '24-05-2022',
        'leido': false
    },
    {
        id: 4,
        'usuario': {
            id: 2,
            nombre: 'Fatima',
            avatar: 'bonito'
        },
        'mensaje': 'tiene  ok Mensaje de fatima Este tiene mas texto de pueba para ver como queda en una burbuja bien grande que no quepa en el telefono',
        'fecha': '24-05-2022',
        'leido': false
    },
    {
        id: 5,
        'usuario': {
            id: 2,
            nombre: 'Fatima',
            avatar: 'bonito'
        },
        'mensaje': 'Este si que esta bueno',
        'fecha': '24-05-2022',
        'leido': false
    },
]

const MessagesScreen = ({ navigation }) => {
    const { colors } = useTheme()
    const [loadingApp, setLoadingApp] = useState(false)
    const [messages, setMessages] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [loadingScroll, setLoadingScroll] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [firstTime, setFirstTime] = useState(false)
    const [endCursor, setEndCursor] = useState("")
    const user_state = useSelector(user)
    const conversation_reducer = useSelector(conversations)
    const dispatch = useDispatch()
    const [tempConversation, setTempConversation] = useState([])

    const [getSentMessages, { loadingSent, errorSent, dataSent }] = useLazyQuery(SENT_MESSAGES, {
        onCompleted: (dataSent) => {
            console.log("TERMINO SENT", dataSent.messages.pageInfo.hasNextPage)
            if (dataSent.messages.pageInfo.hasNextPage) {
                setHasNextPage(dataSent.messages.pageInfo.hasNextPage)
                setEndCursor(dataSent.messages.pageInfo.endCursor)
                makeConversationsSent(dataSent.messages.edges, false)
                getSentMessages({ variables: { after: dataSent.messages.pageInfo.endCursor, before: '', author: user_state.serverId }, })
            } else {
                setHasNextPage(false)
                makeConversationsSent(dataSent.messages.edges, true)
            }
            //dispatch(setSentMessagesByUser(dataSent.messages.edges))
            /* setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false) */
            //makeConversationsSent(dataSent.messages.edges)
        },
        onError: (errorSent) => {
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
            console.log('Error Cargando getSentMessages >> ', errorSent)
        },
        fetchPolicy: "no-cache"
    })

    const [getReceivedMessages, { loadingReceived, errorReceived, dataReceived }] = useLazyQuery(RECEIVED_MESSAGES, {
        onCompleted: (dataReceived) => {
            console.log("TERMINO RECEIVED >> ", dataReceived.messages.pageInfo.hasNextPage)
            if (dataReceived.messages.pageInfo.hasNextPage) {
                setHasNextPage(dataReceived.messages.pageInfo.hasNextPage)
                setEndCursor(dataReceived.messages.pageInfo.endCursor)
                makeConversationsReceived(dataReceived.messages.edges)
                getReceivedMessages({ variables: { after: dataReceived.messages.pageInfo.endCursor, before: '', recipients: user_state.serverId }, })
            } else {
                setHasNextPage(false)
                makeConversationsReceived(dataReceived.messages.edges)
                getSentMessages({ variables: { after: '', before: '', author: user_state.serverId }, })
            }
            //dispatch(setReceivedMessagesByUser(dataReceived.messages.edges))
            /* setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false) */
            /* makeConversationsReceived(dataReceived.messages.edges)
            getSentMessages({ variables: { after: '', before: '', author: user_state.serverId }, }) */
        },
        onError: (errorReceived) => {
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
            console.log('Error Cargando getReceivedMessages >> ', errorReceived)
        },
        fetchPolicy: "no-cache"
    })

    const makeConversationsSent = (sents, ultimo) => {
        console.log("hacer converzacion con enviados >> ", sents.length)
        let tem = []
        let flag = false
        //console.log("tempConversation> ", tempConversation)
        tempConversation.forEach(item => tem.push(item))
        sents.forEach(sent => {
            //console.log(sent)
            sent.node.recipients.forEach(re => {
                //console.log("RECC> ", re)
                //console.log("RECC> ", tempConversation)
                tem.forEach(tempC => {
                    /* console.log("RECC> ", re)
                    console.log("tempC ", tempC) */
                    if (re.serverId == tempC.usuario.serverId) {
                        flag = true
                        tempC.mensajes.push(sent.node)
                    }
                })
                if (!flag) {
                    let conv = {
                        usuario: re,
                        mensajes: [sent.node],
                    }
                    tem.push(conv)
                }
                flag = false
            })
        })
        tem = sortMessages(tem)
        if (ultimo) {
            tem = sortConversation(tem)
            dispatch(setConversations(tem))
            //setTempConversation(tem)
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
        } else {
            setTempConversation(tem)
        }


        //setConversations(tempConversation)
        //console.log("tempConversation desde sent", tempConversation)

    }

    const sortMessages = (mess) => {
        mess.forEach(m => {
            m.mensajes = m.mensajes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).reverse()
        })
        return mess
    }

    const sortConversation = (mess) => {
        mess = mess.sort((a, b) => new Date(a.mensajes[0].createdAt) - new Date(b.mensajes[0].createdAt)).reverse()
        return mess
    }

    const makeConversationsReceived = (received) => {
        console.log("hacer converzacion con recividos >> ", received.length)
        let tem = []
        //console.log("tempConversation> ", tempConversation)
        if (!refreshing && !firstTime) {//cunado esta refrescando y no es primera vez
            tempConversation.forEach(item => tem.push(item))
            console.log("Entro 1")
        }else if(refreshing && firstTime){
            console.log("Entro 2")
            setFirstTime(false)
        }else if (refreshing && !firstTime){
            console.log("Entro 3")
            tempConversation.forEach(item => tem.push(item))
        }

        received.forEach(newC => {
            let flag = false
            tem.forEach(oldC => {
                if (oldC.usuario.serverId == newC.node.author.serverId) {
                    flag = true
                    oldC.mensajes.push(newC.node)
                }
            })
            if (!flag) {
                let conv = {
                    usuario: newC.node.author,
                    mensajes: [newC.node],
                }
                tem.push(conv)
            }
        })
        //tem = sortMessages(tem)
        setTempConversation(tem)
        //setConversations(tem)
        /* console.log("tempConversation desde recividos", tempConversation)
        console.log("hacer converzacion con recividos >> ", received.length) */
    }

    useEffect(() => {
        setLoadingApp(true)
        //getSentMessages({ variables: { after: '', before: '', author: user_state.serverId }, })
        getReceivedMessages({ variables: { after: '', before: '', recipients: user_state.serverId }, })
        // makeConversations()
    }, [])

    useEffect(() => {
        setTempConversation(conversation_reducer)
    }, [conversation_reducer])

    const renderLoader = () => {
        return loadingScroll ? <Loading /> : null
    }

    const loadMore = () => {
        if (hasNextPage) {
            setLoadingScroll(true)
            console.log(`CARGA MAS DATOSSS con endCursor > ${endCursor}`)
            getReceivedMessages({ variables: { after: endCursor, before: '', recipients: user_state.serverId }, })
            //getMessages({ variables: { after: endCursor, before: '' } })
        }
    }

    const reloadApp = () => {
        setLoadingApp(true)
        getReceivedMessages({ variables: { after: '', before: '', recipients: user_state.serverId }, })
        //getMessages({ variables: { after: '', before: '' } })
    }

    const doRefresh = () => {
        setFirstTime(true)
        setRefreshing(true)
        getReceivedMessages({ variables: { after: '', before: '', recipients: user_state.serverId }, })
        //getMessages({ variables: { after: '', before: '' } })
    }

    const actionIcon = (name) => {
        return (
            <MaterialCommunityIcons
                name={name}
                size={24}
                color={colors.SURFACE}
            />
        )
    }

    const actionNewMessage = [
        {
            text: "Nuevo Mensaje",
            icon: actionIcon('email-plus-outline'),
            name: "bt_new_message",
            position: 1,
            color: Colors.COLORS.PRIMARY
        },
        {
            text: "Actualizar",
            icon: actionIcon('reload'),
            name: "bt_update",
            position: 2,
            color: Colors.COLORS.PRIMARY
        },
    ];

    const doAction = (action) => {
        switch (action) {
            case 'bt_new_message':
                navigation.navigate("NewMessageScreen")
                break;
            case 'bt_update':
                doRefresh()
                break;
        }
    }

    if (loadingApp) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            {errorSent || errorReceived ?
                (
                    <NetworkError accion={() => reloadApp()} />
                ) :
                (
                    <>
                        <View>
                            <MessagesList
                                navigation={navigation}
                                list={tempConversation}
                                doRefresh={() => doRefresh()}
                                //loadMore={() => loadMore()}
                                renderLoader={renderLoader}
                                refreshing={refreshing}
                            />
                        </View>
                        <FloatingAction
                            color={Colors.COLORS.PRIMARY}
                            actions={actionNewMessage}
                            onPressItem={name => {
                                doAction(name)
                            }}
                        />
                    </>
                )
            }
        </View>
    )
}

export default MessagesScreen