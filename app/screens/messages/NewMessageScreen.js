import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, ScrollView, ActivityIndicator, ToastAndroid, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Input, Loading, Select, Typography } from '../../components'
import MultiSelect from 'react-native-multiple-select';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ALL_USERS, ORDERS_LIST_CONTACTS, SEND_MESSAGE } from '../../graphql/messages';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { carrierInfo, user } from '../../redux/userlogin/userLoginSlice';
import { addMessageToConversation, conversations } from '../../redux/messages/messagesSlice';
import UserItem from './components/UserItem';
import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons'


const NewMessageScreen = ({ navigation }) => {
    const [title, setTitle] = useState('')
    const [search, setSearch] = useState('')
    const [showSearchClose, setShowSearchClose] = useState(false)
    const [content, setContent] = useState('')
    const [mySelectedItems, setMySelectedItems] = useState([]);
    const [mySelectedItemsObject, setMySelectedItemsObject] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [allUsers, setAllUsers] = useState([])
    const [tempUsers, setTemUsers] = useState([])
    const [allUsersShow, setAllUsersShow] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [enviando, setEnviando] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [endCursor, setEndCursor] = useState("")
    const user_state = useSelector(user)
    const carrier_info = useSelector(carrierInfo)
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([])
    const conversation_reducer = useSelector(conversations)

    //console.log(carrier_info)

    const [getAllContacts, { loadingContacts, errorContacts, dataContacts }] = useLazyQuery(ORDERS_LIST_CONTACTS, {
        onCompleted: (dataContacts) => {
            console.log("Termino de cargar las ordenes", dataContacts.orders.edges.length)
            if (dataContacts.orders.pageInfo.hasNextPage) {
                actualizarUsuarios(dataContacts.orders.edges)
                getAllContacts({ variables: { carrier: carrier_info.serverId, after: dataContacts.orders.pageInfo.endCursor, before: '' } })
            } else {
                actualizarUsuarios(dataContacts.orders.edges)
                setLoadingUsers(false)
            }
            /* if (dataContacts.users.pageInfo.hasNextPage) {
                actualizarUsuarios(data.users.edges)
                getAllUsers({ variables: { after: data.users.pageInfo.endCursor, before: '' } })
            } else {
                actualizarUsuarios(data.users.edges)
                setLoadingUsers(false)
            } */
        },
        onError: (errorContacts) => {
            console.log('Error Cargando todos los contactos >> ', errorContacts)
            console.log('Error Cargando todos los usuarios DATA >> ', dataContacts)
        },
        fetchPolicy: "no-cache"
    })

    const [getAllUsers, { loading, error, data }] = useLazyQuery(ALL_USERS, {
        onCompleted: (data) => {
            if (data.users.pageInfo.hasNextPage) {
                actualizarUsuarios(data.users.edges)
                getAllUsers({ variables: { after: data.users.pageInfo.endCursor, before: '' } })
            } else {
                actualizarUsuarios(data.users.edges)
                setLoadingUsers(false)
            }
            /* setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false) */
            //actualizarUsuarios(data.users.edges)
            //setLoadingUsers(false)
            //setAllUsers(data.users.edges)
        },
        onError: (error) => {
            console.log('Error Cargando todos los usuarios >> ', error)
            console.log('Error Cargando todos los usuarios DATA >> ', data)
        },
        fetchPolicy: "no-cache"
    })

    const navigateConversation = () => {
        console.log('Entrooo navigateConversation')
        if (mySelectedItemsObject.length > 1) {
            console.log('Entrooo mySelectedItemsObject.length > 1')
            navigation.navigate('WriteMessageScreen', { selecteds: mySelectedItemsObject })
        } else {
            console.log('Entrooo mySelectedItemsObject.length > 1 else')
            let flag = false
            conversation_reducer.forEach(conv => {
                if (conv.usuario.serverId == mySelectedItemsObject[0].serverId) {
                    flag = true
                    console.log('Entrooo conv.usuario.serverId == mySelectedItemsObject[0].serverId')
                    navigation.navigate('MessagesChatScreen', { message: conv })
                }
            })
            if (!flag) {
                console.log('Entrooo mySelectedItemsObject.length > 1 else')
                navigation.navigate('WriteMessageScreen', { selecteds: mySelectedItemsObject })
            }

        }
    }

    navigation.setOptions({
        headerTitle: (props) => (
            <>
                <Typography bold color='#fff' size={20}>Usuarios</Typography>
                <Typography color='#fff' size={13}>{allUsersShow.length} usuarios{mySelectedItems.length > 0 ? (mySelectedItems.length > 1 ? (', ' + mySelectedItems.length + ' seleccionados') : (', ' + mySelectedItems.length + ' seleccionado')) : null}</Typography>
            </>
        ),
        headerRight: () => (
            <View>
                {mySelectedItems.length > 0 ? (
                    <TouchableOpacity onPress={() => navigateConversation()} style={styles.headerRight}>
                        <Ionicons
                            name='checkmark-sharp'
                            size={26}
                            color='#fff'
                        />
                    </TouchableOpacity>
                ) : null}
            </View>
        ),
        headerLeft: () => (
            <View>
                {mySelectedItems.length > 0 ? (
                    <TouchableOpacity onPress={() => {
                        setMySelectedItems([])
                        setMySelectedItemsObject([])
                    }} style={styles.headerLeft}>
                        <Ionicons
                            name='close-sharp'
                            size={26}
                            color='#fff'
                            style={{ marginTop: 4 }}
                        />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                        <Ionicons
                            name='arrow-back'
                            size={26}
                            color='#fff'
                            style={{ marginTop: 4 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        ),
    })

    const actualizarUsuarios = (orders) => {
        console.log("entro a actualizar")
        let temp = []
        allUsers.forEach(element => {
            temp.push(element)
        });

        orders.forEach(el => {
            if (el.node.user != null && el.node.user) {
                if (temp.filter(e => e.id === el.node.user.id).length > 0) {
                    return
                } else {
                    temp.push(el.node.user)
                }
            }
            el.node.sellers.forEach(use => {
                if (temp.filter(e => e.id === use.user.id).length > 0) {
                    return
                } else {
                    temp.push(use.user)
                }
            })
        })
        /* orders.forEach(el => {
            
        }) */

        console.log("Termnio actualizar >> ", temp)

        /* usuarios.forEach(element => {
            element.node.user.id = element.node.user.serverId
            temp.push(element.node.user)
        }); */
        setAllUsers(previousState => {
            return previousState.concat(temp)
        })
        setAllUsersShow(previousState => {
            return previousState.concat(temp)
        })
    }

    useEffect(() => {
        //getAllUsers({ variables: { after: '', before: '' }, })
        getAllContacts({ variables: { carrier: carrier_info.serverId, after: '', before: '' }, })
    }, [])


    useEffect(() => {
        if (allUsers.length > 0) {
            if (search.length > 0) {
                setShowSearchClose(true)
                let temporal = allUsers.filter((u) => {
                    if (u.firstName && u.firstName.toUpperCase().includes(search.toUpperCase()))
                        return u
                    if (u.lastName && u.lastName.toUpperCase().includes(search.toUpperCase()))
                        return u
                    if (u.userName && u.userName.toUpperCase().includes(search.toUpperCase()))
                        return u
                })
                setAllUsersShow(temporal)
            } else {
                setShowSearchClose(false)
                setAllUsersShow(allUsers)
            }
        }
    }, [search])

    useEffect(() => {
        setErrors(prevState => {
            return prevState.filter((e) => e != 'content')
        })
    }, [content])

    useEffect(() => {
        setErrors(prevState => {
            return prevState.filter((e) => e != 'destinatarios')
        })
    }, [selectedItems])

    const toggleSelected = (user) => {
        if (mySelectedItems.includes(user.serverId)) {
            const index = mySelectedItems.indexOf(user.serverId);
            let tempArray = []
            mySelectedItems.map(item => {
                tempArray.push(item)
            })
            tempArray.splice(index, 1)
            setMySelectedItems(tempArray)
            let tempArray2 = []
            mySelectedItemsObject.map(item => {
                tempArray2.push(item)
            })
            tempArray2.splice(index, 1)
            setMySelectedItemsObject(tempArray2)
        } else {
            setMySelectedItems(pre => {
                return [...pre, user.serverId]
            })
            setMySelectedItemsObject(pre => {
                return [...pre, user]
            })
        }
    }

    if (loadingUsers) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 10,
            }}>
                <TextInput
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        paddingLeft: 15,
                    }}
                    placeholder='Buscar...'
                    onChangeText={setSearch}
                    value={search}
                />
                {showSearchClose ? (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 23,
                            right: 30,
                        }}
                        onPress={() => setSearch('')}
                    >
                        <Fontisto
                            name="close"
                            color={Colors.COLORS.PRIMARY}
                            size={22}
                        />
                    </TouchableOpacity>
                ) : (null)}
            </View>
            <FlatList
                //style={{ padding: 16 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                data={allUsersShow}
                //data={allUsersShow}
                keyExtractor={item => item.serverId}
                renderItem={({ item, index }) => (
                    <UserItem
                        user={item}
                        mySelectedItems={mySelectedItems}
                        toggleSelected={toggleSelected}
                        key={index}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerRight: {
        marginRight: 20
    },
    headerLeft: {
        marginLeft: 12,
        padding: 5,
        borderRadius: 100,
    },
    container: {
        flex: 1,
        paddingHorizontal: 18,
        marginTop: 20
    },
    inputLabel: {
        marginBottom: 15,
    },
})

export default NewMessageScreen