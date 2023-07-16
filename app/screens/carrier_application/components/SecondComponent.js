import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Modal, ImageBackground, TouchableOpacity, ActivityIndicator, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Typography } from '../../../components'
import { useTheme } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../../constants/Colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ReactNativeFile } from 'apollo-upload-client'
import { WebView } from 'react-native-webview';

const SecondComponent = ({
    piPhotoFrontal,
    setPiPhotoFrontal,
    piPhotoBack,
    setPiPhotoBack,
    bustPhoto,
    setBustPhoto,
    setPiPhotoFrontalFile,
    setPiPhotoBackFile,
    setBustPhotoFile,
    piPhotoFrontalFile,
    piPhotoBackFile,
    bustPhotoFile,
    hasErrors,
    setErrors,
    terms,
    setTerms,
}) => {
    const { colors } = useTheme()
    const [showModal, setShowModal] = useState(false)
    const [showTerms, setShowTerms] = useState(false)
    const [vistaPrevia, setVistaPrevia] = useState(null)
    const [confirmModal, setConfirmModal] = useState(false)
    const [activity, setActivity] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        if (piPhotoFrontalFile != null) {
            setErrors(pre => pre.filter((key) => key != 'piPhotoFrontalFile'))
        }
    }, [piPhotoFrontalFile])
    useEffect(() => {
        if (piPhotoBackFile != null) {
            setErrors(pre => pre.filter((key) => key != 'piPhotoBackFile'))
        }
    }, [piPhotoBackFile])
    useEffect(() => {
        if (bustPhotoFile != null) {
            setErrors(pre => pre.filter((key) => key != 'bustPhotoFile'))
        }
    }, [bustPhotoFile])

    useEffect(() => {
        if (terms) {
            setErrors(pre => pre.filter((key) => key != 'terms'))
        }
    }, [terms])

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
            console.log("selectedImage >> ", selectedImage)
            switch (selectedImage) {
                case 'piPhotoFrontal':
                    setPiPhotoFrontalFile(file)
                    break;
                case 'piPhotoBack':
                    setPiPhotoBackFile(file)
                    break;
                case 'bustPhoto':
                    setBustPhotoFile(file)
                    break;
                default:
                    break;
            }
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
            console.log("selectedImage >> ", selectedImage)
            switch (selectedImage) {
                case 'piPhotoFrontal':
                    setPiPhotoFrontalFile(file)
                    break;
                case 'piPhotoBack':
                    setPiPhotoBackFile(file)
                    break;
                case 'bustPhoto':
                    setBustPhotoFile(file)
                    break;
                default:
                    break;
            }
        }
    }

    const sendImage = () => {
        setActivity(true)
        switch (selectedImage) {
            case 'piPhotoFrontal':
                setActivity(false)
                setConfirmModal(false)
                setPiPhotoFrontal(vistaPrevia)
                break;
            case 'piPhotoBack':
                setActivity(false)
                setConfirmModal(false)
                setPiPhotoBack(vistaPrevia)
                break;
            case 'bustPhoto':
                setActivity(false)
                setConfirmModal(false)
                setBustPhoto(vistaPrevia)
                break;
            default:
                break;
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={true}
            style={{
                flex: 1,
                paddingTop: 20,
                //marginHorizontal: 20,
                //marginBottom: 59,
            }}>
            <View style={{ marginHorizontal: 20 }}>
                <View style={styles.imageRow}>
                    <Typography color={hasErrors('piPhotoFrontalFile') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}>Imagen delantera del CI</Typography>
                    <View style={styles.imageContainer}>
                        <View style={styles.editIcon}>
                            <TouchableOpacity onPress={() => piPhotoFrontalEdit()} >
                                <MaterialIcons
                                    name="add-photo-alternate"
                                    color={hasErrors('piPhotoFrontalFile') ? Colors.COLORS.ERROR : Colors.COLORS.PRIMARY}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => piPhotoFrontalEdit()} >
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
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.imageRow}>
                    <Typography color={hasErrors('piPhotoBackFile') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}>Imagen trasera del CI</Typography>
                    <View style={styles.imageContainer}>
                        <View style={styles.editIcon}>
                            <TouchableOpacity onPress={() => piPhotoBackEdit()}>
                                <MaterialIcons
                                    name="add-photo-alternate"
                                    color={hasErrors('piPhotoBackFile') ? Colors.COLORS.ERROR : Colors.COLORS.PRIMARY}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => piPhotoBackEdit()}>
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
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.imageRow}>
                    <Typography color={hasErrors('bustPhotoFile') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}>Imagen de Busto</Typography>
                    <View style={styles.imageContainer}>
                        <View style={styles.editIcon}>
                            <TouchableOpacity onPress={() => bustPhotoEdit()}>
                                <MaterialIcons
                                    name="add-photo-alternate"
                                    color={hasErrors('bustPhotoFile') ? Colors.COLORS.ERROR : Colors.COLORS.PRIMARY}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => bustPhotoEdit()}>
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
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <TouchableOpacity
                            onPress={() => setTerms(!terms)}
                            style={{
                                //backgroundColor: 'red',
                                padding: 5,
                                alignContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {terms ? (
                                <FontAwesome
                                    name="check-square-o"
                                    color={Colors.COLORS.PRIMARY}
                                    size={25}
                                />
                            ) : (
                                <FontAwesome
                                    style={{ marginRight: 3.7 }}
                                    name="square-o"
                                    color={hasErrors('terms') ? Colors.COLORS.ERROR : Colors.COLORS.PRIMARY}
                                    size={25}
                                />
                            )}
                        </TouchableOpacity>

                        <View style={{
                            marginLeft: 2,
                            marginTop: 5,
                            flexDirection: 'row',
                            width: '86%',

                        }}>
                            <Typography
                                color={hasErrors('terms') ? Colors.COLORS.ERROR : '#000'}
                            >Acepto los</Typography>
                            <TouchableOpacity
                                onPress={() => setShowTerms(true)}
                                style={{
                                    marginLeft: 2,
                                }}>
                                <Typography color={Colors.COLORS.WEB_LINK}>Términos y Condiciones de Uso de Datos</Typography>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Typography />
                <Typography />
                <Typography />
                <Typography />
                <Typography />
                <Typography />
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
            <Modal
                visible={showTerms}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowTerms(false)}
            >
                <TouchableOpacity
                    style={styles.centeredView}
                    onPressOut={() => setShowTerms(false)}
                >
                    <TouchableWithoutFeedback>
                        <View style={{
                            flex: 1,
                            //backgroundColor: 'red',
                            margin: 10,
                            width: '95%'
                        }}>
                            <WebView
                                //originWhitelist={['*']}
                                source={{ uri: 'http://lajabitadelloco.com:8000/es/account/terms-cond-data' }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowTerms(false)}
                                style={{
                                    backgroundColor: Colors.COLORS.PRIMARY,
                                    position: 'absolute',
                                    padding: 10,
                                    borderRadius: 100,
                                    paddingVertical: 12,
                                    bottom: 10,
                                    right: 10,

                                }}>
                                <AntDesign
                                    style={{ marginRight: 3.7 }}
                                    name="back"
                                    color='#fff'
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    imageRow: {
        marginVertical: 8,
    },
    topButtons: {
        paddingHorizontal: 25,
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
        height: Dimensions.get('window').height * 0.85,
        width: '100%'
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
    editIcon: {
        position: 'absolute',
        top: 15,
        //right: 0,
        left: 15,
        zIndex: 10
    },
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
        //borderRadius: 100,
        backgroundColor: 'transparent'
    },
})

export default SecondComponent