import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, Dimensions, TouchableOpacity, Modal, ImageBackground, ActivityIndicator, TouchableWithoutFeedback, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PreventRemoveContext, useTheme } from '@react-navigation/native'
import { Select, Typography } from '../../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../../constants/Colors'
import { Picker } from '@react-native-picker/picker'
import { COUNTRIES } from '../../../constants/Other'
import { containsOnlyNumbers } from '../../../utils/CommonFunctions'

const FirstComponent = ({
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
    codigoTelefono,
    setCodigoTelefono,
    carnet,
    setCarnet,
    empresa,
    setEmpresa,
    hasErrors,
    setErrors,
    provinciasList,
    loadingZones,
}) => {
    const { colors } = useTheme()

    useEffect(() => {
        if (containsOnlyNumbers(carnet) && carnet.length == 11) {
            setErrors(pre => pre.filter((key) => key != 'carnet'))
        }
    }, [carnet])

    useEffect(() => {
        if (direccion1.length > 0) {
            setErrors(pre => pre.filter((key) => key != 'direccion1'))
        }
    }, [direccion1])

    /* useEffect(() => {
        if (direccion2.length > 0) {
            setErrors(pre => pre.filter((key) => key != 'direccion2'))
        }
    }, [direccion2]) */

    useEffect(() => {
        if (containsOnlyNumbers(telefono) && telefono.length == 8) {
            setErrors(pre => pre.filter((key) => key != 'telefono'))
        }
    }, [telefono])

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={85}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    paddingTop: 20,
                    paddingHorizontal: 20,
                    //paddingBottom: 59,
                }}>
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
                                setCodigoTelefono(itemValue)
                            }
                            }>
                            {
                                COUNTRIES.map((item, index) => {
                                    return <Picker.Item key={index} themeVariant={'dark'} label={item.name} value={index} />
                                })
                            }
                        </Picker>
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
                        {loadingZones ? (
                            <ActivityIndicator style={{ padding: 15 }}></ActivityIndicator>
                        ) : (
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
                                    setMunicipio(0)
                                }
                                }>
                                {
                                    provinciasList.map((item, index) => {
                                        return <Picker.Item key={index} themeVariant={'dark'} label={item.name} value={index} />
                                    })
                                }
                            </Picker>
                        )}
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
                        {loadingZones ? (
                            <ActivityIndicator style={{ padding: 15 }}></ActivityIndicator>
                        ) : (
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
                                    provinciasList[provincia]?.municipios.map((item, index) => {
                                        return <Picker.Item key={index} themeVariant={'dark'} label={item.node.name} value={index} />
                                    })
                                }
                            </Picker>
                        )}
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Typography
                            color={hasErrors('direccion1') || hasErrors('direccion2') ? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                        //style={{ marginVertical: 10 }}
                        >
                            Dirección
                        </Typography>
                        <TextInput
                            value={direccion1}
                            style={[
                                styles.input,
                                hasErrors('direccion1'),
                                { color: colors.ON_BACKGROUND },
                            ]}
                            placeholder='Dirección'
                            onChangeText={(text) => setDireccion1(text)}
                        />
                        {hasErrors('direccion1') ? (
                            <Typography color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                                Este campo es requerido.
                            </Typography>
                        ) : (
                            null
                        )}
                        <TextInput
                            value={direccion2}
                            style={[
                                styles.input,
                                hasErrors('direccion2'),
                                { color: colors.ON_BACKGROUND },
                            ]}
                            placeholder='Departamento, suite, edificio, piso, etc'
                            onChangeText={(text) => setDireccion2(text)}
                        />
                        {hasErrors('direccion2') ? (
                            <Typography color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                                Este campo es requerido.
                            </Typography>
                        ) : (
                            null
                        )}
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
                        <View style={{ flexDirection: 'row' }}>
                            <Typography
                                style={{
                                    fontSize: 16,
                                    marginTop: 11,
                                    paddingRight: 5,
                                    borderBottomColor: '#8E8E8E',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}>
                                {COUNTRIES[codigoTelefono].mobileCode}
                            </Typography>
                            <TextInput
                                keyboardType='phone-pad'
                                inputMode='tel'
                                value={telefono}
                                style={[
                                    styles.input,
                                    hasErrors('telefono'),
                                    { color: colors.ON_BACKGROUND, width: '100%' },
                                ]}
                                placeholder='Número de teléfono'
                                onChangeText={(text) => setTelefono(text)}
                            />
                        </View>
                        {hasErrors('telefono') ? (
                            <Typography color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                                El número de teléfono no es válido.
                            </Typography>
                        ) : (
                            null
                        )}
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
                    <Typography></Typography>
                    <Typography></Typography>
                    <Typography></Typography>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

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
    input: {
        borderRadius: 0,
        borderWidth: 0,
        height: 45,
        fontSize: 16,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    hasErrors: {
        borderBottomColor: '#CF6679',
    },
})

export default FirstComponent