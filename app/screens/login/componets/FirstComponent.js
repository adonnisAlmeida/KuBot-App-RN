import { View, Text, KeyboardAvoidingView, StyleSheet, Platform, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Typography } from '../../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'
import Colors from '../../../constants/Colors'

const FirstComponent = ((
    { email, setEmail, setPassError, passError, emailError, setEmailError, setErrors, hasErrors, password, setPassword, repeatPassword, setRepeatPassword },
    ref) => {
    const { colors } = useTheme()
    const [isSecureP, setIsSecureP] = useState(true)
    const [isSecureR, setIsSecureR] = useState(true)
    const [secureIconP, setSecureIconP] = useState('eye')
    const [secureIconR, setSecureIconR] = useState('eye')

    const changeSecureP = () => {
        setIsSecureP(!isSecureP)
        if (isSecureP) {
            setSecureIconP('eye-slash')
        } else {
            setSecureIconP('eye')
        }
    }

    const changeSecureR = () => {
        setIsSecureR(!isSecureR)
        if (isSecureR) {
            setSecureIconR('eye-slash')
        } else {
            setSecureIconR('eye')
        }
    }

    useEffect(() => {
        setEmailError(null)
        setErrors(prevState => {
            return prevState.filter((e) => e != 'email')
        })
    }, [email])

    useEffect(() => {
        setPassError(null)
        setErrors(prevState => {
            return prevState.filter((e) => e != 'password')
        })
    }, [password, repeatPassword])

    return (
        <View style={{ paddingBottom: 30}}>
            <View>
                <Typography
                    color={hasErrors('email')? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Correo
                </Typography>
                <TextInput
                    keyboardType='email-address'
                    value={email}
                    style={[
                        styles.input,
                        hasErrors('email'),
                        {
                            color: colors.ON_BACKGROUND,
                            borderBottomColor: '#8E8E8E',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        },
                    ]}
                    onChangeText={(text) => setEmail(text)}
                />
                {emailError ? (
                    <Typography small color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                        {emailError}
                    </Typography>
                ) : (null)}
            </View>
            <View style={{ marginTop: 20 }}>
                <Typography
                    color={hasErrors('password')? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Contraseña
                </Typography>
                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: '#8E8E8E',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                    <TextInput
                        secureTextEntry={isSecureP}
                        value={password}
                        style={[
                            styles.input,
                            hasErrors('password'),
                            { color: colors.ON_BACKGROUND, flex: 1 },
                        ]}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity onPress={() => changeSecureP()}>
                        <FontAwesome
                            style={{ marginTop: 10 }}
                            name={secureIconP}
                            size={24}
                        //color={colors.SURFACE}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <Typography
                    color={hasErrors('password')? Colors.COLORS.ERROR : colors.ON_SURFACE_VARIANT}
                //style={{ marginVertical: 10 }}
                >
                    Repetir Contraseña
                </Typography>
                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: '#8E8E8E',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                    <TextInput
                        secureTextEntry={isSecureR}
                        value={repeatPassword}
                        style={[
                            styles.input,
                            hasErrors('password'),
                            { color: colors.ON_BACKGROUND, flex: 1 },
                        ]}
                        onChangeText={(text) => setRepeatPassword(text)}
                    />
                    <TouchableOpacity onPress={() => changeSecureR()}>
                        <FontAwesome
                            style={{ marginTop: 10 }}
                            name={secureIconR}
                            size={24}
                        //color={colors.SURFACE}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {passError ? (
                <Typography small color={Colors.COLORS.ERROR} style={{ marginVertical: 10 }} >
                    {passError}
                </Typography>
            ) : (null)}
        </View>
    )
})

const styles = StyleSheet.create({
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
        fontSize: 16,
    },
    hasErrors: {
        borderBottomColor: '#CF6679',
    },
})

export default FirstComponent