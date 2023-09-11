import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, ActivityIndicator, ScrollView, ImageBackground, KeyboardAvoidingView, TextInput, Platform, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { printCreated2 } from '../../../../../utils/CommonFunctions'
import Colors from '../../../../../constants/Colors'
import { Typography } from '../../../../../components'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ReactNativeFile } from "apollo-upload-client";
import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { ORDER_DELIVERED, PACKAGE_IMAGES, SIGNATURE_IMAGES } from '../../../../../graphql/orders'
import { setOrderShippingStatus, setSelectedOrderShippingStatus } from '../../../../../redux/messenger_orders/messenger_ordersSlice'
import ImageCard from './ImageCard'

const ModalDelivered = ({
    showModalDelivered,
    setShowModalDelivered,
    envio,
    setShippingStatus
}) => {
    const [showModal, setShowModal] = useState(false)
    const [modalTarget, setModalTarget] = useState('')
    const [preViewModal, setPreViewModal] = useState(false)
    const [vistaPrevia, setVistaPrevia] = useState(null)
    const [imageURI, setImageURI] = useState(null)
    const [description, setDescription] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [actualizando, setActualizando] = useState(false)
    const [aborterRefSignature, setAborterRefSignature] = useState(new AbortController());
    const [aborterRefPackage, setAborterRefPackage] = useState(new AbortController());
    const [signatureImages, setSignatureImages] = useState(envio.orderById.signatureImagesDelivery)
    const [packageImages, setPackageImages] = useState(envio.orderById.packageImagesDelivery)

    const dispatch = useDispatch()

    const [orderDelivered, { loadingDelivered, errorDelivered, dataDelivered }] = useMutation(ORDER_DELIVERED, {
        onCompleted: (dataDelivered) => {
            if (dataDelivered.orderDelivered.errors) {
                if (dataDelivered.orderDelivered.errors.length > 0) {
                    console.log("ERROR DELIVERED ENVIO EL ENVIO >> ", dataDelivered.orderDelivered.errors)
                } else {
                    if (dataDelivered.orderDelivered.order) {
                        if (dataDelivered.orderDelivered.order.shippingStatus == 'DELIVERED') {
                            envio.orderById.shippingStatus = 'DELIVERED'
                            setShippingStatus('DELIVERED')
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado del Envío actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": envio.orderById.id,
                                "status": 'DELIVERED'
                            }
                            dispatch(setOrderShippingStatus(parametros))
                            dispatch(setSelectedOrderShippingStatus('DELIVERED'))
                            setActualizando(false)
                            setShowModalDelivered(false)
                        }
                    }
                }
            }
            setActualizando(false)
        },
        onError: (errorDelivered) => {
            console.log('Error CAMBIOANDO ESTADO A LOST Envío >> ', errorDelivered)
            setActualizando(false)
        }
    })

    const [signatureDeliveredImages, { loadingSignature, errorSignature, dataSignature }] = useMutation(SIGNATURE_IMAGES, {
        onCompleted: (dataSignature) => {
            //console.log("CREOO LA IMAGEN >> ", dataSignature)
            envio.orderById.signatureImagesDelivery = dataSignature.shipmentDeliveredSignatureImage.order.signatureImagesDelivery
            setSignatureImages(dataSignature.shipmentDeliveredSignatureImage.order.signatureImagesDelivery)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Se adicionó la imagen de firma correctamente.', ToastAndroid.LONG)
            }
            setUploadingImage(false)
            setPreViewModal(false)
        },
        onError: (errorSignature, dataSignature) => {
            if (errorSignature.message == 'Aborted') {
                if (Platform.OS === 'android')
                    ToastAndroid.show('Imagen cancelada.', ToastAndroid.LONG)
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Ha ocurrido un error adicionado la imagen de firma.', ToastAndroid.LONG)
                }
            }
            console.log('Error subiendo imagen >> ', errorSignature)
            console.log('Error subiendo imagen dataSignature >> ', dataSignature)
            setUploadingImage(false)
            setPreViewModal(false)
        },
        context: {
            fetchOptions: {
                signal: aborterRefSignature.signal
            }
        },
    })

    const [packageDeliveredImages, { loadingPackage, errorPackage, dataPackage }] = useMutation(PACKAGE_IMAGES, {
        onCompleted: (dataPackage) => {
            //console.log("CREOO LA IMAGEN >> ", dataPackage)
            envio.orderById.packageImagesDelivery = dataPackage.shipmentDeliveredPackageImage.order.packageImagesDelivery
            setPackageImages(dataPackage.shipmentDeliveredPackageImage.order.packageImagesDelivery)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Se adicionó la imagen de paquete correctamente.', ToastAndroid.LONG)
            }
            setPreViewModal(false)
            setUploadingImage(false)
        },
        onError: (errorPackage, dataPackage) => {
            if (errorPackage.message == 'Aborted') {
                if (Platform.OS === 'android')
                    ToastAndroid.show('Imagen cancelada.', ToastAndroid.LONG)
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Ha ocurrido un error adicionado la imagen de paquete.', ToastAndroid.LONG)
                }
            }
            console.log('Error subiendo imagen >> ', errorPackage)
            console.log('Error subiendo imagen dataPackage >> ', dataPackage)
            setUploadingImage(false)
            setPreViewModal(false)
        },
        context: {
            fetchOptions: {
                signal: aborterRefPackage.signal
            }
        },
    })

    const abortUpload = () => {
        switch (modalTarget) {
            case 'SIGNATURE':
                aborterRefSignature.abort();
                setAborterRefSignature(new AbortController());
                setPreViewModal(false)
                break;
            case 'EVIDENCE':
                aborterRefPackage.abort();
                setAborterRefPackage(new AbortController());
                setPreViewModal(false)
                break;

            default:
                break;
        }
    }

    const openCamera = async () => {
        setShowModal(false)
        var options = {
            mediaType: 'photo',
        };

        const picker_result = await launchCamera(options);

        if (!picker_result.didCancel) {
            const file = new ReactNativeFile({
                uri: picker_result.assets[0].uri,
                name: picker_result.assets[0].fileName,
                type: picker_result.assets[0].type,
            });

            setVistaPrevia({ uri: picker_result.assets[0].uri, })
            setImageURI(file)
            setPreViewModal(true)
        }
    }

    const openGalery = async () => {
        setShowModal(false)
        var options = {
            mediaType: 'photo',
        };

        const picker_result = await launchImageLibrary(options);
        if (!picker_result.didCancel) {
            const file = new ReactNativeFile({
                uri: picker_result.assets[0].uri,
                name: picker_result.assets[0].fileName,
                type: picker_result.assets[0].type,
            });
            setVistaPrevia({ uri: picker_result.assets[0].uri, })
            setImageURI(file)
            setPreViewModal(true)
        }
    }

    const openModalWith = (imageType) => {
        setModalTarget(imageType)
        setShowModal(true)
    }

    const sendImage = () => {
        setUploadingImage(true)
        switch (modalTarget) {
            case 'SIGNATURE':
                signatureDeliveredImages({
                    variables: { id: envio.orderById.id, images: imageURI }
                })
                break;
            case 'PACKAGE':
                packageDeliveredImages({
                    variables: { id: envio.orderById.id, images: imageURI }
                })
                break;

            default:
                break;
        }
    }

    const makeDelivered = () => {
        if (envio.orderById.signatureImagesDelivery && envio.orderById.signatureImagesDelivery.length == 0) {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Las imágenes de la firma no se han completado', ToastAndroid.LONG)
            }
        } else if (envio.orderById.packageImagesDelivery && envio.orderById.packageImagesDelivery.length == 0) {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Las imágenes del paquete no se han completado', ToastAndroid.LONG)
            }
        } else {
            setActualizando(true)
            orderDelivered({ variables: { id: envio.orderById.id } })
        }
    }

    return (
        <>
            <Modal
                visible={preViewModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => abortUpload(false)}
            >
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    flexDirection: 'row'
                }}>
                    <Typography>
                    </Typography>
                    <TouchableOpacity
                        onPress={() => abortUpload(false)}
                    >
                        <Ionicons
                            name='close'
                            size={40}
                            color={'#fff'}
                        />
                    </TouchableOpacity>

                </View>
                <View
                    behavior={"padding"} style={styles.centeredView}
                >
                    <ImageBackground
                        resizeMode='contain'
                        style={styles.vistaPrevia}
                        source={vistaPrevia}
                    />
                    <KeyboardAvoidingView
                        behavior="position"
                        style={{ width: '100%' }}
                        keyboardVerticalOffset={-20}
                    >
                        <TextInput
                            style={styles.commentInput}
                            autoComplete='off'
                            placeholder='Descripción (opcional)'
                            multiline={true}
                            placeholderTextColor='rgba(255,255,255,0.7)'
                            onChangeText={text => setDescription(text)}
                        />
                        {uploadingImage ? (
                            <ActivityIndicator
                                style={styles.aIndicator}
                                color={Colors.COLORS.SUCCESS}
                                size='large'
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.okInputIcon}
                                onPress={() => sendImage()}
                            >

                                <Ionicons
                                    name='ios-checkmark-circle-outline'
                                    size={40}
                                    color={Colors.COLORS.SUCCESS}
                                />
                            </TouchableOpacity>
                        )}
                    </KeyboardAvoidingView>
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
                                    color={Colors.COLORS.PRIMARY}
                                    size={35}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openGalery()}>
                                <FontAwesome
                                    name="photo"
                                    color={Colors.COLORS.PRIMARY}
                                    size={35}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
            <Modal
                visible={showModalDelivered}
                transparent={true}
                animationType="slade"
                onRequestClose={() => setShowModalDelivered(false)}
            >
                <TouchableOpacity
                    style={styles.modalView}
                    onPressOut={() => {
                        setShowModalDelivered(false)
                    }}
                >
                    <TouchableWithoutFeedback /* style={styles.modalContent} */>
                        <View keyboardShouldPersistTaps={'handled'} style={styles.modalContent}>
                            <Typography h2>Envío #{envio.orderById.number}</Typography>
                            <Typography style={{ marginTop: 5 }} color={'#9e9e9e'} small>{printCreated2(envio.orderById.created)}</Typography>

                            <View style={styles.imagesContent}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography h3 style={{ marginBottom: 10 }}>
                                        Imágenes de la firma
                                    </Typography>
                                    <TouchableOpacity onPress={() => openModalWith('SIGNATURE')}/* onPress={() => addSignatureImage()} */ >
                                        <MaterialIcons
                                            name="add-photo-alternate"
                                            color={Colors.COLORS.PRIMARY}
                                            size={26}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {envio.orderById.signatureImagesDelivery ? (
                                            signatureImages?.length > 0 ? (
                                                signatureImages.map((photo, index) => (
                                                    <ImageCard
                                                        key={index}
                                                        photo={photo}
                                                        setImages={setSignatureImages}
                                                        mutation='SIGNATURE_DELIVERED'
                                                    />
                                                ))
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                            <View style={styles.imagesContent}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography h3 style={{ marginBottom: 10 }}>
                                        Imágenes del paquete
                                    </Typography>
                                    <TouchableOpacity onPress={() => openModalWith('PACKAGE')}/* onPress={() => addPackageImage()} */ >
                                        <MaterialIcons
                                            name="add-photo-alternate"
                                            color={Colors.COLORS.PRIMARY}
                                            size={26}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView
                                    showsHorizontalScrollIndicator={true}
                                    horizontal={true}
                                >
                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        {envio.orderById.packageImagesDelivery ? (
                                            packageImages.length > 0 ? (
                                                packageImages.map((photo, index) => (
                                                    <ImageCard
                                                        key={index}
                                                        photo={photo}
                                                        setImages={setPackageImages}
                                                        mutation='PACKAGE_DELIVERED'
                                                    />
                                                ))
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography>
                                                No tiene este valor
                                            </Typography>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                            <View style={styles.modalButtons}>
                                {actualizando ? (
                                    <ActivityIndicator style={{ paddingVertical: 6, paddingTop: 3 }} color={Colors.COLORS.PRIMARY} />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => makeDelivered()}
                                        style={{ paddingVertical: 5, paddingHorizontal: 8 }}
                                    >
                                        <Typography h3 color={Colors.COLORS.WEB_BUTTON}>ENTREGADO</Typography>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    aIndicator: {
        position: 'absolute',
        right: 14,
        top: 9,
    },
    okInputIcon: {
        position: 'absolute',
        right: 10,
        top: 6,
    },
    commentInput: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 100,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        height: 55,
        color: '#fff',
        paddingRight: 60,
    },
    vistaPrevia: {
        marginTop: 10,
        height: Dimensions.get('window').height * 0.75,
        width: '100%'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
        paddingHorizontal: 15,
        //backgroundColor: 'red'
    },
    imagesContent: {
        marginTop: 10
    },
    modalView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
    },
    textInput: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 45,
        fontSize: 16,
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
        //height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    scrollContent: {
        //backgroundColor: 'red',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 15,
    },
})

export default ModalDelivered