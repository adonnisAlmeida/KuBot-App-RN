import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import Colors from '../../../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useState } from 'react';

const UserItem = ({ user, mySelectedItems, toggleSelected }) => {
    const [isSelected, setIsSelected] = useState(false)

    const showNombre = () => {
        if (user.firstName && user.firstName.length > 0) {
            return user.firstName + ' ' + user.lastName
        } else {
            return user.userName
        }
    }

    const selected = () => {
        if (mySelectedItems.includes(user.serverId)) {
            return (
                <View style={{
                    position: 'absolute',
                    backgroundColor: '#fff',
                    padding: 0.1,
                    borderRadius: 100,
                    bottom: -2,
                    left: 23
                }}>
                    <MaterialCommunityIcons
                        name="check-circle"
                        color={Colors.COLORS.PRIMARY}
                        size={20}
                    />
                </View>
            )
        }
    }

    const avatar =
        user.avatar ?
            {
                uri: user.avatar.url,
            }
            : require('../../../../assets/user_avatar.png')

    return (
        <View style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: mySelectedItems.includes(user.serverId)? 'rgba(0,0,0,0.05)' : 'transparent'
        }}>
            <TouchableOpacity
                onPress={() => toggleSelected(user)}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Image
                        imageStyle={{
                            position: 'relative',
                            width: 42,
                            height: 42,
                            borderRadius: 62,
                            borderWidth: 0,
                            marginRight: 10,
                            //marginBottom: 10,
                        }}
                        source={avatar}
                        indicator={Progress.Pie}
                        indicatorProps={{
                            color: Colors.COLORS.PRIMARY,
                            borderWidth: 0,
                        }}
                    />
                    <Typography bold style={{
                        color: Colors.COLORS.ON_SURFACE
                    }}>{showNombre()}</Typography>
                    {selected()}
                </View>
            </TouchableOpacity >
        </View >
    )
}

export default UserItem