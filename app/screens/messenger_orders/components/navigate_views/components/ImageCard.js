import { View, Text, TouchableOpacity, Modal, ImageBackground, Image as RNImage, Dimensions, ToastAndroid, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../../../../constants/Colors'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { Typography } from '../../../../../components'
import { useMutation } from '@apollo/client'
import { DELETE_EVIDENCE_IMAGE_REJECTION, DELETE_PACKAGE_IMAGE_DELIVERED, DELETE_SIGNATURE_IMAGE_DELIVERED, DELETE_SIGNATURE_IMAGE_REJECTION } from '../../../../../graphql/orders'

const ImageCard = ({ photo, setImages, mutation }) => {
    const [preViewModal, setPreViewModal] = useState(false)
    const [deletingImage, setDeletingImage] = useState(false)
    const [errorDeleting, setErrorDeleting] = useState(false)


    //console.log(photo)

    const [signatureRejectionImageDelete, { loadingSignature, errorSignature, dataSignature }] = useMutation(DELETE_SIGNATURE_IMAGE_REJECTION, {
        onCompleted: (dataSignature) => {
            if (dataSignature.deleteSignatureImageRejection.errors.length != 0) {
                console.log("Errores", dataSignature.deleteSignatureImageRejection.errors)
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Error eliminado imagen.', ToastAndroid.LONG)
                }
                setErrorDeleting(true)
                setTimeout(() => {
                    setErrorDeleting(false)
                }, 2000);
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Imagen eliminada correctamente.', ToastAndroid.LONG)
                }
                setImages((prev) => prev.filter((temp) => temp.id != photo.id))
                setDeletingImage(false)
            }
        },
        onError: (errorSignature, dataSignature) => {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error eliminando la imagen de evidencia.', ToastAndroid.LONG)
            }
            console.log('Error subiendo imagen >> ', errorSignature)
            console.log('Error subiendo imagen dataSignature >> ', dataSignature)
            setDeletingImage(false)
            setErrorDeleting(true)
            setTimeout(() => {
                setErrorDeleting(false)
            }, 2000);
        }
    })

    const [evidenceRejectionImageDelete, { loadingEvidence, errorEvidence, dataEvidence }] = useMutation(DELETE_EVIDENCE_IMAGE_REJECTION, {
        onCompleted: (dataEvidence) => {
            if (dataEvidence.deleteEvidenceImageRejection.errors.length != 0) {
                console.log("Errores", dataEvidence.deleteEvidenceImageRejection.errors)
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Error eliminado imagen.', ToastAndroid.LONG)
                }
                setErrorDeleting(true)
                setTimeout(() => {
                    setErrorDeleting(false)
                }, 2000);
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Imagen eliminada correctamente.', ToastAndroid.LONG)
                }
                setImages((prev) => prev.filter((temp) => temp.id != photo.id))
                setDeletingImage(false)
            }
        },
        onError: (errorEvidence, dataEvidence) => {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error eliminando la imagen de evidencia.', ToastAndroid.LONG)
            }
            console.log('Error subiendo imagen >> ', errorEvidence)
            console.log('Error subiendo imagen dataEvidence >> ', dataEvidence)
            setDeletingImage(false)
            setErrorDeleting(true)
            setTimeout(() => {
                setErrorDeleting(false)
            }, 2000);
        }
    })

    const [signatureDeliveredImageDelete, { loadingDelivered, errorDelivered, dataDelivered }] = useMutation(DELETE_SIGNATURE_IMAGE_DELIVERED, {
        onCompleted: (dataDelivered) => {
            if (dataDelivered.deleteSignatureImageDelivered.errors.length != 0) {
                console.log("Errores", dataDelivered.deleteSignatureImageDelivered.errors)
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Error eliminado imagen.', ToastAndroid.LONG)
                }
                setErrorDeleting(true)
                setTimeout(() => {
                    setErrorDeleting(false)
                }, 2000);
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Imagen eliminada correctamente.', ToastAndroid.LONG)
                }
                setImages((prev) => prev.filter((temp) => temp.id != photo.id))
                setDeletingImage(false)
            }
        },
        onError: (errorDelivered, dataDelivered) => {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error eliminando la imagen de firma.', ToastAndroid.LONG)
            }
            console.log('Error eliminando imagen >> ', JSON.stringify(errorDelivered, null, 2))
            console.log('Error eliminando imagen dataDelivered >> ', dataDelivered)
            setDeletingImage(false)
            setErrorDeleting(true)
            setTimeout(() => {
                setErrorDeleting(false)
            }, 2000);
        }
    })

    const [packageDeliveredImageDelete, { loadingpackage, errorpackage, datapackage }] = useMutation(DELETE_PACKAGE_IMAGE_DELIVERED, {
        onCompleted: (dataPackage) => {
            if (dataPackage.deletePackageImageDelivered.errors.length != 0) {
                console.log("Errores", dataPackage.deletePackageImageDelivered.errors)
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Error eliminado imagen.', ToastAndroid.LONG)
                }
                setErrorDeleting(true)
                setTimeout(() => {
                    setErrorDeleting(false)
                }, 2000);
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Imagen eliminada correctamente.', ToastAndroid.LONG)
                }
                setImages((prev) => prev.filter((temp) => temp.id != photo.id))
                setDeletingImage(false)
            }
        },
        onError: (errorPackage, dataPackage) => {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Ha ocurrido un error eliminando la imagen de evidencia.', ToastAndroid.LONG)
            }
            console.log('Error subiendo imagen >> ', errorPackage)
            console.log('Error subiendo imagen dataEvidence >> ', dataPackage)
            setDeletingImage(false)
            setErrorDeleting(true)
            setTimeout(() => {
                setErrorDeleting(false)
            }, 2000);
        }
    })

    const deleteImage = () => {
        setPreViewModal(false)
        setDeletingImage(true)
        switch (mutation) {
            case 'SIGNATURE_REJECTED':
                signatureRejectionImageDelete({ variables: { id: photo.id } })
                break;
            case 'EVIDENCE_REJECTED':
                evidenceRejectionImageDelete({ variables: { id: photo.id } })
                break;
            case 'SIGNATURE_DELIVERED':
                signatureDeliveredImageDelete({ variables: { id: photo.id } })
                break;
            case 'PACKAGE_DELIVERED':
                packageDeliveredImageDelete({ variables: { id: photo.id } })
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
                onRequestClose={() => setPreViewModal(false)}
            >
                <View
                    behavior={"padding"} style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.7)'
                    }}
                >
                    <ImageBackground
                        resizeMode='contain'
                        style={{
                            marginTop: 10,
                            height: Dimensions.get('window').height * 0.75,
                            width: '100%'
                        }}
                        source={{ uri: photo.image.url, }}
                    />
                    {photo.alt ? (
                        <Typography size={15} color={'#fff'}>
                            {photo.alt}
                        </Typography>
                    ) : (photo.image.alt ? (
                        <Typography size={15} color={'#fff'}>
                            {photo.image.alt}
                        </Typography>
                    ) : null)}

                </View>
                <View
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        justifyContent: 'space-between',
                        padding: 18,
                        flexDirection: 'row',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setPreViewModal(false)}

                    >
                        <Ionicons
                            name='ios-arrow-back-outline'
                            size={35}
                            color={'#fff'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deleteImage()}
                    >
                        <Ionicons
                            name='trash-outline'
                            size={35}
                            color={Colors.COLORS.LABEL}
                        />
                    </TouchableOpacity>
                </View>

                {/* <View style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    flexDirection: 'row'
                }}>
                    <Typography>
                    </Typography>
                    <TouchableOpacity
                        onPress={() => setPreViewModal(false)}
                    >
                        <Ionicons
                            name='close'
                            size={40}
                            color={'#fff'}
                        />
                    </TouchableOpacity>

                </View> */}
            </Modal>
            {deletingImage ? (
                <TouchableOpacity
                    style={{ marginRight: 8 }}
                >
                    <View>
                        <Image
                            source={{ uri: photo.image.url }}
                            indicator={Progress.Pie}
                            indicatorProps={{
                                color: Colors.COLORS.PRIMARY,
                                borderWidth: 0,
                            }}
                            imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                        />
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.7)'
                        }}
                    >
                        <RNImage
                            source={require('../../../../../../assets/outline-bin-solid.gif')}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                </TouchableOpacity>
            ) : (
                errorDeleting ? (
                    <TouchableOpacity
                        style={{ marginRight: 8 }}
                    >
                        <View>
                            <Image
                                source={{ uri: photo.image.url }}
                                indicator={Progress.Pie}
                                indicatorProps={{
                                    color: Colors.COLORS.PRIMARY,
                                    borderWidth: 0,
                                }}
                                imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                            />
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.7)'
                            }}
                        >
                            <RNImage
                                source={require('../../../../../../assets/outline-error-solid.gif')}
                                style={{ width: 40, height: 40 }}
                            />
                        </View>
                    </TouchableOpacity>
                ) : (
                    < TouchableOpacity
                        onPress={() => setPreViewModal(true)}
                        style={{ marginRight: 8 }}
                    >
                        <View >
                            <Image
                                source={{ uri: photo.image.url }}
                                indicator={Progress.Pie}
                                indicatorProps={{
                                    color: Colors.COLORS.PRIMARY,
                                    borderWidth: 0,
                                }}
                                imageStyle={{ height: 90, width: 90, position: 'relative', resizeMode: 'contain' }}
                            />
                        </View>
                    </TouchableOpacity>
                )
            )}
        </>
    )
}

export default ImageCard