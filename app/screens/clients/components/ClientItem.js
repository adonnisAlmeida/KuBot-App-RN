import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import { useTheme } from '@react-navigation/native'
import Theme from '../../../constants/Theme'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

const ClientItem = ({ navigation, client, ...props }) => {
    const { dark, colors } = useTheme()

    const avatar =
        client.avatar !== null
            ? {
                uri: client.avatar.url,
            }
            : require('../../../../assets/user_avatar.png')
    return (
        <TouchableOpacity {...props}
            onPress={() => navigation.navigate('ClientDetails', { client: client })}
        >
            <View
                style={[dark ? styles.cardDark : styles.card]}
            >
                <View style={styles.card_details}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={avatar}
                                imageStyle={styles.image}
                                indicator={Progress.Pie}
                                indicatorProps={{
                                    color: colors.PRIMARY,
                                    borderWidth: 0,
                                }}
                            />
                            <View style={{ marginLeft: 15, marginTop: 15 }}>
                                <Typography bold color={colors.ON_SURFACE}>
                                    {client ? (
                                        client.firstName ? (
                                            client.firstName + " " + client.lastName
                                        ) : (
                                            client.userName
                                        )
                                    ) : (
                                        "Invitado"
                                    )}
                                </Typography>
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Typography>
                                {client.addresses[0].streetAddress1}
                            </Typography>
                            <Typography>
                                {client.addresses[0].city}, {client.addresses[0].country.country}
                            </Typography>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ClientItem

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'transparent',
        marginHorizontal: 2,
        marginVertical: Theme.SIZES.BASE / 2,
        padding: Theme.SIZES.BASE,
        backgroundColor: Theme.LIGHT.SURFACE,
        shadowOpacity: Theme.SIZES.OPACITY,
        shadowColor: Theme.LIGHT.BACKGROUND,
        elevation: 16,
        borderRadius: Theme.SIZES.RADIUS,
    },
    image: {
        position: 'relative',
        height: 50,
        width: 50,
        backgroundColor: Theme.LIGHT.BACKGROUND,
        borderRadius: 100
    },
    cardDark: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'transparent',
        marginHorizontal: 2,
        marginVertical: Theme.SIZES.BASE / 2,
        padding: Theme.SIZES.BASE,
        backgroundColor: Theme.DARK.SURFACE,
        shadowOpacity: Theme.SIZES.OPACITY,
        shadowColor: Theme.DARK.BACKGROUND,
        elevation: 16,
        borderRadius: Theme.SIZES.RADIUS,
    },
    card_details: {
        flex: 2,
        paddingLeft: 12,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    select: {
        backgroundColor: '#cccccc',
    },
    selectDark: {
        backgroundColor: '#535353',
    },
})