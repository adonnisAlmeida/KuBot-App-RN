import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import { useTheme } from '@react-navigation/native'
import Theme from '../../../constants/Theme'

const SellerItem = ({ navigation, seller, ...props }) => {
    const { dark, colors } = useTheme()
    console.log('SELLERRR >>> ', seller.user.avatar)
    const avatar =
        seller.user.avatar !== null
            ? {
                uri: seller.user.avatar.url,
            }
            : require('../../../../assets/user_avatar.png')
            
    return (
        <TouchableOpacity {...props}
            onPress={() => navigation.navigate('SellerDetails', { seller: seller.user })}
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
                                style={styles.image}
                            />
                            <View style={{ marginLeft: 15, marginTop: 15 }}>
                                <Typography bold color={colors.ON_SURFACE}>
                                    {seller.user.firstName} {seller.user.lastName}
                                </Typography>
                            </View>
                        </View>
                        {/* <View style={{ marginTop: 10 }}>
                            <Typography>
                                {seller.user.addresses[0].streetAddress1}
                            </Typography>
                            <Typography>
                                {seller.user.addresses[0].city}, {seller.user.addresses[0].country.country}
                            </Typography>
                        </View> */}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SellerItem

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