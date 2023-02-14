import {
    View, StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    RefreshControl,
} from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../../components'
import { useTheme } from '@react-navigation/native'
import ClientItem from './ClientItem'
import Colors from '../../../constants/Colors'

const ClientsList = ({ navigation, clients_list, doRefresh, refreshing }) => {
    const { colors } = useTheme()
    
    const onRefresh = () => {
		doRefresh()
	}

    return (
        <TouchableWithoutFeedback>
            <View style={{ flex: 1 }}>
                {clients_list.length === 0 ? (
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Typography color={colors.ON_BACKGROUND}>
                            No hay Clientes para mostrar
                        </Typography>
                    </View>
                ) : (
                    <View>
                        <FlatList
                            style={styles.constains}
                            showsVerticalScrollIndicator={false}
                            data={clients_list}
                            refreshControl={
								<RefreshControl
									colors={[Colors.COLORS.PRIMARY]}
									refreshing={refreshing}
									onRefresh={onRefresh}
								/>
							}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index, separators }) => (
                                <ClientItem
                                    client={item}
                                    navigation={navigation}
                                    key={index}
                                />
                            )}
                        />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ClientsList

const styles = StyleSheet.create({
    constains: {
        /* marginTop: -12,
        margin: 12,
        paddingVertical: 18, */
        paddingHorizontal: 18,
    },
})