import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native'
import { useLazyQuery } from '@apollo/client'
import { Loading, NetworkError, Typography } from '../../components'
import MessagesList from './components/MessagesList'
import { MY_CONVERSATIONS, RECEIVED_MESSAGES, SENT_MESSAGES } from '../../graphql/messages'
import { useDispatch, useSelector } from 'react-redux'
import { conversations, receivedMessages, sentMessages, setConversations, setReceivedMessagesByUser, setSentMessagesByUser } from '../../redux/messages/messagesSlice'
import { user, carrierInfo } from '../../redux/userlogin/userLoginSlice'
import { FloatingAction } from 'react-native-floating-action'
import Colors from '../../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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
    const carrier_state = useSelector(carrierInfo)
    const conversation_reducer = useSelector(conversations)
    const dispatch = useDispatch()

    const [tempConversation, setTempConversation] = useState([])

  
    const [getConversations, { loadingConversations, errorConversations, dataConversations }] = useLazyQuery(MY_CONVERSATIONS, {
        onCompleted: (dataConversations) => {
            console.log("TERMINO CONVERSATIONS >> ", dataConversations.myConversations.edges.length)
            setTempConversation(dataConversations.myConversations.edges)
            dispatch(setConversations(dataConversations.myConversations.edges))
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
        },
        onError: (errorConversations) => {
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
            console.log('Error Cargando Conversaciones >> ', errorConversations)
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        setLoadingApp(true)
        getConversations()
    }, [])

    useEffect(() => {
        setTempConversation(conversation_reducer)
    }, [conversation_reducer])

    const renderLoader = () => {
        return loadingScroll ? <Loading /> : null
    }


    const reloadApp = () => {
        setLoadingApp(true)
        getConversations()
    }

    const doRefresh = () => {
        setFirstTime(true)
        setRefreshing(true)
        getConversations()
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

    const actionNewMessageCarrier = [
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

    const actionNewMessage = [
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
            {errorConversations ?
                (
                    <NetworkError accion={() => reloadApp()} />
                ) :
                (
                    <>
                        <View style={{ flex: 1 }}>
                            {tempConversation.length == 0 ? (
                                <>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Typography style={{ marginBottom: 10 }} h2>Usted no tiene mensajes aún. </Typography>
                                        <Typography >Puede comenzar a comunicarse con sus compañeros. Recuerde, una buena comunicación es la clave del éxito. </Typography>
                                    </View>
                                </>

                            ) : (
                                <MessagesList
                                    navigation={navigation}
                                    list={tempConversation}
                                    doRefresh={() => doRefresh()}
                                    //loadMore={() => loadMore()}
                                    renderLoader={renderLoader}
                                    refreshing={refreshing}
                                />
                            )}

                        </View>
                        <FloatingAction
                            color={Colors.COLORS.PRIMARY}
                            actions={carrier_state.kyc == 'APPROVED' ? actionNewMessageCarrier : actionNewMessage}
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