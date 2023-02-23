import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ToastAndroid, Platform, Image, Modal, TouchableWithoutFeedback, ImageBackground, TextInput, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Typography } from '../../../../components'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import { orderShippingStatusDisplay, orderStatusDisplay, pagoAmigable } from '../../../../utils/CommonFunctions'
import Colors from '../../../../constants/Colors'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { FloatingAction } from 'react-native-floating-action'
import { useMutation } from '@apollo/client'
import { ORDER_DELIVERED, ORDER_LOST, ORDER_TRANSIT, PACKAGE_IMAGES, SIGNATURE_IMAGES } from '../../../../graphql/orders'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ReactNativeFile } from "apollo-upload-client";
import { useDispatch, useSelector } from 'react-redux'
import { setOrderShippingStatus, setSelectedOrderShippingStatus } from '../../../../redux/messenger_orders/messenger_ordersSlice'
import AwesomeAlert from 'react-native-awesome-alerts'
import { MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES, DAY_NAMES_SHORT, } from '../../../../constants/Other'

moment.locale('es')

const DetailsNavView = ({ navigation, route }) => {
    let data = route.params?.data

    const messengerOrdersRedux = useSelector(state => state.messengerOrders)
    const [sellers, setSellers] = useState([])
    const [actionsButton, setActionsButton] = useState([])
    const [displayLoading, setDisplayLoading] = useState(false)
    const [delEstado, setDelEstado] = useState(messengerOrdersRedux.selectedOrder)
    const [shippingStatus, setShippingStatus] = useState(data.order.shippingStatus)
    const [gifSource, setGifSource] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [reload, setReload] = useState(false)
    const [description, setDescription] = useState('')
    const [modalTarget, setModalTarget] = useState('')
    const [imageURI, setImageURI] = useState(null)
    const [vistaPrevia, setVistaPrevia] = useState(null)
    let hasNote = false
    const { colors } = useTheme()
    

    const dispatch = useDispatch()

    const [orderTransit, { loadingTransit, errorTransit, dataTransit }] = useMutation(ORDER_TRANSIT, {
        onCompleted: (dataTransit) => {
            if (dataTransit.orderInTransit.errors) {
                if (dataTransit.orderInTransit.errors.length > 0) {
                    console.log("ERROR ACEPTANDO ENVIO EL ENVIO >> ", dataTransit)
                } else {
                    if (dataTransit.orderInTransit.order) {
                        if (dataTransit.orderInTransit.order.shippingStatus == 'IN_TRANSIT') {
                            data.order.shippingStatus = 'IN_TRANSIT'
                            setShippingStatus('IN_TRANSIT')
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado de la orden actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": data.order.id,
                                "status": 'IN_TRANSIT'
                            }
                            dispatch(setOrderShippingStatus(parametros))
                            dispatch(setSelectedOrderShippingStatus('IN_TRANSIT'))
                            console.log("CAMBIO EL ESTADOOO")
                        }
                    }
                }
            }
            setDisplayLoading(false)
        },
        onError: () => {
            console.log('Error CAMBIOANDO ESTADO A TRANSITANDO Orden >> ', error)
            setDisplayLoading(false)
        }
    })

    const [orderLost, { loadingLost, errorLost, dataLost }] = useMutation(ORDER_LOST, {
        onCompleted: (dataLost) => {
            if (dataLost.orderLost.errors) {
                if (dataLost.orderLost.errors.length > 0) {
                    console.log("ERROR PERDIENDO ENVIO EL ENVIO >> ", dataLost.orderLost.errors)
                } else {
                    if (dataLost.orderLost.order) {
                        if (dataLost.orderLost.order.shippingStatus == 'LOST') {
                            data.order.shippingStatus = 'LOST'
                            setShippingStatus('LOST')
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado de la orden actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": data.order.id,
                                "status": 'LOST'
                            }
                            dispatch(setOrderShippingStatus(parametros))
                            dispatch(setSelectedOrderShippingStatus('LOST'))
                            console.log("CAMBIO EL ESTADOOO")
                        }
                    }
                }
            }
            setDisplayLoading(false)
        },
        onError: () => {
            console.log('Error CAMBIOANDO ESTADO A LOST Orden >> ', error)
            setDisplayLoading(false)
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
                            data.order.shippingStatus = 'DELIVERED'
                            setShippingStatus('DELIVERED')
                            setDisplayLoading(false)
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('Estado de la orden actualizado correctamente.', ToastAndroid.LONG)
                            }
                            const parametros = {
                                "id": data.order.id,
                                "status": 'DELIVERED'
                            }
                            dispatch(setOrderShippingStatus(parametros))
                            dispatch(setSelectedOrderShippingStatus('DELIVERED'))
                        }
                    }
                }
            }
            setDisplayLoading(false)
        },
        onError: () => {
            console.log('Error CAMBIOANDO ESTADO A LOST Orden >> ', error)
            setDisplayLoading(false)
        }
    })

    const [signatureImages, { loadingSignature, errorSignature, dataSignature }] = useMutation(SIGNATURE_IMAGES, {
        onCompleted: (dataSignature) => {
            console.log("CREOO LA IMAGEN >> ", dataSignature)
            data.order.signatureImagesDelivery = dataSignature.shipmentDeliveredSignatureImage.order.signatureImagesDelivery
            setReload(!reload)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Se adicionó la imagen de firma correctamente.', ToastAndroid.LONG)
            }
            setUploadingImage(false)
        },
        onError: () => {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error adicionado la imagen de firma.', ToastAndroid.LONG)
            }
            console.log('Error subiendo imagen >> ', errorSignature)
            console.log('Error subiendo imagen dataSignature >> ', dataSignature)
            setUploadingImage(false)
        }
    })

    const [packageImages, { loadingPackage, errorPackage, dataPackage }] = useMutation(PACKAGE_IMAGES, {
        onCompleted: (dataPackage) => {
            console.log("CREOO LA IMAGEN >> ", dataPackage)
            data.order.packageImagesDelivery = dataPackage.shipmentDeliveredPackageImage.order.packageImagesDelivery
            setReload(!reload)
            setUploadingImage(false)
            if (Platform.OS === 'android') {
                ToastAndroid.show('Se adicionó la imagen de paquete correctamente.', ToastAndroid.LONG)
            }
        },
        onError: () => {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error adicionado la imagen de paquete.', ToastAndroid.LONG)
            }
            console.log('Error subiendo imagen >> ', errorPackage)
            console.log('Error subiendo imagen dataPackage >> ', dataPackage)
            setUploadingImage(false)
        }
    })

    useEffect(() => {
        if (data) {
            let temp = []
            data.order.sellers.map((seller) => {
                if (!temp.includes(seller)) {
                    temp.push(seller)
                }
            })
            setSellers(temp)
            switch (data.order.shippingStatus) {
                case 'ACCEPTED_CARRIER':
                    setGifSource(require('../../../../../assets/product.gif'))
                    setActionsButton([
                        /* {
                            text: "En tránsito",
                            icon: actionIcon('truck-moving'),
                            name: "in_transit",
                            position: 2,
                            color: Colors.COLORS.PRIMARY
                        },
                        {
                            text: "Perdida",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        } */
                    ])
                    break;
                case 'PICKED_UP_CARRIER':
                    setGifSource(require('../../../../../assets/product.gif'))
                    setActionsButton([
                        {
                            text: "En tránsito",
                            icon: actionIcon('truck-moving'),
                            name: "in_transit",
                            position: 2,
                            color: Colors.COLORS.PRIMARY
                        },
                        {
                            text: "Perdida",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }
                    ])
                    break;
                case 'IN_TRANSIT':
                    setGifSource(require('../../../../../assets/delivery.gif'))
                    setActionsButton([
                        {
                            text: "Entregado",
                            icon: actionIcon('handshake'),
                            name: "delivered",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        },
                        /* {
                            text: "Rechazado",
                            icon: actionIcon('handshake-slash'),
                            name: "rejected",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }, */
                        {
                            text: "Perdida",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }
                    ])
                    break;
                case 'DELIVERED':
                    setGifSource(require('../../../../../assets/open-box.gif'))
                    setActionsButton([
                        /* {
                            text: "Rechazado",
                            icon: actionIcon('handshake-slash'),
                            name: "rejected",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        }, */
                    ])
                    break;
                case 'REJECTED':
                    setGifSource(require('../../../../../assets/unsubscribed.gif'))
                    setActionsButton([
                        /* {
                            text: "Perdida",
                            icon: actionIcon('question'),
                            name: "lost",
                            position: 1,
                            color: Colors.COLORS.PRIMARY
                        } */
                    ])
                    break;
                case 'LOST':
                    setGifSource(require('../../../../../assets/warning-2.gif'))
                    break;
                default:
                    break;
            }
        }
    }, [])

    useEffect(() => {
        switch (shippingStatus) {
            case 'ACCEPTED_CARRIER':
                setGifSource(require('../../../../../assets/product.gif'))
                setActionsButton([
                    /* {
                        text: "En tránsito",
                        icon: actionIcon('truck-moving'),
                        name: "in_transit",
                        position: 2,
                        color: Colors.COLORS.PRIMARY
                    },
                    {
                        text: "Perdida",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    } */
                ])
                break;
            case 'PICKED_UP_CARRIER':
                setGifSource(require('../../../../../assets/product.gif'))
                setActionsButton([
                    {
                        text: "En tránsito",
                        icon: actionIcon('truck-moving'),
                        name: "in_transit",
                        position: 2,
                        color: Colors.COLORS.PRIMARY
                    },
                    {
                        text: "Perdida",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }
                ])
                break;
            case 'IN_TRANSIT':
                setGifSource(require('../../../../../assets/delivery.gif'))
                setActionsButton([
                    {
                        text: "Entregado",
                        icon: actionIcon('handshake'),
                        name: "delivered",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    },
                    /* {
                        text: "Rechazado",
                        icon: actionIcon('handshake-slash'),
                        name: "rejected",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }, */
                    {
                        text: "Perdida",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }
                ])
                break;
            case 'DELIVERED':
                setGifSource(require('../../../../../assets/open-box.gif'))
                setActionsButton([
                    /* {
                        text: "Rechazado",
                        icon: actionIcon('handshake-slash'),
                        name: "rejected",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    }, */
                ])
                break;
            case 'REJECTED':
                setGifSource(require('../../../../../assets/unsubscribed.gif'))
                setActionsButton([
                    /* {
                        text: "Perdida",
                        icon: actionIcon('question'),
                        name: "lost",
                        position: 1,
                        color: Colors.COLORS.PRIMARY
                    } */
                ])
                break;
            case 'LOST':
                setGifSource(require('../../../../../assets/warning-2.gif'))
                break;
            default:
                break;
        }
    }, [shippingStatus])

    console.log(" ID DE LA ORDEN >> ", data.order.id)/* 
    console.log("NUMERO DE LA ORDEN >> ", data.order.number)
    console.log("del estado >> ", messengerOrdersRedux.selectedOrder.order.number) */

    const actionIcon = (name) => {
        return (
            <FontAwesome5
                name={name}
                size={20}
                color={colors.SURFACE}
            />
        )
    }


    const doAction = (action) => {
        switch (action) {
            case 'in_transit':
                setDisplayLoading(true)
                console.log('Cambiar estado a TRANSPORTANDOCE')
                orderTransit({ variables: { id: data.order.id } })
                break;
            case 'rejected':
                console.log('Cambiar estado a RECAHZADA')
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Funcionalidad No terminada', ToastAndroid.LONG)
                }
                break;
            case 'lost':
                console.log('Cambiar estado a PERDIDA')
                setDisplayLoading(true)
                orderLost({ variables: { id: data.order.id } })
                break;
            case 'delivered':
                if (data.order.signatureImagesDelivery &&
                    (data.order.signatureImagesDelivery.length == 0)) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Las imágenes del envío no se han completado', ToastAndroid.LONG)
                    }
                } else {
                    if (data.order.packageImagesDelivery.length && data.order.packageImagesDelivery.length == 0) {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show('Las imágenes del envío no se han completado', ToastAndroid.LONG)
                        }
                    } else {
                        setDisplayLoading(true)
                        orderDelivered({ variables: { id: data.order.id } })
                    }

                }
                break;
        }
    }

    const llamar = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }

    /** Prueba camara */
    const openCamera = async (modalTarget) => {
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

            if (modalTarget == 'SIGNATURE') {
                try {
                    await signatureImages({
                        variables: { id: data.order.id, images: file }
                    })
                    console.log("OKOKOK")
                } catch (e) {
                    console.log("KKKKK")
                }
            } else if (modalTarget == 'PACKAGE') {
                try {
                    await packageImages({
                        variables: { id: data.order.id, images: file }
                    })
                    console.log("OKOKOK")
                } catch (e) {
                    console.log("KKKKK")
                }
            }
        }
    }

    const openGalery = async (modalTarget) => {
        //setShowModal(false)
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
            console.log("modalTarget ", modalTarget)
            setModalTarget(modalTarget)
            setImageURI(file)
            setShowModal(true)
            /* if (modalTarget == 'SIGNATURE') {
                try {
                    await signatureImages({
                        variables: { id: data.order.id, images: file }
                    })
                    console.log("OKOKOK")
                } catch (e) {
                    console.log("KKKKK")
                }
            } else if (modalTarget == 'PACKAGE') {
                try {
                    await packageImages({
                        variables: { id: data.order.id, images: file }
                    })
                    console.log("OKOKOK")
                } catch (e) {
                    console.log("KKKKK")
                }
            } */
        }
    }

    const sendImage = async () => {
        setUploadingImage(true)
        if (modalTarget == 'SIGNATURE') {
            try {
                await signatureImages({
                    variables: { id: data.order.id, images: imageURI }
                })
                //console.log("OKOKOK")
            } catch (e) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Ha ocurrido un error adicionado la imagen de firma.', ToastAndroid.LONG)
                }
                //console.log("KKKKK")
            }
        } else if (modalTarget == 'PACKAGE') {
            try {
                await packageImages({
                    variables: { id: data.order.id, images: imageURI }
                })
                //console.log("OKOKOK")
            } catch (e) {
                console.log("KKKKK", e)
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Ha ocurrido un error adicionado la imagen de paquete. TRY', ToastAndroid.LONG)
                }
            }
        }

        /* setTimeout(() => {
            setShowModal(false)
            setUploadingImage(false)
        }, 2000); */
        /* console.log('Deacuerdo a guardar la imgen')
        console.log('Modal target >> ', modalTarget)
        console.log('Image File >> ', imageURI)
        console.log('Description >> ', description) */
        //antes mostrar cargando
        setShowModal(false)
        setUploadingImage(false)
    }

    const addSignatureImage = () => {
        openGalery('SIGNATURE')
        //setShowModal(true)
    }
    const addPackageImage = () => {
        openGalery('PACKAGE')
        //setShowModal(true)
    }

    const printCreated = (date) => {
        let output = 'ff'
        let dateObject = new Date(date)
        output = DAY_NAMES[dateObject.getDay()] +
            ' ' + dateObject.getDate() +
            ' de ' + MONTH_NAMES[dateObject.getMonth()] +
            ' del ' + dateObject.getFullYear()

        return output
    }

    /** Fin Prueba camara */

    return (
        <>
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                {/* <TouchableOpacity
                    style={styles.cancelIcon}
                    onPress={() => setShowModal(false)}
                >
                    <Ionicons
                        name='close-outline'
                        size={40}
                        color='rgba(255,255,255,0.9)'
                    />
                </TouchableOpacity> */}
                <View
                    behavior={"padding"} style={styles.centeredView}
                // style={styles.centeredView}
                //onPressOut={() => setConfirmModal(false)}
                >

                    {/* <TouchableOpacity
                        style={styles.okIcon}
                        onPress={() => sendImage()}
                    >
                        <Ionicons
                            name='checkmark-outline'
                            size={40}
                            color={Colors.COLORS.SUCCESS}
                        />
                    </TouchableOpacity> */}
                    <ImageBackground
                        resizeMode='contain'
                        //resizeMethod='auto'
                        style={styles.vistaPrevia}
                        source={vistaPrevia}
                    //Descripción (opcional)
                    />
                    <KeyboardAvoidingView
                        behavior="position"
                        style={styles.textInputContainer}
                        keyboardVerticalOffset={-60}
                    // style={styles.centeredView}
                    //onPressOut={() => setConfirmModal(false)}
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
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
            </Modal>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography h3 style={{ marginBottom: 10 }}>
                            Orden # {data.order.number}
                        </Typography>
                        <Typography color={Colors.COLORS.INFO} style={{ marginBottom: 10 }}>
                            {orderStatusDisplay(data.order.status).toUpperCase()}
                        </Typography>
                    </View>
                    {/* <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                        <Typography h3 style={{ marginVertical: 6 }}>
                            Creada el:
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {printCreated(data.order.created)}
                        </Typography>
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                        <View>
                            <Typography h3 style={{ marginVertical: 10 }}>
                                Estado del envío
                            </Typography>
                            <Typography color={Colors.COLORS.INFO}>
                                {orderShippingStatusDisplay(shippingStatus).toUpperCase()}
                            </Typography>
                        </View>
                        <View>
                            <Image backgroundColor='white' source={gifSource} style={{ height: 30, width: 30, marginTop: 10 }} />
                        </View>
                    </View>
                </View>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Cliente
                    </Typography>
                    {data.order.user ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ClientDetails', { client: data.order.user })}
                        >
                            <Typography color={colors.primary}>
                                {data.order.user.firstName + ' ' + data.order.user.lastName}
                            </Typography>
                        </TouchableOpacity>
                    ) : (
                        <Typography color={colors.ON_SURFACE}>
                            Invitado
                        </Typography>
                    )}
                    <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                        <Typography h3 style={{ marginVertical: 10 }}>
                            Dirección de Envío
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {data.order.shippingAddress.firstName} {data.order.shippingAddress.lastName}
                        </Typography>
                        <Typography color={colors.ON_SURFACE}>
                            {data.order.shippingAddress.streetAddress1}
                        </Typography>
                        <View style={{ flexDirection: 'row' }}>
                            <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                País:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.shippingAddress.country.country}
                            </Typography>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                Ciudad:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.shippingAddress.city}
                            </Typography>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
                                Código postal:
                            </Typography>
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.shippingAddress.postalCode}
                            </Typography>
                        </View>
                    </View>
                    <View style={{ borderColor: '#000', borderTopWidth: 1, marginTop: 10 }}>
                        <Typography h3 style={{ marginVertical: 10 }}>
                            Teléfono
                        </Typography>
                        {
                            data.order.shippingAddress.phone ?
                                (
                                    <Typography color={Colors.COLORS.INFO} onPress={() => llamar(data.order.shippingAddress.phone)}>
                                        {data.order.shippingAddress.phone}  <Feather
                                            name="phone-call"
                                            color={Colors.COLORS.INFO}
                                            size={15}
                                        />
                                    </Typography>
                                ) : (
                                    <Typography color={colors.ON_SURFACE}>
                                        'No especificado'
                                    </Typography>
                                )
                        }
                    </View>
                </View>
                {data.order.shippingStatus === 'IN_TRANSIT' ? (
                    <>
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Typography h3 style={{ marginBottom: 10 }}>
                                    Imágenes de la firma
                                </Typography>
                                <TouchableOpacity onPress={() => addSignatureImage()} >
                                    <MaterialIcons
                                        style={styles.headerRight}
                                        name="add-photo-alternate"
                                        color={colors.ON_SURFACE}
                                        size={26}
                                    />
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => addSignatureImage()} >
                                    <FontAwesome
                                        style={styles.headerRight}
                                        name="edit"
                                        color={colors.ON_SURFACE}
                                        size={22}
                                    />
                                </TouchableOpacity> */}
                            </View>
                            <ScrollView
                                showsHorizontalScrollIndicator={true}
                                horizontal={true}
                            >
                                <View style={{ flexDirection: "row", marginTop: 5 }}>
                                    {data.order.signatureImagesDelivery ? (
                                        data.order.signatureImagesDelivery.length > 0 ? (
                                            data.order.signatureImagesDelivery.map((photo, index) => (
                                                <View key={index} style={{ marginRight: 8 }}>
                                                    <Image source={{ uri: photo.image.url, }} style={{ height: 90, width: 90, resizeMode: 'contain' }} />
                                                </View>
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
                        <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Typography h3 style={{ marginBottom: 10 }}>
                                    Imágenes del paquete
                                </Typography>
                                <TouchableOpacity onPress={() => addPackageImage()} >
                                    <MaterialIcons
                                        style={styles.headerRight}
                                        name="add-photo-alternate"
                                        color={colors.ON_SURFACE}
                                        size={26}
                                    />
                                </TouchableOpacity>
                            </View>
                            <ScrollView
                                showsHorizontalScrollIndicator={true}
                                horizontal={true}
                            >
                                <View style={{ flexDirection: "row", marginTop: 5 }}>
                                    {data.order.packageImagesDelivery ? (
                                        data.order.packageImagesDelivery.length > 0 ? (
                                            data.order.packageImagesDelivery.map((photo, index) => (
                                                <View key={index} style={{ marginRight: 8 }}>
                                                    <Image source={{ uri: photo.image.url, }} style={{ height: 90, width: 90, resizeMode: 'contain' }} />
                                                </View>
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
                ) : null}

                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Vendedor
                    </Typography>
                    {sellers.map((seller, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate('SellerDetails', { seller: seller.user })}
                        >
                            <Typography color={colors.primary}>
                                {seller.user.firstName + ' ' + seller.user.lastName}
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Peso Total
                    </Typography>
                    <Typography color={colors.ON_SURFACE}>
                        {parseFloat(data.order.weight.value).toFixed(2)} {data.order.weight.unit}
                    </Typography>
                </View>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Dimensiones del pedido
                    </Typography>
                    <Typography color={colors.ON_SURFACE}>
                        Largo x Ancho x Alto
                    </Typography>
                    <Typography color={colors.ON_SURFACE}>
                        {data.order.allDimensions}
                    </Typography>
                </View>

                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Nota del Cliente
                    </Typography>
                    {data.order.customerNote ?
                        (
                            <Typography color={colors.ON_SURFACE}>
                                {data.order.customerNote}
                            </Typography>
                        ) :
                        (
                            <Typography color={colors.ON_SURFACE}>
                                No hay nota del cliente asociado con este pedido.
                            </Typography>
                        )}
                </View>
                <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                    <Typography h3 style={{ marginBottom: 10 }}>
                        Nota del Pedido
                    </Typography>
                    {data.order.events.map((event, index) => {
                        if (event.type == 'NOTE_ADDED') {
                            hasNote = true
                            return (
                                <View key={index}>
                                    <Typography small color={colors.ON_SURFACE}>
                                        {event.user.firstName && ' - '}{moment(event.date).format('YYYY-MM-DD')}
                                    </Typography>
                                    <Typography color={colors.ON_SURFACE}>
                                        {event.message}
                                    </Typography>
                                </View>
                            )
                        }
                    })}
                    {
                        !hasNote &&
                        (
                            <Typography color={colors.ON_SURFACE}>
                                No hay notas asociadas con este pedido.
                            </Typography>
                        )
                    }
                </View>
                <Typography></Typography>
            </ScrollView >

            {
                (data.order.shippingStatus === 'LOST' || data.order.shippingStatus === 'NO_STATUS' ||
                    shippingStatus === 'LOST' || shippingStatus === 'NO_STATUS' ||
                    shippingStatus === 'REJECTED' || shippingStatus === 'REJECTED' ||
                    shippingStatus === 'DELIVERED' || shippingStatus === 'DELIVERED' ||
                    shippingStatus === 'ACCEPTED_CARRIER' || shippingStatus === 'ACCEPTED_CARRIER') ? null :
                    (
                        <FloatingAction
                            color={Colors.COLORS.PRIMARY}
                            actions={actionsButton}
                            onPressItem={name => {
                                doAction(name)
                            }}
                        />
                    )
            }
            {
                displayLoading ? (
                    <View style={styles.loadingAccept}>
                        <ActivityIndicator size={50} color={colors.PRIMARY} />
                    </View>
                ) : (null)
            }
        </>
    )
}

const styles = StyleSheet.create({
    aIndicator: {
        position: 'absolute',
        right: 14,
        top: 9,
    },
    cancelIcon: {
        //position: 'absolute',
        /* left: 16,
        top: 16, */
        //marginLeft: 16,
        //marginTop: 16,
        zIndex: 5,
        //backgroundColor: 'red'
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    okIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    okInputIcon: {
        position: 'absolute',
        right: 10,
        top: 6,
    },
    textInputContainer: {
        width: '100%',
        //marginBottom: -100
        //backgroundColor: 'blue',
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
        //marginHorizontal: 10,
        height: Dimensions.get('window').height * 0.75,
        width: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    selectModal: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        width: 80,
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
    loadingAccept: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        zIndex: 5,
        elevation: 3,
    },
    myCard: {
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        padding: 15,
        elevation: 4,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        flexDirection: 'column',
        borderColor: 'transparent',
        borderRadius: 8,
        marginVertical: 5,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
    },
})

export default DetailsNavView