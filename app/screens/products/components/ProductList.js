import React from 'react'
import { StyleSheet, ScrollView, FlatList, RefreshControl, View } from 'react-native'
import { useTheme } from '@react-navigation/native'

import ProductItem from './ProductItem'
import { useState } from 'react'
import Colors from '../../../constants/Colors'

export default function ProductList({ navigation, list, doRefresh, loadMore, renderLoader, refreshing }) {
	const { colors } = useTheme()

	const onRefresh = () => {
		doRefresh()
	}

	return (
		<View>
			<FlatList
				style={styles.constains}
				showsVerticalScrollIndicator={true}
				data={list}
				ListFooterComponent={renderLoader}
				onEndReached={loadMore}
				onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl
						colors={[Colors.COLORS.PRIMARY]}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
				keyExtractor={item => item.id}
				renderItem={({ item, index, separators }) => (
					<ProductItem product={item} navigation={navigation} key={index} />
				)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	constains: {
		/* marginTop: -12,
		margin: 12,
		paddingVertical: 18, */
		paddingHorizontal: 18,
	},
})
