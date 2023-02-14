import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Typography } from '../../components'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { carrierInfo } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { kycAmigable } from '../../utils/CommonFunctions'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
//import * as ImagePicker from 'expo-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useMutation } from '@apollo/client'

import { CARRIER_UPDATE } from '../../graphql/profile'

const CarrierDetails = ({ client }) => {
    console.log("CLIENTTT >> ", client)
    const { colors } = useTheme()
    const [piPhotoFrontal, setPiPhotoFrontal] = useState(null)
    const [piPhotoBack, setPiPhotoBack] = useState(null)
    const [bustPhoto, setBustPhoto] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const carrier_info = useSelector(carrierInfo)

    useEffect(() => {
        setPiPhotoFrontal(carrier_info.piPhotoFrontal ? { uri: carrier_info.piPhotoFrontal.image.url, } : require('../../../assets/page404.png'))
        setPiPhotoBack(carrier_info.piPhotoBack ? { uri: carrier_info.piPhotoBack.image.url, } : require('../../../assets/page404.png'))
        setBustPhoto(carrier_info.bustPhoto ? { uri: carrier_info.bustPhoto.image.url, } : require('../../../assets/page404.png'))
    }, [])

    const [carrierUpdate, { loading, error, data }] = useMutation(CARRIER_UPDATE, {
        onCompleted: (data) => {
            console.log('LO ACTUALIZOO >> ', data)
        },
        onError: (error, data) => {
            console.log('Error actalizando info de lcarrier >> ', error)
            console.log('Error actalizando info de data >> ', data)
        },
    })

    const piPhotoFrontalEdit = async () => {
        setSelectedImage('piPhotoFrontal')
        setShowModal(true)
    }
    const piPhotoBackEdit = async () => {
        setSelectedImage('piPhotoBack')
        setShowModal(true)
    }
    const bustPhotoEdit = () => {
        setSelectedImage('bustPhoto')
        setShowModal(true)
    }

    const openCamera = async () => {
        setShowModal(false)
        var options = {
            mediaType: 'photo',
            includeBase64: true
        };

        const picker_result = await launchCamera(options);

        if (!picker_result.didCancel) {
            switch (selectedImage) {
                case 'piPhotoFrontal':
                    let input = {
                        "piPhotoFrontal": {
                            "image": picker_result.assets[0].base64,
                        }
                    }
                    console.log('a ejecutar')
                    carrierUpdate({ variables: { id: carrier_info.serverId, input: input } })
                    //setPiPhotoFrontal({ uri: picker_result.assets[0].uri, })
                    break;
                case 'piPhotoBack':
                    setPiPhotoBack({ uri: picker_result.assets[0].uri, })
                    break;
                case 'bustPhoto':
                    setBustPhoto({ uri: picker_result.assets[0].uri, })
                    break;
                default:
                    break;
            }
        }
    }
    
    const openGalery = async () => {
        setShowModal(false)
        var options = {
            mediaType: 'photo',
            includeBase64: true
        };

        const picker_result = await launchImageLibrary(options);

        if (!picker_result.didCancel) {
            switch (selectedImage) {
                case 'piPhotoFrontal':
                    setPiPhotoFrontal({ uri: picker_result.assets[0].uri, })
                    break;
                case 'piPhotoBack':
                    setPiPhotoBack({ uri: picker_result.assets[0].uri, })
                    break;
                case 'bustPhoto':
                    setBustPhoto({ uri: picker_result.assets[0].uri, })
                    break;
                default:
                    break;
            }
        }
    }

    const selectFile = async () => {
        /* var options = {
            mediaType: 'photo',
            includeBase64: true
        };

        const result = await launchCamera(options);
        console.log('RESUUULTT >> ', result) */
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
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
            <View style={[styles.card, { backgroundColor: colors.SURFACE }]}>
                <View style={styles.cardRow}>
                    <Typography style={{ marginRight: 5, }}>Estado de la cuenta de Mensajero:</Typography>
                    <Typography bold color={Colors.COLORS.PRIMARY}>{carrier_info.isActive ? 'ACTIVA'.toUpperCase() : 'NO ACTIVA'.toUpperCase()}</Typography>
                </View>
                <View style={styles.headerContainer}><Typography style={{ marginRight: 5, }}>{'Información de KYC'.toUpperCase()}</Typography></View>
                <View style={styles.cardRow}>
                    <Typography style={{ marginRight: 5, }}>Estado de KYC:</Typography>
                    <Typography bold color={Colors.COLORS.PRIMARY}>{kycAmigable(carrier_info.kyc).toUpperCase()}</Typography>
                </View>
                <View style={styles.imageRow}>
                    <Typography>Imagen delantera del CI</Typography>
                    <View style={styles.imageContainer}>
                        <View style={styles.editIcon}>
                            <TouchableOpacity onPress={() => piPhotoFrontalEdit()} >
                                <FontAwesome
                                    style={styles.headerRight}
                                    name="edit"
                                    color={colors.ON_SURFACE}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <Image backgroundColor='white' source={piPhotoFrontal} style={styles.imageStyles} />
                    </View>
                </View>
                <View style={styles.imageRow}>
                    <Typography>Imagen trasera del CI</Typography>
                    <View style={styles.imageContainer}>
                        <View style={styles.editIcon}>
                            <TouchableOpacity onPress={() => piPhotoBackEdit()}>
                                <FontAwesome
                                    style={styles.headerRight}
                                    name="edit"
                                    color={colors.ON_SURFACE}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <Image backgroundColor='white' source={piPhotoBack} style={styles.imageStyles} />
                    </View>
                </View>
                <View style={styles.imageRow}>
                    <Typography>Imagen de Busto</Typography>
                    <View style={styles.imageContainer}>
                        <View style={styles.editIcon}>
                            <TouchableOpacity onPress={() => bustPhotoEdit()}>
                                <FontAwesome
                                    style={styles.headerRight}
                                    name="edit"
                                    color={colors.ON_SURFACE}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <Image backgroundColor='white' source={bustPhoto} style={styles.imageStyles} />
                    </View>
                </View>
            </View>
            <Typography></Typography>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000099'
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
    editIcon: {
        position: 'absolute',
        top: 18,
        right: 0,
    },
    imageRow: {
        marginVertical: 15,
    },
    imageContainer: {
        width: 300,
        height: 200,
    },
    imageStyles: {
        resizeMode: 'contain',
        marginTop: 10,
        alignSelf: 'center',
        width: 250,
        height: 200,
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    cardRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    card: {
        flexDirection: 'column',
        borderColor: 'rgba(0, 0, 0, 0.125)',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
        elevation: 1
    },
})

export default CarrierDetails