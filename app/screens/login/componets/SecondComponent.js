import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, Dimensions, TouchableOpacity, Modal, ImageBackground, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PreventRemoveContext, useTheme } from '@react-navigation/native'
import { Select, Typography } from '../../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import Colors from '../../../constants/Colors'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Picker } from '@react-native-picker/picker'
import { COUNTRIES } from '../../../constants/Other'
import { containsOnlyNumbers } from '../../../utils/CommonFunctions'

const SecondComponent = ({
    nombre,
    setNombre,
    apellidos,
    setApellidos,
    pais,
    setPais,
    provincia,
    setProvincia,
    municipio,
    setMunicipio,
    direccion1,
    setDireccion1,
    direccion2,
    setDireccion2,
    codigoPostal,
    setCodigoPostal,
    telefono,
    setTelefono,
    carnet,
    setCarnet,
    empresa,
    setEmpresa,
    hasErrors,
    setErrors,
    provinciasList,
}) => {
    const { colors } = useTheme()

    useEffect(() => {
        if (containsOnlyNumbers(carnet) && carnet.length == 11) {
            setErrors(pre => pre.filter((key) => key != 'carnet'))
        }
    }, [carnet])

    return (
        <View>
            <View>
                <Typography
                    color={hasErrors('nombre') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Nombre
                </Typography>
                <TextInput
                    value={nombre}
                    style={[
                        styles.input,
                        hasErrors('nombre'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Nombre'
                    onChangeText={(text) => setNombre(text)}
                />
            </View>
            <View style={{ marginTop: 15 }}>
                <Typography
                    color={hasErrors('apellidos') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Apellidos
                </Typography>
                <TextInput
                    value={apellidos}
                    style={[
                        styles.input,
                        hasErrors('apelidos'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Apellidos'
                    onChangeText={(text) => setApellidos(text)}
                />
            </View>
            <View
                style={{
                    marginTop: 15,
                    borderBottomColor: '#8E8E8E',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                <Typography
                    color={hasErrors('pais') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                >
                    País
                </Typography>
                <Picker
                    themeVariant={'dark'}
                    selectedValue={pais}
                    style={[
                        //styles.select,
                        {
                            color: colors.ON_BACKGROUND,
                            padding: 0,
                            marginLeft: -14,
                        },
                    ]}
                    onValueChange={(itemValue, itemIndex) => {
                        setPais(itemValue)
                    }
                    }>
                    {
                        COUNTRIES.map((item, index) => {
                            return <Picker.Item key={index} themeVariant={'dark'} label={item.name} value={index} />
                        })
                    }
                </Picker>
                {/* <TextInput
                    value={pais}
                    style={[
                        styles.input,
                        hasErrors('pais'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='País'
                    onChangeText={(text) => setPais(text)}
                /> */}
            </View>
            <View
                style={{
                    marginTop: 15,
                    borderBottomColor: '#8E8E8E',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            >
                <Typography
                    color={hasErrors('provincia') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Provincia
                </Typography>
                <Picker
                    themeVariant={'dark'}
                    selectedValue={provincia}
                    style={[
                        //styles.select,
                        {
                            color: colors.ON_BACKGROUND,
                            padding: 0,
                            marginLeft: -14,
                        },
                    ]}
                    onValueChange={(itemValue, itemIndex) => {
                        setProvincia(itemValue)
                    }
                    }>
                    {
                        provinciasList.map((item, index) => {
                            return <Picker.Item key={index} themeVariant={'dark'} label={item.name} value={index} />
                        })
                    }
                </Picker>
                {/* <TextInput
                    value={provincia}
                    style={[
                        styles.input,
                        hasErrors('provincia'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Provincia'
                    onChangeText={(text) => setProvincia(text)}
                /> */}
            </View>
            <View
                style={{
                    marginTop: 15,
                    borderBottomColor: '#8E8E8E',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            >
                <Typography
                    color={hasErrors('minicipio') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Municipio
                </Typography>
                <Picker
                    themeVariant={'dark'}
                    selectedValue={municipio}
                    style={[
                        //styles.select,
                        {
                            color: colors.ON_BACKGROUND,
                            padding: 0,
                            marginLeft: -14,
                        },
                    ]}
                    onValueChange={(itemValue, itemIndex) => {
                        setMunicipio(itemValue)
                    }
                    }>
                    {
                        provinciasList[provincia].municipios.map((item, index) => {
                            return <Picker.Item key={index} themeVariant={'dark'} label={item.node.name} value={index} />
                        })
                    }
                </Picker>
                {/* <TextInput
                    value={municipio}
                    style={[
                        styles.input,
                        hasErrors('municipio'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Municipio'
                    onChangeText={(text) => setMunicipio(text)}
                /> */}
            </View>
            <View style={{ marginTop: 15 }}>
                <Typography
                    color={hasErrors('direccion') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Dirección
                </Typography>
                <TextInput
                    value={direccion1}
                    style={[
                        styles.input,
                        hasErrors('direccion'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Dirección'
                    onChangeText={(text) => setDireccion1(text)}
                />
                <TextInput
                    value={direccion2}
                    style={[
                        styles.input,
                        hasErrors('Dirección'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Departamento, suite, edificio, piso, etc'
                    onChangeText={(text) => setDireccion2(text)}
                />
            </View>
            <View style={{ marginTop: 15 }}>
                <Typography
                    color={hasErrors('codigoPostal') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Código Postal
                </Typography>
                <TextInput
                    value={codigoPostal}
                    style={[
                        styles.input,
                        hasErrors('codigoPostal'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Código Postal'
                    onChangeText={(text) => setCodigoPostal(text)}
                />
            </View>
            <View style={{ marginTop: 15 }}>
                <Typography
                    color={hasErrors('carnet') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Carné de Identidad (Debe mostrarlo cuando reciba el envío)
                </Typography>
                <TextInput
                    keyboardType='number-pad'
                    value={carnet}
                    style={[
                        styles.input,
                        hasErrors('carnet'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Identificación personal'
                    onChangeText={(text) => setCarnet(text)}
                />
                {hasErrors('carnet') ? (
                    <Typography color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                        El carné de identidad no es válido.
                    </Typography>
                ) : (
                    null
                )}
            </View>
            <View style={{ marginTop: 15 }}>
                <Typography
                    color={hasErrors('telefono') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Número de teléfono
                </Typography>
                <TextInput
                    keyboardType='phone-pad'
                    inputMode='tel'
                    value={telefono}
                    style={[
                        styles.input,
                        hasErrors('telefono'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Número de teléfono'
                    onChangeText={(text) => setTelefono(text)}
                />
            </View>
            <View style={{ marginTop: 15 }}>
                <Typography
                    color={hasErrors('empresa') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Empresa
                </Typography>
                <TextInput
                    value={empresa}
                    style={[
                        styles.input,
                        hasErrors('empresa'),
                        { color: colors.ON_BACKGROUND },
                    ]}
                    placeholder='Empresa'
                    onChangeText={(text) => setEmpresa(text)}
                />
            </View>
            <Typography></Typography>
            <Typography></Typography>
        </View>
    )
}

const styles = StyleSheet.create({
    select: {
        borderRadius: 0,
        borderWidth: 0,
        marginTop: -15,
        marginLeft: -15,
        marginBottom: -6,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    login: {
        flex: 1,
        padding: 15,
        marginTop: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    input: {
        borderRadius: 0,
        borderWidth: 0,
        height: 45,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    hasErrors: {
        borderBottomColor: '#CF6679',
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
        borderRadius: 100,
        //backgroundColor: 'red'
    },
})


export default SecondComponent