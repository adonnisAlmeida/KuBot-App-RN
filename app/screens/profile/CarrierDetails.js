import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator, ImageBackground, Dimensions, Platform, ToastAndroid, Image as RNImage } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Typography } from '../../components'
import { useTheme } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { carrierInfo, setCarrierInfo, setCarrierInfoOtro, user } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { kycAmigable, kycColor } from '../../utils/CommonFunctions'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
//import * as ImagePicker from 'expo-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useMutation } from '@apollo/client'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import ImageResizer from '@bam.tech/react-native-image-resizer';

import { BUST_PHOTO_UPDATE, CARRIER_UPDATE, PI_PHOTO_BACK_UPDATE, PI_PHOTO_FRONTAL_UPDATE } from '../../graphql/profile'
import { ReactNativeFile } from 'apollo-upload-client'
import ReviewsCard from './components/ReviewsCard'
import ReviewRating from '../sellers/components/ReviewRating'

//const Sound = require('react-native-sound')

const CarrierDetails = () => {
    const { dark, colors } = useTheme()
    const [piPhotoFrontal, setPiPhotoFrontal] = useState(null)
    const [piPhotoBack, setPiPhotoBack] = useState(null)
    const [bustPhoto, setBustPhoto] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [activity, setActivity] = useState(false)
    const [uploadFrontal, setUploadFrontal] = useState(false)
    const [uploadBack, setUploadBack] = useState(false)
    const [uploadBust, setUploadBust] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [vistaPrevia, setVistaPrevia] = useState(null)
    const [photoFile, setPhotoFile] = useState()
    const [aborterRefFrontal, setAbortRefFrontal] = useState(new AbortController());
    const [aborterRefBack, setAbortRefBack] = useState(new AbortController());
    const [aborterRefBust, setAbortRefBust] = useState(new AbortController());
    const [reviews, setReviews] = useState(null);
    const carrier_info = useSelector(carrierInfo)
    const [resizeInfo, setResizeInfo] = useState(false)
    const user_state = useSelector(user)
    const dispatch = useDispatch()

    /* console.log("carrier_info >> ", carrier_info.isActive)
    console.log("piPhotoFrontal >> ", piPhotoFrontal) */

    const correctImageURI = (type) => {
        switch (type) {
            case 'FRONTAL':
                if (carrier_info.piPhotoFrontal.image) {
                    return carrier_info.piPhotoFrontal.image.url
                } else {
                    return carrier_info.piPhotoFrontal.uri
                }
            case 'BACK':
                if (carrier_info.piPhotoBack.image) {
                    return carrier_info.piPhotoBack.image.url
                } else {
                    return carrier_info.piPhotoBack.uri
                }
            case 'BUST':
                if (carrier_info.bustPhoto.image) {
                    return carrier_info.bustPhoto.image.url
                } else {
                    return carrier_info.bustPhoto.uri
                }

            default:
                break;
        }
    }

    useEffect(() => {
        setPiPhotoFrontal(carrier_info.piPhotoFrontal ? { uri: correctImageURI('FRONTAL'), } : require('../../../assets/page404.png'))
        setPiPhotoBack(carrier_info.piPhotoBack ? { uri: correctImageURI('BACK'), } : require('../../../assets/page404.png'))
        setBustPhoto(carrier_info.bustPhoto ? { uri: correctImageURI('BUST'), } : require('../../../assets/page404.png'))
        setReviews(carrier_info.reviews)
    }, [])

    useEffect(() => {
        setPiPhotoFrontal(carrier_info.piPhotoFrontal ? { uri: correctImageURI('FRONTAL'), } : require('../../../assets/page404.png'))
        setPiPhotoBack(carrier_info.piPhotoBack ? { uri: correctImageURI('BACK'), } : require('../../../assets/page404.png'))
        setBustPhoto(carrier_info.bustPhoto ? { uri: correctImageURI('BUST'), } : require('../../../assets/page404.png'))
        setReviews(carrier_info.reviews)
    }, [carrier_info])

    const [piPhotoFrontalUpdate, { data, error, loading }] = useMutation(PI_PHOTO_FRONTAL_UPDATE, {
        onCompleted: (data) => {
            dispatch(setCarrierInfoOtro({
                ...carrier_info,
                piPhotoFrontal: vistaPrevia,
                kyc: data.carrierPiPhotoFrontalUpdate.carrier.kyc,
                isActive: data.carrierPiPhotoFrontalUpdate.carrier.isActive,
            }))
            setUploadFrontal(false)
            setResizeInfo(false)
            if (Platform.OS === 'android')
                ToastAndroid.show('Imagen delantera actualizada.', ToastAndroid.LONG)
        },
        onError: (error, data) => {
            if (error.message == "Network request failed" || error?.networkError?.statusCode == 413) {
                resizeOptions(0)
            } else {
                setUploadFrontal(false)
                setResizeInfo(false)
                if (error.message == 'Aborted') {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Actualización de Imagen delantera cancelada.', ToastAndroid.LONG)

                } else {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Error actualizando Imagen delantera.', ToastAndroid.LONG)
                }
                setPiPhotoFrontal(carrier_info.piPhotoFrontal ? { uri: correctImageURI('FRONTAL'), } : require('../../../assets/page404.png'))
                console.log('Error actalizando info de lcarrier >> ', error)
                console.log('Error actalizando info de data >> ', data)
            }
        },
        context: {
            fetchOptions: {
                signal: aborterRefFrontal.signal
            }
        },
    })

    const [piPhotoBackUpdate, { dataBack, errorBack, loadingBack }] = useMutation(PI_PHOTO_BACK_UPDATE, {
        onCompleted: (dataBack) => {
            dispatch(setCarrierInfoOtro({
                ...carrier_info,
                piPhotoBack: vistaPrevia,
                kyc: dataBack.carrierPiPhotoBackUpdate.carrier.kyc,
                isActive: dataBack.carrierPiPhotoBackUpdate.carrier.isActive,
            }))
            setUploadBack(false)
            setResizeInfo(false)
            if (Platform.OS === 'android')
                ToastAndroid.show('Imagen trasera actualizada.', ToastAndroid.LONG)
        },
        onError: (errorBack, dataBack) => {
            if (errorBack.message == "Network request failed" || errorBack?.networkError?.statusCode == 413) {
                resizeOptions(0)
            } else {
                setUploadBack(false)
                setResizeInfo(false)
                if (errorBack.message == 'Aborted') {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Actualización de Imagen trasera cancelada.', ToastAndroid.LONG)

                } else {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Error actualizando Imagen trasera.', ToastAndroid.LONG)
                }
                setPiPhotoBack(carrier_info.piPhotoBack ? { uri: correctImageURI('BACK'), } : require('../../../assets/page404.png'))
                console.log('Error actalizando info del carrier >> ', JSON.stringify(errorBack, null, 2))
                console.log('Error actalizando info de data >> ', dataBack)
            }
        },
        context: {
            fetchOptions: {
                signal: aborterRefBack.signal
            }
        },
    })

    const [bustPhotoUpdate, { dataBust, errorBust, loadingBust }] = useMutation(BUST_PHOTO_UPDATE, {
        onCompleted: (dataBust) => {
            dispatch(setCarrierInfoOtro({
                ...carrier_info,
                bustPhoto: vistaPrevia,
                kyc: dataBust.carrierBustPhotoUpdate.carrier.kyc,
                isActive: dataBust.carrierBustPhotoUpdate.carrier.isActive,
            }))
            setUploadBust(false)
            setResizeInfo(false)
            if (Platform.OS === 'android')
                ToastAndroid.show('Imagen de busto actualizada.', ToastAndroid.LONG)
        },
        onError: (errorBust, dataBust) => {
            if (errorBust.message == "Network request failed" || errorBust?.networkError?.statusCode == 413) {
                resizeOptions(0)
            } else {
                setUploadBust(false)
                setResizeInfo(false)
                //setConfirmModal(false)
                if (errorBust.message == 'Aborted') {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Actualización de Imagen de busto cancelada.', ToastAndroid.LONG)

                } else {
                    if (Platform.OS === 'android')
                        ToastAndroid.show('Error actualizando Imagen de busto.', ToastAndroid.LONG)
                }
                console.log('Error actalizando info de lcarrier >> ', errorBust)
                console.log('Error actalizando info de data >> ', dataBust)
                setBustPhoto(carrier_info.bustPhoto ? { uri: correctImageURI('BUST'), } : require('../../../assets/page404.png'))
            }
        },
        context: {
            fetchOptions: {
                signal: aborterRefBust.signal
            }
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

    const abortUploadFrontal = () => {
        aborterRefFrontal.abort();
        setAbortRefFrontal(new AbortController());
        setConfirmModal(false)
    }
    const abortUploadBack = () => {
        aborterRefBack.abort();
        setAbortRefBack(new AbortController());
        setConfirmModal(false)
    }
    const abortUploadBust = () => {
        aborterRefBust.abort();
        setAbortRefBust(new AbortController());
        setConfirmModal(false)
    }

    const openCamera = async () => {
        setShowModal(false)
        var options = { mediaType: 'photo' };
        const picker_result = await launchCamera(options);
        if (!picker_result.didCancel) {
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

    const updatePiPhotoFrontal = () => {
        setUploadFrontal(true)
        setPiPhotoFrontal(vistaPrevia)
        piPhotoFrontalUpdate({
            variables: { id: carrier_info.id, image: photoFile }
        })
    }

    const updatePiPhotoBack = () => {
        setUploadBack(true)
        setPiPhotoBack(vistaPrevia)
        piPhotoBackUpdate({
            variables: { id: carrier_info.id, image: photoFile }
        })
    }

    const updateBustPhoto = () => {
        setUploadBust(true)
        setBustPhoto(vistaPrevia)
        bustPhotoUpdate({
            variables: { id: carrier_info.id, image: photoFile }
        })
    }

    const sendImage = () => {
        setConfirmModal(false)
        switch (selectedImage) {
            case 'piPhotoFrontal':
                updatePiPhotoFrontal()
                break;
            case 'piPhotoBack':
                updatePiPhotoBack()
                break;
            case 'bustPhoto':
                updateBustPhoto()
                break;
            default:
                break;
        }
    }

    const resizeOptions = async (imageType = 0) => {
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
        switch (imageType) {
            case 0:
                setUploadFrontal(false)
                break;
            case 1:
                setUploadBack(false)(false)
                break;
            case 2:
                setUploadBust(false)
                break;

            default:
                break;
        }
        setVistaPrevia({ uri: result.uri, })
        setResizeInfo(true)
        setConfirmModal(true)
    }

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* <RNImage backgroundColor='white'
                    source={require('../../../assets/upload-green.gif')}
                    style={{ height: 24, width: 24, position: 'relative', marginTop: 10 }} />
                <RNImage backgroundColor='red'
                    source={require('../../../assets/upload-to-cloud.gif')}
                    style={{ height: 24, width: 24, position: 'relative', marginTop: 10 }} /> */}
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
                        <Typography bold color={
                            carrier_info.isActive ? Colors.COLORS.PRIMARY : '#eb5757'
                        }>{carrier_info.isActive ? 'Activa'.toUpperCase() : 'Inactiva'.toUpperCase()}</Typography>
                    </View>
                    <View style={styles.headerContainer}><Typography style={{ marginRight: 5, }}>{'Información de KYC'.toUpperCase()}</Typography></View>
                    <View style={styles.cardRow}>
                        <Typography style={{ marginRight: 5, }}>Estado de KYC:</Typography>
                        <Typography bold color={kycColor(carrier_info.kyc)}>{kycAmigable(carrier_info.kyc).toUpperCase()}</Typography>
                    </View>
                    <View style={styles.imageRow}>
                        <Typography>Imagen delantera del CI</Typography>
                        <View style={styles.imageContainer}>
                            <View style={styles.editIcon}>
                                {uploadFrontal ? (
                                    <TouchableOpacity onPress={() => abortUploadFrontal()} >
                                        <RNImage backgroundColor='white'
                                            source={require('../../../assets/upload-to-cloud.gif')}
                                            style={{ height: 24, width: 24, position: 'relative', marginTop: 10 }} />
                                        <AntDesign
                                            style={{ position: 'absolute', top: 4, right: -4 }}
                                            name="close"
                                            color="#000"
                                            size={15}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => piPhotoFrontalEdit()} >
                                        <MaterialCommunityIcons
                                            name="image-edit-outline"
                                            color={Colors.COLORS.PRIMARY}
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                )}

                            </View>
                            <Image
                                defaultSource={piPhotoBack}
                                backgroundColor='white'
                                source={piPhotoFrontal}
                                imageStyle={styles.imageStyles}
                                indicator={Progress.Pie}
                                indicatorProps={{
                                    color: colors.PRIMARY,
                                    borderWidth: 0,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.imageRow}>
                        <Typography>Imagen trasera del CI</Typography>
                        <View style={styles.imageContainer}>
                            <View style={styles.editIcon}>
                                {uploadBack ? (
                                    <TouchableOpacity onPress={() => abortUploadBack()} >
                                        <RNImage backgroundColor='white'
                                            source={require('../../../assets/upload-to-cloud.gif')}
                                            style={{ height: 24, width: 24, position: 'relative', marginTop: 10 }} />
                                        <AntDesign
                                            style={{ position: 'absolute', top: 4, right: -4 }}
                                            name="close"
                                            color="#000"
                                            size={15}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => piPhotoBackEdit()}>
                                        <MaterialCommunityIcons
                                            name="image-edit-outline"
                                            color={Colors.COLORS.PRIMARY}
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Image
                                indicator={Progress.Pie}
                                indicatorProps={{
                                    color: colors.PRIMARY,
                                    borderWidth: 0,
                                }}
                                backgroundColor='white'
                                source={piPhotoBack}
                                imageStyle={styles.imageStyles}
                            />
                        </View>
                    </View>
                    <View style={styles.imageRow}>
                        <Typography>Imagen de Busto</Typography>
                        <View style={styles.imageContainer}>
                            <View style={styles.editIcon}>
                                {uploadBust ? (
                                    <TouchableOpacity onPress={() => abortUploadBust()} >
                                        <RNImage backgroundColor='white'
                                            source={require('../../../assets/upload-to-cloud.gif')}
                                            style={{ height: 24, width: 24, position: 'relative', marginTop: 10 }} />
                                        <AntDesign
                                            style={{ position: 'absolute', top: 4, right: -4 }}
                                            name="close"
                                            color="#000"
                                            size={15}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => bustPhotoEdit()}>
                                        <MaterialCommunityIcons
                                            name="image-edit-outline"
                                            color={Colors.COLORS.PRIMARY}
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Image
                                indicator={Progress.Pie}
                                indicatorProps={{
                                    color: colors.PRIMARY,
                                    borderWidth: 0,
                                }}
                                backgroundColor='white'
                                source={bustPhoto}
                                imageStyle={styles.imageStyles}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 15, paddingVertical: 8, alignItems: 'center' }} >
                    <Typography style={{ color: Colors.COLORS.ON_SURFACE }} h3 bold>Calificación y opiniones:</Typography>
                </View>
                {reviews && reviews.length > 0 ? (
                    <ReviewRating reviews={reviews} />
                ) : (null)}
                {reviews && reviews.length > 0 ? (
                    reviews.slice(0).reverse().map((review, index) => {
                        if (review.approvalStatus == 'PENDING' || review.approvalStatus == 'DISAPPROVED' || review.approvalStatus == null) {
                            /* if (review.user.serverId == user_state.serverId) {
                                return <ReviewsCard key={index} review={review} />
                            } else { */
                            return null
                            /* } */
                        } else {
                            return <ReviewsCard key={index} review={review} />
                        }
                    })
                ) : (
                    <View style={{ alignItems: 'center' }}>
                        <Typography color={Colors.COLORS.WEB_LINK}>Aún no tienes calificaciones.</Typography>
                    </View>
                )}
                <Typography></Typography>
                <Typography></Typography>
            </ScrollView>
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
                            >Ha ocurrido un error actualizando la imagen. Esta es la nueva imagen comprimida, desea enviar esta imagen?</Typography>
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
        </>
    )
}

const styles = StyleSheet.create({
    resizeInfoContent: {
        backgroundColor: Colors.COLORS.WEB_BUTTON,
        paddingVertical: 15,
    },
    opinionAvatar: {
        width: 40,
        height: 40,
        borderRadius: 100,
        position: 'relative',
        marginRight: 8,

    },
    topButtons: {
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    vistaPrevia: {
        marginTop: 10,
        //marginHorizontal: 10,
        height: Dimensions.get('window').height * 0.70,
        width: '100%'
        /* marginTop: 10,
        marginHorizontal: 10,
        height: 500,
        resizeMode: 'contain',
        width: '99%' */
    },
    modalView: {
        flex: 1,
        paddingTop: 20,
        /* justifyContent: 'center',
        alignItems: 'center', */
        backgroundColor: 'rgba(0,0,0,0.7)'
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
    editIcon: {
        position: 'absolute',
        top: 18,
        right: 0,
    },
    imageRow: {
        marginVertical: 15,
    },
    imageContainer: {
        width: '100%',
        height: 180,
    },
    imageStyles: {
        position: 'relative',
        resizeMode: 'contain',
        marginTop: 10,
        alignSelf: 'center',
        width: '80%',
        height: 170,
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