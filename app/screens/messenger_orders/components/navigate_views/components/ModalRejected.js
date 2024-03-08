import { View, Text, StyleSheet, KeyboardAvoidingView, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, TextInput, ImageBackground, Dimensions, ActivityIndicator, Platform, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../../../../components'
import { printCreated2 } from '../../../../../utils/CommonFunctions'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../../../../constants/Colors'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ReactNativeFile } from "apollo-upload-client";
import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { EVIDENCE_REJECTED_IMAGES, ORDER_REJECTED, SIGNATURE_REJECTED_IMAGES } from '../../../../../graphql/orders'
import { setOrderShippingStatus, setSelectedOrderShippingStatus } from '../../../../../redux/messenger_orders/messenger_ordersSlice'
import ImageCard from './ImageCard'
import ImageResizer from '@bam.tech/react-native-image-resizer';

const ModalRejected = ({
    showModalRejected,
    setShowModalRejected,
    envio,
    setShippingStatus,
}) => {
    const [justify, setJustify] = useState(envio.orderById.rejectedOrder?.reason)
    const [resizeInfo, setResizeInfo] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalTarget, setModalTarget] = useState('')
    const [preViewModal, setPreViewModal] = useState(false)
    const [vistaPrevia, setVistaPrevia] = useState(null)
    const [imageURI, setImageURI] = useState(null)
    const [description, setDescription] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [actualizando, setActualizando] = useState(false)
    const [renderiza, setRenderiza] = useState(false)
    const [signatureImages, setSignatureImages] = useState(envio.orderById.rejectedOrder?.signImg)
    const [evidenceImages, setEvidenceImages] = useState(envio.orderById.rejectedOrder?.shipImg)
    const [aborterRefSignature, setAborterRefSignature] = useState(new AbortController());
    const [aborterRefEvidence, setAborterRefEvidence] = useState(new AbortController());

    const dispatch = useDispatch()

    const [signatureRejectionImages, { loadingSignature, errorSignature, dataSignature }] = useMutation(SIGNATURE_REJECTED_IMAGES, {
        onCompleted: (dataSignature) => {
            console.log("CREOO LA IMAGEN >> ", dataSignature)
            envio.orderById.rejectedOrder = dataSignature.signatureImagesRejection.order.rejectedOrder
            if (Platform.OS === 'android') {
                ToastAndroid.show('Se adicionó la imagen de firma correctamente.', ToastAndroid.LONG)
            }
            setResizeInfo(false)
            setUploadingImage(false)
            setPreViewModal(false)
            setSignatureImages(dataSignature.signatureImagesRejection.order.rejectedOrder.signImg)
        },
        onError: (errorSignature, dataSignature) => {
            if (errorSignature.message == "Network request failed" || errorSignature?.networkError?.statusCode == 413) {
                resizeOptions()
            } else {
                setResizeInfo(false)
                if (errorSignature.message == 'Aborted') {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Imagen cancelada.', ToastAndroid.LONG)
                } else {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Ha ocurrido un error adicionado la imagen de firma.', ToastAndroid.LONG)
                    }
                }
                console.log('Error subiendo imagen >> ', JSON.stringify(errorSignature, null, 2))
                console.log('Error subiendo imagen dataSignature >> ', dataSignature)
                setUploadingImage(false)
                setPreViewModal(false)
            }
        },
        context: {
            fetchOptions: {
                signal: aborterRefSignature.signal
            }
        },
    })

    const [evidenceRejectionImages, { loadingEvidence, errorEvidence, dataEvidence }] = useMutation(EVIDENCE_REJECTED_IMAGES, {
        onCompleted: (dataEvidence) => {
            console.log("CREOO LA IMAGEN Evidence >> ", dataEvidence)
            envio.orderById.rejectedOrder = dataEvidence.evidenceImagesRejection.order.rejectedOrder
            if (Platform.OS === 'android') {
                ToastAndroid.show('Se adicionó la imagen de evidencia correctamente.', ToastAndroid.LONG)
            }
            setResizeInfo(false)
            setUploadingImage(false)
            setPreViewModal(false)
            setEvidenceImages(dataEvidence.evidenceImagesRejection.order.rejectedOrder.shipImg)
        },
        onError: (errorEvidence, dataEvidence) => {
            if (errorEvidence.message == "Network request failed" || errorEvidence?.networkError?.statusCode == 413) {
                resizeOptions()
            } else {
                setResizeInfo(false)
                if (errorEvidence.message == 'Aborted') {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Imagen cancelada.', ToastAndroid.LONG)
                } else {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Ha ocurrido un error adicionado la imagen de evidencia.', ToastAndroid.LONG)
                    }
                }
                console.log('Error subiendo imagen >> ', errorEvidence)
                console.log('Error subiendo imagen dataEvidence >> ', dataEvidence)
                setUploadingImage(false)
                setPreViewModal(false)
            }
        },
        context: {
            fetchOptions: {
                signal: aborterRefEvidence.signal
            }
        },
    })

    const resizeOptions = async () => {
        let result = await ImageResizer.createResizedImage(
            imageURI.uri,
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
            name: imageURI.name,
            type: imageURI.type,
        });
        setImageURI(file)
        setUploadingImage(false)
        setVistaPrevia({ uri: result.uri })
        setResizeInfo(true)
    }

    const [orderRejected, { loadingRejected, errorRejected, dataRejected }] = useMutation(ORDER_REJECTED, {
        onCompleted: (dataRejected) => {
            if (dataRejected.orderRejected.errors) {
                if (dataRejected.orderRejected.errors.length > 0) {
                    console.log("ERROR Rejected ENVIO EL ENVIO >> ", dataRejected.orderRejected.errors)
                } else {
                    if (dataRejected.orderRejected.order) {
                        if (dataRejected.orderRejected.order.shippingStatus == 'REJECTED') {
                            envio.orderById.shippingStatus = 'REJECTED'
                            envio.orderById.rejectedOrder = dataRejected.orderRejected.order.rejectedOrder
                            setShippingStatus('REJECTED')
                            const parametros = {
                                "id": envio.orderById.id,
                                "status": 'REJECTED'
                            }
                            dispatch(setOrderShippingStatus(parametros))
                            dispatch(setSelectedOrderShippingStatus('REJECTED'))
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado del Envío actualizado correctamente.', ToastAndroid.LONG)
                            }
                            setActualizando(false)
                            setShowModalRejected(false)
                        }
                    }
                }
            }
            setActualizando(false)
        },
        onError: (errorRejected) => {
            console.log('Error cambiando estado de envio a REJECTED >> ', JSON.stringify(errorRejected, null, 2))
            setActualizando(false)
        }
    })

    const openModalWith = (imageType) => {
        setModalTarget(imageType)
        setShowModal(true)
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

    const sendImage = () => {
        setUploadingImage(true)
        switch (modalTarget) {
            case 'SIGNATURE':
                console.log("a envir la imagen", imageURI, envio.orderById.id)
                signatureRejectionImages({
                    variables: { id: envio.orderById.id, images: imageURI }
                })
                break;
            case 'EVIDENCE':
                evidenceRejectionImages({
                    variables: { id: envio.orderById.id, images: imageURI }
                })
                break;

            default:
                break;
        }
    }

    const makeRejected = () => {
        //setDisplayLoading(true)
        console.log("ENTROOOO", justify)
        if (justify === '' || justify == undefined) {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Debe completar la Justificación.', ToastAndroid.LONG)
            }
        } else if (envio.orderById.rejectedOrder != null) {
            if (envio.orderById.rejectedOrder.signImg.length == 0 || envio.orderById.rejectedOrder.shipImg.length == 0) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Las imágenes de la orden rechazada no han sido completadas.', ToastAndroid.LONG)
                }
            } else {
                setActualizando(true)
                console.log("Cambiar estado")
                orderRejected({ variables: { id: envio.orderById.id, input: { reason: justify } } })
            }
        } else {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Las imágenes de la orden rechazada no han sido completadas.', ToastAndroid.LONG)
            }
        }

    }

    const abortUpload = () => {
        setResizeInfo(false)
        switch (modalTarget) {
            case 'SIGNATURE':
                aborterRefSignature.abort();
                setAborterRefSignature(new AbortController());
                setPreViewModal(false)
                break;
            case 'EVIDENCE':
                aborterRefEvidence.abort();
                setAborterRefEvidence(new AbortController());
                setPreViewModal(false)
                break;

            default:
                break;
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
                        onPress={() => abortUpload()}
                    >
                        <Ionicons
                            name='close'
                            size={40}
                            color={'#fff'}
                        />
                    </TouchableOpacity>

                </View>
                <View
                    behavior={"padding"} style={styles.centeredViewOtro}
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
                        {resizeInfo ? (
                            <View style={styles.resizeInfoContent}>
                                <Typography
                                    style={{
                                        paddingHorizontal: 20
                                    }}
                                    color='#fff'
                                    size={16}
                                >Ha ocurrido un error actualizando la imagen. Esta es la nueva imagen comprimida, desea enviar esta imagen?</Typography>
                            </View>
                        ) : (null)}
                        <View style={{ marginBottom: 20 }}>
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
                        </View>

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
                visible={showModalRejected}
                transparent={true}
                animationType="slade"
                onRequestClose={() => setShowModalRejected(false)}
            >
                <TouchableOpacity
                    style={styles.modalView}
                    onPressOut={() => {
                        setShowModalRejected(false)
                    }}
                >
                    <TouchableWithoutFeedback /* style={styles.modalContent} */>
                        <View keyboardShouldPersistTaps={'handled'} style={styles.modalContent}>
                            <ScrollView style={styles.scrollContent}>
                                <Typography h2>Envío #{envio.orderById.number}</Typography>
                                <Typography style={{ marginTop: 5 }} color={'#9e9e9e'} small>{printCreated2(envio.orderById.created)}</Typography>
                                <Typography style={{ marginTop: 10 }}>Justificación del rechazo:</Typography>
                                <TextInput
                                    selectTextOnFocus
                                    style={[styles.textInput, , { marginBottom: 20 }]}
                                    placeholder='Justificación del rechazo'
                                    onChangeText={setJustify}
                                    //onSubmitEditing={sendMessage}
                                    value={justify}
                                />
                                <View style={styles.imagesContent}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography h3 style={{ marginBottom: 10 }}>
                                            Imágenes de la firma
                                        </Typography>
                                        <TouchableOpacity onPress={() => openModalWith('SIGNATURE')} >
                                            <MaterialIcons
                                                style={styles.headerRight}
                                                color={Colors.COLORS.PRIMARY}
                                                name="add-photo-alternate"
                                                size={26}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView
                                        showsHorizontalScrollIndicator={true}
                                        horizontal={true}
                                    >
                                        <View style={{ flexDirection: "row", marginTop: 5 }}>
                                            {envio.orderById.rejectedOrder ? (
                                                signatureImages?.length > 0 ? (
                                                    signatureImages.map((photo, index) => (
                                                        <ImageCard
                                                            key={index}
                                                            photo={photo}
                                                            setImages={setSignatureImages}
                                                            mutation='SIGNATURE_REJECTED'
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography>
                                                        ...
                                                    </Typography>
                                                )
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={styles.imagesContent}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography h3 style={{ marginBottom: 10 }}>
                                            Imágenes de evidencia
                                        </Typography>
                                        <TouchableOpacity onPress={() => openModalWith('EVIDENCE')} >
                                            <MaterialIcons
                                                style={styles.headerRight}
                                                color={Colors.COLORS.PRIMARY}
                                                name="add-photo-alternate"
                                                size={26}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView
                                        showsHorizontalScrollIndicator={true}
                                        horizontal={true}
                                    >
                                        <View style={{ flexDirection: "row", marginTop: 5 }}>
                                            {envio.orderById.rejectedOrder ? (
                                                evidenceImages?.length > 0 ? (
                                                    evidenceImages.map((photo, index) => (
                                                        <ImageCard
                                                            key={index}
                                                            photo={photo}
                                                            setImages={setEvidenceImages}
                                                            mutation='EVIDENCE_REJECTED'
                                                        />
                                                        /* <View key={index} style={{ marginRight: 8 }}>
                                                            <Image
                                                                source={{ uri: photo.image.url, }}
                                                                indicator={Progress.Pie}
                                                                indicatorProps={{
                                                                    color: Colors.COLORS.PRIMARY,
                                                                    borderWidth: 0,
                                                                }}
                                                                imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                                                            />
                                                        </View> */
                                                    ))
                                                ) : (
                                                    <Typography>
                                                        ...
                                                    </Typography>
                                                )
                                            ) : (
                                                <Typography>
                                                    ...
                                                </Typography>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                            </ScrollView>
                            <View style={styles.modalButtons}>
                                {actualizando ? (
                                    <ActivityIndicator style={{ paddingVertical: 6, paddingTop: 3 }} color={Colors.COLORS.PRIMARY} />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => makeRejected()}
                                        style={{ paddingVertical: 5, paddingHorizontal: 8 }}
                                    >
                                        <Typography h3 color={Colors.COLORS.WEB_BUTTON}>RECHAZADO</Typography>
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
    resizeInfoContent: {
        backgroundColor: Colors.COLORS.WEB_BUTTON,
        paddingVertical: 15,
        marginBottom: 10,
    },
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
        //marginTop: 10,
        height: Dimensions.get('window').height * 0.70,
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
        marginBottom: 10
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
    centeredViewOtro: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor: 'red'
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
        //padding: 15,
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

export default ModalRejected