import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, Platform, ToastAndroid } from 'react-native'
import React from 'react'
import { Button, Typography } from '../../components'
import { useState } from 'react'
import { useTheme } from '@react-navigation/native'
import { ADDRESS_UPDATE } from '../../graphql/customers'
import { useMutation } from '@apollo/client'

const EditAddressScreen = ({ navigation, route }) => {
    const addressParam = route.params?.address
    const { colors } = useTheme()
    const [errors, setErrors] = useState([])
    const [firstName, setFirstName] = useState(addressParam.firstName)
    const [lastName, setLastName] = useState(addressParam.lastName)
    const [country, setCountry] = useState(addressParam.country.country)
    const [countryArea, setCountryArea] = useState(addressParam.countryArea)
    const [city, setCity] = useState(addressParam.city)
    const [address, setAddress] = useState(addressParam.streetAddress1)
    const [address2, setAddress2] = useState(addressParam.streetAddress2)
    const [postalCode, setPostalCode] = useState(addressParam.postalCode)
    const [phone, setPhone] = useState(addressParam.phone)
    const [companyName, setCompanyName] = useState(addressParam.companyName)
    const [activity, setActivity] = useState(false)

    console.log("ID ADDRESS >> ", addressParam.id)

    const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

    const [addressUpdate, { loadin, error, data }] = useMutation(ADDRESS_UPDATE, {
        onCompleted: (data) => {
            console.log("addressUpdate Actualizoooo ", data)
            setActivity(false)
            if (Platform.OS === 'android')
                ToastAndroid.show('Dirección actualizada correctamente.', ToastAndroid.LONG)
            /* dispatch(
                setUser({
                    ...user_state,
                    avatar: dataAvatar.userAvatarUpdate.user.avatar
                })
            ) */
            navigation.goBack()
        },
        onError: (errorAvatar) => {
            setActivity(false)
            if (Platform.OS === 'android')
                ToastAndroid.show('Error actualizando el dirección.', ToastAndroid.LONG)
            console.log('Error addressUpdate >> ', errorAvatar)
        }
    })

    const handleUpdateAddress = () => {
        let error_data = []

        if (city == '') error_data.push('city')
        if (address == '') error_data.push('address')

        if (error_data.length > 0) {
            setErrors(error_data)
        } else {
            setActivity(true)
            addressUpdate({
                variables: {
                    id: addressParam.id,
                    input: {
                        firstName: firstName,
                        lastName: lastName,
                        companyName: companyName,
                        streetAddress1: address,
                        streetAddress2: address2,
                        city: city,
                        postalCode: postalCode,
                        country: {
                            country: country
                        },
                        countryArea: countryArea,
                        phone: phone
                    }
                }
            })
        }
    }

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView >
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Nombre
                    </Typography>
                    <TextInput
                        placeholder='Nombre'
                        value={firstName}
                        style={[
                            styles.input,
                            hasErrors('firstName'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setFirstName(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Apellido
                    </Typography>
                    <TextInput
                        value={lastName}
                        placeholder='Apellido'
                        style={[
                            styles.input,
                            hasErrors('lastName'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setLastName(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        País
                    </Typography>
                    <TextInput
                        placeholder='País'
                        value={country}
                        style={[
                            styles.input,
                            hasErrors('country'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setCountry(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Provincia
                    </Typography>
                    <TextInput
                        placeholder='Provincia'
                        value={countryArea}
                        style={[
                            styles.input,
                            hasErrors('countryArea'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setCountryArea(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Municipio
                    </Typography>
                    <TextInput
                        placeholder='Municipio'
                        value={city}
                        style={[
                            styles.input,
                            hasErrors('city'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setCity(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Dirección
                    </Typography>
                    <TextInput
                        placeholder='Dirección'
                        value={address}
                        style={[
                            styles.input,
                            hasErrors('address'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setAddress(text)}
                    />
                    <TextInput
                        placeholder='Departamento, suite, unidad, edificio, piso, etc'
                        value={address2}
                        style={[
                            styles.input,
                            hasErrors('address2'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setAddress2(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Código Postal
                    </Typography>
                    <TextInput
                        placeholder='Código Postal'
                        value={postalCode}
                        style={[
                            styles.input,
                            hasErrors('postalCode'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setPostalCode(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Número de teléfono
                    </Typography>
                    <TextInput
                        placeholder='Número de teléfono'
                        value={phone}
                        style={[
                            styles.input,
                            hasErrors('phone'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setPhone(text)}
                    />
                </View>
                <View>
                    <Typography
                        color={colors.ON_SURFACE_VARIANT}
                        style={styles.inputLabel}
                    >
                        Empresa
                    </Typography>
                    <TextInput
                        placeholder='Empresa'
                        value={companyName}
                        style={[
                            styles.input,
                            hasErrors('companyName'),
                            { color: colors.ON_BACKGROUND },
                        ]}
                        onChangeText={(text) => setCompanyName(text)}
                    />
                </View>
                <Button style={{ alignItems: 'center', marginVertical: 16 }} onPress={() => handleUpdateAddress()}>
                    {activity ? (
                        <ActivityIndicator />
                    ) : (
                        <Typography color="#ffffff">
                            Guardar Cambios
                        </Typography>
                    )}

                </Button>
                <Typography />
                <Typography />
                <Typography />
            </KeyboardAvoidingView>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    inputLabel: {
        marginTop: 20
    },
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 45,
    },
    hasErrors: {
        borderBottomColor: '#CF6679',
    },
})

export default EditAddressScreen