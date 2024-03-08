import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, ActivityIndicator, TouchableWithoutFeedback, Platform, ToastAndroid, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Colors from '../../../constants/Colors'
import { useTheme } from '@react-navigation/native'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useMutation } from '@apollo/client'
import { USER_AVATAR_UPDATE } from '../../../graphql/customers'
import { ReactNativeFile } from 'apollo-upload-client'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, user } from '../../../redux/userlogin/userLoginSlice'
import { useEffect } from 'react'
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { Typography } from '../../../components'

const ProfilePhoto = ({ avatar, setAvatar }) => {
    const { colors } = useTheme()
    const [avatarURL, setAvatarURL] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [vistaPrevia, setVistaPrevia] = useState(null)
    const [confirmModal, setConfirmModal] = useState(false)
    const [activity, setActivity] = useState(false)
    const [photoFile, setPhotoFile] = useState(null)
    const [resizeInfo, setResizeInfo] = useState(false)
    const user_state = useSelector(user)
    const dispatch = useDispatch()

    useEffect(() => {
        setAvatarURL(avatar)
    }, [])
    useEffect(() => {
        setAvatarURL(avatar)
    }, [avatar])

    const [userAvatarUpdate, { loadingAvatar, errorAvatar, dataAvatar }] = useMutation(USER_AVATAR_UPDATE, {
        onCompleted: (dataAvatar) => {
            console.log("userAvatarUpdate Actualizoooo ", dataAvatar)
            if (Platform.OS === 'android')
                ToastAndroid.show('Avatar actualizado correctamente.', ToastAndroid.LONG)
            setActivity(false)
            setConfirmModal(false)
            setResizeInfo(false)
            setAvatarURL(vistaPrevia)
            dispatch(
                setUser({
                    ...user_state,
                    avatar: dataAvatar.userAvatarUpdate.user.avatar
                })
            )
        },
        onError: (errorAvatar, dataAvatar) => {
            if (errorAvatar.message == "Network request failed" || errorAvatar?.networkError?.statusCode == 413) {
                resizeOptions()
            } else {
                setActivity(false)
                setConfirmModal(false)
                setResizeInfo(false)
                if (Platform.OS === 'android')
                    ToastAndroid.show('Error actualizando el avatar.', ToastAndroid.LONG)
            }
            console.log('Error userAvatarUpdate >> ', JSON.stringify(errorAvatar, null, 2))
            console.log('Error userAvatarUpdate  dataAvatar >> ', dataAvatar)
        }
    })

    const resizeOptions = async () => {
        let result = await ImageResizer.createResizedImage(
            photoFile.uri,
            500,
            500,
            'JPEG',
            100,
            0,
            undefined,
            false,
        );
        const file = new ReactNativeFile({
            uri: result.uri,
            name: photoFile.name,
            type: photoFile.type,
        });
        setPhotoFile(file)
        setActivity(false)
        setVistaPrevia({ uri: result.uri, })
        setResizeInfo(true)
    }

    const profilePhotoEdit = () => {
        setShowModal(true)
    }

    const openCamera = async () => {
        setShowModal(false)
        var options = { mediaType: 'photo' };
        const picker_result = await launchCamera(options);
        if (!picker_result.didCancel) {
            //setAvatarURL({ uri: picker_result.assets[0].uri, })
            setVistaPrevia({ uri: picker_result.assets[0].uri, })
            setConfirmModal(true)
            const file = new ReactNativeFile({
                uri: picker_result.assets[0].uri,
                name: picker_result.assets[0].fileName,
                type: picker_result.assets[0].type,
            });
            setPhotoFile(file)
        }
    }

    const openGalery = async () => {
        setShowModal(false)
        var options = { mediaType: 'photo' };
        const picker_result = await launchImageLibrary(options);
        if (!picker_result.didCancel) {
            //setAvatarURL({ uri: picker_result.assets[0].uri, })
            setVistaPrevia({ uri: picker_result.assets[0].uri, })
            setConfirmModal(true)
            const file = new ReactNativeFile({
                uri: picker_result.assets[0].uri,
                name: picker_result.assets[0].fileName,
                type: picker_result.assets[0].type,
            });
            setPhotoFile(file)
        }
    }

    const sendImage = () => {
        setActivity(true)
        userAvatarUpdate({
            variables: { image: photoFile }
        })
    }

    return (
        <>
            <View style={{ backgroundColor: 'red' }}>
                <TouchableOpacity style={styles.editIcon} onPress={() => profilePhotoEdit()}>
                    <MaterialCommunityIcons
                        name="image-edit-outline"
                        color='#fff'
                        size={20}
                    />
                </TouchableOpacity>
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => profilePhotoEdit()}>
                            <Image
                                backgroundColor='white'
                                source={avatarURL}
                                imageStyle={styles.avatar}
                                indicator={Progress.Pie}
                                indicatorProps={{
                                    color: colors.PRIMARY,
                                    borderWidth: 0,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal
                visible={confirmModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setConfirmModal(false)}
            >
                <View
                    style={styles.modalView}
                //onPressOut={() => setConfirmModal(false)}
                >
                    <ImageBackground
                        resizeMode='contain'
                        style={styles.vistaPrevia}
                        source={vistaPrevia}
                    />
                    {resizeInfo ? (
                        <View style={styles.resizeInfoContent}>
                            <Typography
                                style={{
                                    paddingHorizontal: 20
                                }}
                                color='#fff'
                                size={16}
                            >Ha ocurrido un error actualizando la imagen de perfil. Esta es la nueva imagen comprimida, desea enviar esta imagen?</Typography>
                        </View>
                    ) : (null)}
                    <View style={styles.topButtons}>
                        <TouchableOpacity style={styles.cancelIcon} onPress={() => setConfirmModal(false)}
                        >
                            <Ionicons
                                name='ios-close-circle-outline'
                                size={40}
                                color='rgba(255,255,255,0.9)'
                            />
                        </TouchableOpacity>
                        {activity ? (
                            <ActivityIndicator
                                //style={styles.aIndicator}
                                color={Colors.COLORS.SUCCESS}
                                size='large'
                            />
                        ) : (
                            <TouchableOpacity style={styles.okIcon} onPress={() => sendImage()}
                            >
                                <Ionicons
                                    name='ios-checkmark-circle-outline'
                                    size={40}
                                    color={Colors.COLORS.SUCCESS}
                                />
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </Modal>
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableOpacity
                    style={styles.centeredView}
                    onPressOut={() => setShowModal(false)}
                >
                    <TouchableWithoutFeedback>
                        <View style={styles.selectModal}>
                            <TouchableOpacity onPress={() => openCamera()}>
                                <FontAwesome
                                    name="camera-retro"
                                    color={colors.PRIMARY}
                                    size={35}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openGalery()}>
                                <FontAwesome
                                    name="photo"
                                    color={colors.PRIMARY}
                                    size={35}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>

    )
}

const styles = StyleSheet.create({
    resizeInfoContent: {
        backgroundColor: Colors.COLORS.WEB_BUTTON,
        paddingVertical: 15,
    },
    topButtons: {
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    selectModal: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        width: 150,
        height: 100,
        backgroundColor: '#fff',
        margin: 42,
        borderRadius: 12,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
    },
    modalView: {
        flex: 1,
        paddingTop: 20,
        /* justifyContent: 'center',
        alignItems: 'center', */
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    vistaPrevia: {
        marginTop: 10,
        //marginHorizontal: 10,
        height: Dimensions.get('window').height * 0.70,
        width: '100%',
        //backgroundColor: 'red',
        /* marginTop: 10,
        marginHorizontal: 10,
        height: 500,
        resizeMode: 'contain',
        width: '99%' */
    },
    /* buttonEdit: {
        position: 'absolute',
        top: 18,
        right: 0,
    }, */
    imageContainer: {
        //flex: 1,
        //height: 200,
        marginBottom: 20
    },
    imageStyles: {
        position: 'relative',
        resizeMode: 'contain',
        marginTop: 10,
        alignSelf: 'center',
        width: 200,
        height: 200,
        borderRadius: 100,
        //backgroundColor: 'red'
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        top: -160,
        elevation: 0,
        position: 'absolute',
    },
    editIcon: {
        position: 'absolute',
        backgroundColor: Colors.COLORS.PRIMARY,
        padding: 8,
        borderRadius: 100,
        top: -55,
        left: Dimensions.get('window').width / 2.1,
        zIndex: 99
    },
    avatar: {
        position: 'relative',
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: Colors.COLORS.PRIMARY
    },
})

export default ProfilePhoto