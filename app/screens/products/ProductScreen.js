import React from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { useQuery } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import Loading from '../../components/Loading'
import { PRODUCTO_ID } from '../../graphql/product'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

export default function ProductScreen({ route, navigation, ...props }) {
	const { colors } = useTheme()

	let product_id = route.params?.id
	const { loading, error, data } = useQuery(PRODUCTO_ID, {
		variables: { id: product_id },
	})

	if (loading || error) return <Loading />

	navigation.setOptions({
		title: `${data.product.name}`,
	})

	console.log({ data })

	const avatar = {
		uri: data.product.images[0].url,
	}

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
			<Image
				source={avatar}
				imageStyle={styles.avatar}
				indicator={Progress.Pie}
				indicatorProps={{
					color: colors.PRIMARY,
					borderWidth: 0,
				}}
			/>
			<Text style={{ color: colors.ON_BACKGROUND, marginVertical: 10 }}>
				Información
			</Text>
			<View style={[styles.card, { backgroundColor: colors.SURFACE }]}>
				<Text
					style={{
						color: colors.ON_SURFACE,
						fontSize: 15,
						fontWeight: 'bold',
						marginBottom: 5,
					}}
				>
					Descripción
				</Text>
				<Text style={{ color: colors.ON_SURFACE }}>
					{data.product.description}
				</Text>
			</View>
			<View style={[styles.card, { backgroundColor: colors.SURFACE }]}>
				<Text
					style={{
						color: colors.ON_SURFACE,
						fontSize: 15,
						fontWeight: 'bold',
						marginBottom: 5,
					}}
				>
					Precio
				</Text>
				<Text style={{ color: colors.ON_SURFACE }}>
					{data.product.pricing.priceRange.start.gross.amount}{' '}
					{data.product.pricing.priceRange.start.currency}
				</Text>
			</View>
			<View style={[styles.card, { backgroundColor: colors.SURFACE }]}>
				<Text
					style={{
						color: colors.ON_SURFACE,
						fontSize: 15,
						fontWeight: 'bold',
						marginBottom: 5,
					}}
				>
					Categoría
				</Text>
				<Text style={{ color: colors.ON_SURFACE }}>
					{data.product.category.name}
				</Text>
			</View>
			<View style={[styles.card, { backgroundColor: colors.SURFACE, marginBottom: 30 }]}>
				<Text
					style={{
						color: colors.ON_SURFACE,
						fontSize: 15,
						fontWeight: 'bold',
						marginBottom: 5,
					}}
				>
					Tipo de Producto
				</Text>
				<Text style={{ color: colors.ON_SURFACE }}>
					{data.product.productType.name}
				</Text>
				<Text style={{ color: colors.ON_SURFACE }}>
					Digital: {data.product.productType.isDigital ? 'Si' : 'No'}
				</Text>
			</View>
			<View>

			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	card: {
		flexDirection: 'column',
		borderColor: 'transparent',
		borderRadius: 8,
		marginVertical: 5,
		padding: 18,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 1.5 },
		shadowRadius: 8,
	},
	avatar: {
		position: 'relative',
		alignSelf: 'center',
		width: 124,
		height: 124,
		borderRadius: 50,
		borderWidth: 0,
	},
})
