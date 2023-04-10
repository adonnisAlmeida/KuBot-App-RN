import { View, Text, Platform, ToastAndroid, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, ActivityIndicator, Keyboard, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { ACCOUNT_UPDATE } from '../../../graphql/customers'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@react-navigation/native'
import { setUser, user } from '../../../redux/userlogin/userLoginSlice'
import Colors from '../../../constants/Colors'
import { Button, Typography } from '../../../components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useEffect } from 'react'

const ProfileUpdate = () => {
    const dispatch = useDispatch()
    const { colors } = useTheme()
    const user_state = useSelector(user)
    const [userInfo, setUserInfo] = useState(user_state)
    const [editNameModal, setEditNameModal] = useState(false)
    const [actualizando, setActualizando] = useState(false)
    const [firstName, setFirstName] = useState(userInfo.firstName)
    const [lastName, setLastName] = useState(userInfo.lastName)
    const refNameInput = useRef();

    useEffect(() => {
        setUserInfo(user_state)
        setFirstName(userInfo.firstName)
        setLastName(userInfo.lastName)
    }, [user_state])

    useEffect(() => {
        const showSubscriptionDid = Keyboard.addListener('keyboardDidShow', () => {
            console.log('Keyboard Shown <<keyboardDidShow>>');
        });
        const hideSubscriptionDid = Keyboard.addListener('keyboardDidHide', () => {
            console.log('Keyboard Hidden <<keyboardDidHide>>');
        });
        const showSubscriptionWill = Keyboard.addListener('keyboardWillShow', () => {
            console.log('Keyboard Shown <<keyboardWillShow>>');
        });
        const hideSubscriptionWill = Keyboard.addListener('keyboardWillHide', () => {
            console.log('Keyboard Hidden <<keyboardWillHide>>');
        });
        const frameSubscriptionDid = Keyboard.addListener('keyboardDidChangeFrame', () => {
            console.log('Keyboard Shown <<keyboardDidChangeFrame>>');
        });
        const frameSubscriptionWill = Keyboard.addListener('keyboardWillChangeFrame', () => {
            console.log('Keyboard Hidden <<keyboardWillChangeFrame>>');
        });

        return () => {
            showSubscriptionDid.remove();
            hideSubscriptionDid.remove();
            showSubscriptionWill.remove();
            hideSubscriptionWill.remove();
            frameSubscriptionDid.remove();
            frameSubscriptionWill.remove();
        };
    }, []);

    const [accountUpdate, { loading, error, data }] = useMutation(ACCOUNT_UPDATE, {
        onCompleted: (data) => {
            console.log("Actualizoooo ", data)
            setEditNameModal(false)
            setActualizando(false)
            dispatch(
                setUser({
                    ...user_state,
                    firstName: firstName,
                    lastName: lastName,
                })
            )
            if (Platform.OS === 'android')
                ToastAndroid.show('Se actualizó el usuario correctamente.', ToastAndroid.LONG)
        },
        onError: (error) => {
            if (Platform.OS === 'android')
                ToastAndroid.show('Error actualizando el perfil.', ToastAndroid.LONG)
            console.log('Error accountUpdate >> ', error)
            setActualizando(false)
        }
    })

    const handleProfileEdit = () => {
        setActualizando(true)
        accountUpdate({
            variables: {
                firstName: firstName,
                lastName: lastName
            },
        })
    }

    const showModalName = () => {
        setEditNameModal(true)
        setTimeout(() => {
            refNameInput.current.focus()
        }, 200);
        //refNameInput.current.focus()
    }

    return (
        <>
            <View style={{ marginTop: 8 }}>
                <TouchableOpacity onPress={() => showModalName()}>
                    <View style={styles.seccion}>
                        <Typography style={styles.seccionTitle} >
                            Nombre:
                        </Typography>
                        <Typography style={{ color: colors.ON_SURFACE }}>
                            {userInfo.firstName}
                        </Typography>
                    </View>
                    <View style={styles.seccion}>
                        <Typography style={styles.seccionTitle} >
                            Apellidos:
                        </Typography>
                        <Typography style={{ color: colors.ON_SURFACE }}>
                            {userInfo.lastName}
                        </Typography>
                    </View>
                    <MaterialCommunityIcons
                        style={styles.editNameIcon}
                        name="notebook-edit-outline"
                        color={Colors.COLORS.PRIMARY}
                        size={20}
                    />
                </TouchableOpacity>
                <View style={styles.seccion}>
                    <Typography style={styles.seccionTitle}>
                        Correo:
                    </Typography>
                    <Typography style={{ color: colors.ON_SURFACE }}>
                        {userInfo.email}
                    </Typography>
                </View>
            </View>
            <Modal
                visible={editNameModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setEditNameModal(false)
                    refNameInput.current.blur()
                }}
            >
                <TouchableOpacity
                    style={styles.modalView}
                    onPressOut={() => {
                        setEditNameModal(false)
                        refNameInput.current.blur()
                    }}
                >
                    <TouchableWithoutFeedback /* style={styles.modalContent} */>
                        <View keyboardShouldPersistTaps={'handled'} style={styles.modalContent}>
                            <Typography style={styles.inputLabel} color={colors.ON_SURFACE}>Nombre</Typography>
                            <TextInput
                                selectTextOnFocus
                                ref={refNameInput}
                                style={[styles.textInput, , { marginBottom: 20 }]}
                                placeholder='Nombre'
                                onChangeText={setFirstName}
                                //onSubmitEditing={sendMessage}
                                value={firstName}
                            />
                            <Typography style={styles.inputLabel} color={colors.ON_SURFACE}>Apellidos</Typography>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Apellidos'
                                onChangeText={setLastName}
                                //onSubmitEditing={sendMessage}
                                value={lastName}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={{ paddingVertical: 5, paddingHorizontal: 8, marginRight: 40 }}
                                    onPressOut={() => {
                                        setEditNameModal(false)
                                        refNameInput.current.blur()
                                    }}
                                >
                                    <Typography bold color={Colors.COLORS.PRIMARY}>Cancelar</Typography>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleProfileEdit()}
                                    style={{ paddingVertical: 5, paddingHorizontal: 8 }}
                                >
                                    {actualizando ? (
                                        <ActivityIndicator color={Colors.COLORS.PRIMARY} />
                                    ) : (
                                        <Typography bold color={Colors.COLORS.PRIMARY}>Guardar</Typography>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    textInput: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 45,
    },
    /* inputLabel: {
        marginBottom: 5,
    }, */
    modalContent: {
        //borderWidth: 1,
        //borderColor: '#000',
        borderBottomWidth: 0,
        padding: 15,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 230,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
    },
    editNameIcon: {
        position: 'absolute',
        right: 0,
    },
    addressEdit: {
        marginTop: 15
    },
    cardRow: {
        flexDirection: 'row',
        marginTop: 3,
    },
    seccionTitle: {
        color: Colors.COLORS.ON_SURFACE,
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 3,
        marginRight: 5,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'column',
        borderColor: 'rgba(0, 0, 0, 0.125)',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 60,
        marginBottom: 5,
        paddingTop: 100,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
        elevation: 1
    },
    seccion: {
        flexDirection: 'row',
    },
    seccionCorner: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between'
    }
})

export default ProfileUpdate