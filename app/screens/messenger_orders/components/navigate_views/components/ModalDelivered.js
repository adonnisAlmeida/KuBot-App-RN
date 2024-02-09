import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, ActivityIndicator, ScrollView, ImageBackground, KeyboardAvoidingView, TextInput, Platform, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { printCreated2 } from '../../../../../utils/CommonFunctions'
import Colors from '../../../../../constants/Colors'
import { TimePickerInput, Typography } from '../../../../../components'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ReactNativeFile } from "apollo-upload-client";
import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { DELIVERED_ITINERARY_CREATE, DELIVERY_ITINERARY_CREATE, DELIVERY_ITINERARY_DELETE, DELIVERY_ITINERARY_UPDATE, ORDER_DELIVERED, PACKAGE_IMAGES, SIGNATURE_IMAGES } from '../../../../../graphql/orders'
import { setOrderShippingStatus, setSelectedOrderShippingStatus } from '../../../../../redux/messenger_orders/messenger_ordersSlice'
import ImageCard from './ImageCard'

const ModalDelivered = ({
    showModalDelivered,
    setShowModalDelivered,
    envio,
    setShippingStatus,
    setDeliveryInineraryParent
}) => {
    const [showModal, setShowModal] = useState(false)

    const [modalTarget, setModalTarget] = useState('')
    const [preViewModal, setPreViewModal] = useState(false)
    const [vistaPrevia, setVistaPrevia] = useState(null)
    const [imageURI, setImageURI] = useState(null)
    const [description, setDescription] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [actualizando, setActualizando] = useState(false)
    const [tabSelected, setTabSelected] = useState(0)
    const [aborterRefSignature, setAborterRefSignature] = useState(new AbortController());
    const [aborterRefPackage, setAborterRefPackage] = useState(new AbortController());
    const [signatureImages, setSignatureImages] = useState(envio.orderById.signatureImagesDelivery)
    const [packageImages, setPackageImages] = useState(envio.orderById.packageImagesDelivery)
    // itinerary states
    const [itineraryModal, setItineraryModal] = useState(false)
    const [fromTimeDate, setFromTimeDate] = useState(null)
    const [fromTime, setFromTime] = useState('')
    const [toTimeDate, setToTimeDate] = useState(null)
    const [toTime, setToTime] = useState('')
    const [mondaySelect, setMondaySelect] = useState(false)
    const [tuesdaySelect, setTuesdaySelect] = useState(false)
    const [wednesdaySelect, setWednesdaySelect] = useState(false)
    const [thursdaySelect, setThursdaySelect] = useState(false)
    const [fridaySelect, setFridaySelect] = useState(false)
    const [saturdaySelect, setSaturdaySelect] = useState(false)
    const [sundaySelect, setSundaySelect] = useState(false)
    const [creatingItinerary, setCreatingItinerary] = useState(false)
    const [errors, setErrors] = useState([])
    const [deliveryItinerary, setDeliveryIninerary] = useState(envio.orderById.deliveryItinerary)
    const [operation, setOperation] = useState(0)
    const [activeItinerary, setActiveItinerary] = useState(null)
    const [deletingItinerary, setDeletingItinerary] = useState(false)


    const dispatch = useDispatch()

    const [deliveryItineraryUpdate, { loadingDeliveryItineraryUpdate, errorDeliveryItineraryUpdate, dataDeliveryItineraryUpdate }] = useMutation(DELIVERY_ITINERARY_UPDATE, {
        onCompleted: (dataDeliveryItineraryUpdate) => {
            setDeliveryIninerary(pre => {
                objIndex = pre.findIndex((iti => iti.serverId == activeItinerary.serverId));
                pre[objIndex].days = dataDeliveryItineraryUpdate.updateDeliveryItinerary.orderDeliveryItinerary.days
                pre[objIndex].hourInit = dataDeliveryItineraryUpdate.updateDeliveryItinerary.orderDeliveryItinerary.hourInit
                pre[objIndex].hourEnd = dataDeliveryItineraryUpdate.updateDeliveryItinerary.orderDeliveryItinerary.hourEnd
                return pre
            })
            setDeliveryInineraryParent(pre => {
                objIndex = pre.findIndex((iti => iti.serverId == activeItinerary.serverId));
                pre[objIndex].days = dataDeliveryItineraryUpdate.updateDeliveryItinerary.orderDeliveryItinerary.days
                pre[objIndex].hourInit = dataDeliveryItineraryUpdate.updateDeliveryItinerary.orderDeliveryItinerary.hourInit
                pre[objIndex].hourEnd = dataDeliveryItineraryUpdate.updateDeliveryItinerary.orderDeliveryItinerary.hourEnd
                return pre
            })
            handleCancelar()
            /* setDeliveryIninerary(pre => pre.filter((item) => item.serverId != activeItinerary.serverId))
            setDeliveryInineraryParent(pre => pre.filter((item) => item.serverId != activeItinerary.serverId))
            handleCancelar() */
        },
        onError: (errorDeliveryItineraryUpdate) => {
            console.log('Error creando itinerario de entrega >> ', errorDeliveryItineraryUpdate)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error actualizando el itinerario de entrega.', ToastAndroid.LONG)
            }
            setCreatingItinerary(false)
            setActualizando(false)
        }
    })

    const [deliveryItineraryDelete, { loadingDeliveryItineraryDelete, errorDeliveryItineraryDelete, dataDeliveryItineraryDelete }] = useMutation(DELIVERY_ITINERARY_DELETE, {
        onCompleted: (dataDeliveryItineraryDelete) => {
            setDeliveryIninerary(pre => pre.filter((item) => item.serverId != activeItinerary.serverId))
            setDeliveryInineraryParent(pre => pre.filter((item) => item.serverId != activeItinerary.serverId))
            handleCancelar()
            setDeletingItinerary(false)
        },
        onError: (errorDeliveryItineraryDelete) => {
            console.log('Error creando itinerario de entrega >> ', JSON.stringify(errorDeliveryItineraryDelete, null, 2))
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error eliminando el itinerario de entrega.', ToastAndroid.LONG)
            }
            setCreatingItinerary(false)
            setActualizando(false)
            setDeletingItinerary(false)
        }
    })

    const [deliveryItineraryCreate, { loadingDeliveryItineraryCreate, errorDeliveryItineraryCreate, dataDeliveryItineraryCreate }] = useMutation(DELIVERY_ITINERARY_CREATE, {
        onCompleted: (dataDeliveryItineraryCreate) => {
            setDeliveryIninerary(prev => {
                return [...prev, dataDeliveryItineraryCreate.createDeliveryItinerary.orderDeliveryItinerary]
            })
            setDeliveryInineraryParent(prev => {
                return [...prev, dataDeliveryItineraryCreate.createDeliveryItinerary.orderDeliveryItinerary]
            })
            handleCancelar()
        },
        onError: (errorDeliveryItineraryCreate) => {
            console.log('Error creando itinerario de entrega >> ', errorDeliveryItineraryCreate)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error creando el itinerario de entrega.', ToastAndroid.LONG)
            }
            setCreatingItinerary(false)
            setActualizando(false)
        }
    })

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

    const handleCancelar = () => {
        setCreatingItinerary(false)
        setFromTime("")
        setToTime("")
        setMondaySelect(false)
        setThursdaySelect(false)
        setTuesdaySelect(false)
        setWednesdaySelect(false)
        setFridaySelect(false)
        setSaturdaySelect(false)
        setSundaySelect(false)
        setItineraryModal(false)
        setErrors([])
        setToTimeDate(new Date())
        setFromTimeDate(new Date())
        setOperation(0)
    }

    const handleCreateItinerary = () => {
        let error_data = []
        if (fromTime == "") error_data.push('fromTime')
        if (toTime == "") error_data.push('toTime')
        if (!mondaySelect && !tuesdaySelect && !thursdaySelect && !wednesdaySelect && !fridaySelect
            && !saturdaySelect && !sundaySelect) error_data.push('days')

        if (error_data.length > 0) {
            setErrors(error_data)
        } else {
            setErrors([])
            let days_ = []
            if (mondaySelect) days_.push("Monday")
            if (tuesdaySelect) days_.push("Tuesday")
            if (wednesdaySelect) days_.push("Wednesday")
            if (thursdaySelect) days_.push("Thursday")
            if (fridaySelect) days_.push("Friday")
            if (saturdaySelect) days_.push("Saturday")
            if (sundaySelect) days_.push("Sunday")

            let toForSend = ""
            let fromForSend = ""

            if (fromTime.split(" ")[1] == 'pm') {
                if (fromTime.split(":")[0] != '12') {
                    fromForSend = parseInt(fromTime.split(":")[0]) + 12
                } else {
                    fromForSend = fromTime.split(":")[0]
                }
            } else if (fromTime.split(" ")[1] == 'am') {
                if (fromTime.split(":")[0] == '12') {
                    fromForSend = "00"
                } else {
                    fromForSend = fromTime.split(":")[0]
                }
            }

            if (toTime.split(" ")[1] == 'pm') {
                if (toTime.split(":")[0] != '12') {
                    toForSend = parseInt(toTime.split(":")[0]) + 12
                } else {
                    toForSend = toTime.split(":")[0]
                }
            } else if (toTime.split(" ")[1] == 'am') {
                console.log("Entro am")
                if (toTime.split(":")[0] == '12') {
                    toForSend = "00"
                } else {
                    toForSend = toTime.split(":")[0]
                }
            }

            toForSend = toForSend + ":" + toTime.split(":")[1].split(" ")[0]
            fromForSend = fromForSend + ":" + fromTime.split(":")[1].split(" ")[0]

            if (fromForSend < toForSend) {
                setCreatingItinerary(true)
                if (operation == 0) {
                    deliveryItineraryCreate({
                        variables: {
                            order: envio.orderById.serverId,
                            days_: { "days_": days_ },
                            end: toForSend,
                            start: fromForSend
                        }
                    })
                } else {
                    deliveryItineraryUpdate({
                        variables: {
                            itinerary: activeItinerary.serverId,
                            days_: { "days_": days_ },
                            end: toForSend,
                            start: fromForSend
                        }
                    })
                }
            } else {
                error_data.push('fromTime')
                error_data.push('toTime')
                setErrors(error_data)
                if (Platform.OS === 'android') {
                    ToastAndroid.show('La hora de inicio debe ser mayor a la de finalizacion.', ToastAndroid.LONG)
                }
            }

        }
    }

    const handleRowToush = (itinerary) => {
        setActiveItinerary(itinerary)
        setOperation(1)
        let primero = ""
        let segundo = ""
        if (itinerary.hourInit.split(":")[0] == "00") {
            primero += "12"
        } else if (parseInt(itinerary.hourInit.split(":")[0]) >= 13) {
            primero += parseInt(itinerary.hourInit.split(":")[0]) - 12
        } else {
            primero += parseInt(itinerary.hourInit.split(":")[0])
        }
        if (parseInt(itinerary.hourInit.split(":")[0]) < 12) {
            primero += ":" + itinerary.hourInit.split(":")[1] + " am"
        } else {
            primero += ":" + itinerary.hourInit.split(":")[1] + " pm"
        }

        if (itinerary.hourEnd.split(":")[0] == "00") {
            segundo += "12"
        } else if (parseInt(itinerary.hourEnd.split(":")[0]) >= 13) {
            segundo += parseInt(itinerary.hourEnd.split(":")[0]) - 12
        } else {
            segundo += parseInt(itinerary.hourEnd.split(":")[0])
        }
        if (parseInt(itinerary.hourEnd.split(":")[0]) < 12) {
            segundo += ":" + itinerary.hourEnd.split(":")[1] + " am"
        } else {
            segundo += ":" + itinerary.hourEnd.split(":")[1] + " pm"
        }

        setFromTimeDate(new Date('2024', 1, 0, itinerary.hourInit.split(":")[0], itinerary.hourInit.split(":")[1], 0))
        setToTimeDate(new Date('2024', 1, 0, itinerary.hourEnd.split(":")[0], itinerary.hourEnd.split(":")[1], 0))
        setFromTime(primero)
        setToTime(segundo)
        setItineraryModal(true)
        let weekDays = itinerary.days.split(", ")
        if (weekDays.includes("Lunes")) setMondaySelect(true)
        if (weekDays.includes("Martes")) setTuesdaySelect(true)
        if (weekDays.includes("Miércoles")) setWednesdaySelect(true)
        if (weekDays.includes("Jueves")) setThursdaySelect(true)
        if (weekDays.includes("Viernes")) setFridaySelect(true)
        if (weekDays.includes("Sábado")) setSaturdaySelect(true)
        if (weekDays.includes("Domingo")) setSundaySelect(true)
    }

    const handleDelete = () => {
        setDeletingItinerary(true)
        deliveryItineraryDelete({
            variables: {
                itinerary: activeItinerary.serverId,
            }
        })
    }

    const hasErrors = (key) => errors.includes(key)

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
                visible={itineraryModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => handleCancelar()}
            >
                <TouchableOpacity
                    style={styles.centeredView}
                    onPressOut={() => handleCancelar()}
                >
                    <TouchableWithoutFeedback>
                        <View style={styles.itineraryModal}>
                            <Typography h3 style={{ marginBottom: 10 }}>
                                Itinerario de entrega
                            </Typography>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <View >
                                    <TimePickerInput
                                        label={'Desde'}
                                        value={fromTime}
                                        setValue={(value) => {
                                            setFromTime(value)
                                            setErrors(pre => pre.filter((key) => key != 'fromTime'))
                                            let hora = ""
                                            if (value.split(" ")[1] == 'pm') {
                                                if (value.split(":")[0] != '12') {
                                                    hora = parseInt(value.split(":")[0]) + 12
                                                } else {
                                                    hora = value.split(":")[0]
                                                }
                                            } else if (value.split(" ")[1] == 'am') {
                                                if (value.split(":")[0] == '12') {
                                                    hora = "00"
                                                } else {
                                                    hora = value.split(":")[0]
                                                }
                                            }
                                            setFromTimeDate(new Date('2024', 1, 0, hora, value.split(":")[1].split(" ")[0], 0))
                                        }}
                                        error={hasErrors('fromTime')}
                                        date={fromTimeDate}
                                    />
                                </View>
                                <View>
                                    <TimePickerInput
                                        label={'Hasta'}
                                        value={toTime}
                                        setValue={(value) => {
                                            setToTime(value)
                                            setErrors(pre => pre.filter((key) => key != 'toTime'))
                                            let hora = ""
                                            if (value.split(" ")[1] == 'pm') {
                                                if (value.split(":")[0] != '12') {
                                                    hora = parseInt(value.split(":")[0]) + 12
                                                } else {
                                                    hora = value.split(":")[0]
                                                }
                                            } else if (value.split(" ")[1] == 'am') {
                                                if (value.split(":")[0] == '12') {
                                                    hora = "00"
                                                } else {
                                                    hora = value.split(":")[0]
                                                }
                                            }
                                            setToTimeDate(new Date('2024', 1, 0, hora, value.split(":")[1].split(" ")[0], 0))
                                        }}
                                        error={hasErrors('toTime')}
                                        date={toTimeDate}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Typography
                                    style={{ marginBottom: 10 }}
                                    color={hasErrors('days') ? Colors.COLORS.ERROR : '#000'}
                                >
                                    Día(s)
                                </Typography>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingVertical: 5 }}
                                    onPress={() => {
                                        setMondaySelect(!mondaySelect)
                                        setErrors(pre => pre.filter((key) => key != 'days'))
                                    }}
                                >
                                    <FontAwesome
                                        name={mondaySelect ? "check-square-o" : "square-o"}
                                        color={mondaySelect ? Colors.COLORS.WEB_LINK : Colors.COLORS.WEB_START_OFF}
                                        size={20}
                                    />
                                    <Typography style={{ paddingLeft: 10 }}>Lunes</Typography>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingVertical: 5 }}
                                    onPress={() => {
                                        setTuesdaySelect(!tuesdaySelect)
                                        setErrors(pre => pre.filter((key) => key != 'days'))
                                    }}
                                >
                                    <FontAwesome
                                        name={tuesdaySelect ? "check-square-o" : "square-o"}
                                        color={tuesdaySelect ? Colors.COLORS.WEB_LINK : Colors.COLORS.WEB_START_OFF}
                                        size={20}
                                    />
                                    <Typography style={{ paddingLeft: 10 }}>Martes</Typography>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingVertical: 5 }}
                                    onPress={() => {
                                        setWednesdaySelect(!wednesdaySelect)
                                        setErrors(pre => pre.filter((key) => key != 'days'))
                                    }}
                                >
                                    <FontAwesome
                                        name={wednesdaySelect ? "check-square-o" : "square-o"}
                                        color={wednesdaySelect ? Colors.COLORS.WEB_LINK : Colors.COLORS.WEB_START_OFF}
                                        size={20}
                                    />
                                    <Typography style={{ paddingLeft: 10 }}>Miércoles</Typography>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingVertical: 5 }}
                                    onPress={() => {
                                        setThursdaySelect(!thursdaySelect)
                                        setErrors(pre => pre.filter((key) => key != 'days'))
                                    }}
                                >
                                    <FontAwesome
                                        name={thursdaySelect ? "check-square-o" : "square-o"}
                                        color={thursdaySelect ? Colors.COLORS.WEB_LINK : Colors.COLORS.WEB_START_OFF}
                                        size={20}
                                    />
                                    <Typography style={{ paddingLeft: 10 }}>Jueves</Typography>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingVertical: 5 }}
                                    onPress={() => {
                                        setFridaySelect(!fridaySelect)
                                        setErrors(pre => pre.filter((key) => key != 'days'))
                                    }}
                                >
                                    <FontAwesome
                                        name={fridaySelect ? "check-square-o" : "square-o"}
                                        color={fridaySelect ? Colors.COLORS.WEB_LINK : Colors.COLORS.WEB_START_OFF}
                                        size={20}
                                    />
                                    <Typography style={{ paddingLeft: 10 }}>Viernes</Typography>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingVertical: 5 }}
                                    onPress={() => {
                                        setSaturdaySelect(!saturdaySelect)
                                        setErrors(pre => pre.filter((key) => key != 'days'))
                                    }}
                                >
                                    <FontAwesome
                                        name={saturdaySelect ? "check-square-o" : "square-o"}
                                        color={saturdaySelect ? Colors.COLORS.WEB_LINK : Colors.COLORS.WEB_START_OFF}
                                        size={20}
                                    />
                                    <Typography style={{ paddingLeft: 10 }}>Sábado</Typography>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingVertical: 5 }}
                                    onPress={() => {
                                        setSundaySelect(!sundaySelect)
                                        setErrors(pre => pre.filter((key) => key != 'days'))
                                    }}
                                >
                                    <FontAwesome
                                        name={sundaySelect ? "check-square-o" : "square-o"}
                                        color={sundaySelect ? Colors.COLORS.WEB_LINK : Colors.COLORS.WEB_START_OFF}
                                        size={20}
                                    />
                                    <Typography style={{ paddingLeft: 10 }}>Domingo</Typography>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{
                                        padding: 5,
                                        paddingHorizontal: 20
                                    }}
                                    onPress={() => handleCancelar()}
                                >
                                    <Typography>CANCELAR</Typography>
                                </TouchableOpacity>
                                {operation == 1 ? (
                                    deletingItinerary ? (
                                        <ActivityIndicator
                                            color={Colors.COLORS.PRIMARY}
                                            style={{
                                                padding: 5,
                                                paddingHorizontal: 20
                                            }}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            style={{
                                                padding: 5,
                                                paddingHorizontal: 20
                                            }}
                                            onPress={() => handleDelete()}>
                                            <Typography color={Colors.COLORS.WARNING}>ELIMINAR</Typography>
                                        </TouchableOpacity>
                                    )
                                ) : (null)}
                                {creatingItinerary ? (
                                    <ActivityIndicator
                                        color={Colors.COLORS.PRIMARY}
                                        style={{
                                            padding: 5,
                                            paddingHorizontal: 20
                                        }}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        disabled={deletingItinerary}
                                        style={{
                                            padding: 5,
                                            paddingHorizontal: 20
                                        }}
                                        onPress={() => handleCreateItinerary()}>
                                        <Typography color={Colors.COLORS.WEB_BUTTON}>{operation == 0 ? "CREAR" : "ACTUALIZAR"}</Typography>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal >
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
                            <View style={styles.tabHeader}  >
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        style={[styles.tabElement, {
                                            borderBottomWidth: tabSelected == 0 ? 2 : 0,
                                            borderBottomColor: tabSelected == 0 ? Colors.COLORS.PRIMARY : '#fff',
                                        }]}
                                        onPress={() => setTabSelected(0)}
                                    >
                                        <Typography color={tabSelected == 0 ? Colors.COLORS.PRIMARY : '#9e9e9e'} h3>Imagenes</Typography>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        style={[styles.tabElement, {
                                            borderBottomWidth: tabSelected == 1 ? 2 : 0,
                                            borderBottomColor: tabSelected == 1 ? Colors.COLORS.PRIMARY : '#fff'
                                        }]}
                                        onPress={() => setTabSelected(1)}
                                    >
                                        <Typography color={tabSelected == 1 ? Colors.COLORS.PRIMARY : '#9e9e9e'} h3>Itinerario</Typography>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.tabContent}>
                                {tabSelected == 0 ? (
                                    <>
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
                                    </>
                                ) : (
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography h3 style={{ marginBottom: 10 }}>
                                                Itinerario de entrega
                                            </Typography>
                                            <TouchableOpacity onPress={() => setItineraryModal(true)}>
                                                <AntDesign
                                                    name="pluscircle"
                                                    color={Colors.COLORS.PRIMARY}
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        {deliveryItinerary?.length == 0 ? (
                                            <Typography h4 style={{ marginBottom: 10 }}>
                                                Itinerario de entrega no encontrado.
                                            </Typography>
                                        ) : (
                                            <>
                                                <View style={styles.wrapper}>
                                                    {/* Table Container */}
                                                    <View style={styles.table}>
                                                        {/* Table Head */}
                                                        <View style={styles.table_head}>
                                                            <View style={{ width: '60%' }}>
                                                                <Typography style={styles.table_head_captions}>Día(s)</Typography>
                                                            </View>
                                                            <View style={{ width: '20%' }}>
                                                                <Typography style={styles.table_head_captions}>Desde</Typography>
                                                            </View>
                                                            <View style={{ width: '20%' }}>
                                                                <Typography style={styles.table_head_captions}>Hasta</Typography>
                                                            </View>
                                                        </View>

                                                        {/* Table Body - Single Row */}
                                                        {deliveryItinerary.map(item => (
                                                            <TouchableOpacity onPress={() => handleRowToush(item)} key={item.serverId}>
                                                                <View key={item.serverId} style={styles.table_body_single_row}>
                                                                    <View style={{ width: '60%' }}>
                                                                        <Typography style={styles.table_data}>{item.days}</Typography>
                                                                    </View>
                                                                    <View style={{ width: '20%', alignSelf: 'center' }}>
                                                                        <Typography style={styles.table_data}>{item.hourInit}</Typography>
                                                                    </View>
                                                                    <View style={{ width: '20%', alignSelf: 'center' }}>
                                                                        <Typography style={styles.table_data}>{item.hourEnd}</Typography>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                )}
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
    itineraryModal: {
        width: '95%',
        //height: 'auto',
        //alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
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
    tabContent: {
        marginVertical: 10,
    },
    wrapper: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    table_head: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        padding: 7,
        backgroundColor: Colors.COLORS.SWITCH_OFF
    },
    table_head_captions: {
        fontSize: 14,
        color: '#000'
    },

    table_body_single_row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        padding: 7,
    },
    table_data: {
        fontSize: 13,
    },
    table: {
        //margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
        backgroundColor: '#fff',
    },
    tabElement: {
        paddingTop: 10,
        alignItems: 'center',
        flex: 1
    },
    tabHeader: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 40,
        alignContent: 'center',
        alignItems: 'center'
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
        marginTop: 10,
        height: Dimensions.get('window').height * 0.75,
        width: '100%'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        paddingHorizontal: 15,
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