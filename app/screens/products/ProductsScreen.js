import React from 'react'
import { useLazyQuery } from '@apollo/client'
import { TouchableOpacity, ScrollView, StyleSheet, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'

import Loading from '../../components/Loading'
import ProductList from './components/ProductList'
import { PRODUCTS_LIST } from '../../graphql/product'
import { useState } from 'react'
import { NetworkError } from '../../components'

export default function ProductsScreen({ navigation }) {
	const { colors } = useTheme()
	const [loadingApp, setLoadingApp] = useState(false)
	const [products, setProducts] = useState([])
	const [refreshing, setRefreshing] = useState(false)
	const [loadingScroll, setLoadingScroll] = useState(false)
	const [hasNextPage, setHasNextPage] = useState(false)
	const [endCursor, setEndCursor] = useState("")

	const [getListado, { loading, error, data }] = useLazyQuery(PRODUCTS_LIST, {
		onCompleted: (data) => {
			if (data.products.pageInfo.hasNextPage) {
				setHasNextPage(data.products.pageInfo.hasNextPage)
				setEndCursor(data.products.pageInfo.endCursor)
			} else {
				setHasNextPage(false)
			}
			if (loadingApp || refreshing) {
				let elementos = []
				data.products.edges.map((edges) => elementos.push(edges.node))
				setProducts(elementos)
			} else {
				let elementos = []
				data.products.edges.map((edges) => elementos.push(edges.node))
				setProducts([...products, ...elementos])
			}
			setLoadingApp(false)
			setRefreshing(false)
			setLoadingScroll(false)
		},
		onError: (error) => {
			setLoadingApp(false)
			setRefreshing(false)
			setLoadingScroll(false)
			console.log('Error Cargando productos >> ', error)
		},
		fetchPolicy: "no-cache"
	})

	React.useEffect(() => {
		setLoadingApp(true)
		getListado({ variables: { after: '', before: '' }, })
	}, [])

	const renderLoader = () => {
		return loadingScroll ? <Loading /> : null
	}

	const loadMore = () => {
		if (hasNextPage) {
			setLoadingScroll(true)
			console.log(`CARGA MAS DATOSSS con endCursor > ${endCursor}`)
			getListado({ variables: { after: endCursor, before: '' } })
		} else {
			console.log(`No hay datos para cargar`)
		}
	}

	const reloadApp = () => {
		setLoadingApp(true)
		getListado({ variables: { after: '', before: '' } })
	}

	const doRefresh = () => {
		setRefreshing(true)
		getListado({ variables: { after: '', before: '' } })
	}
/* 
	setTimeout(() => {
		if (loadingApp) setLoadingApp(false)
	}, 2000) */

	if (loadingApp) return <Loading />

	navigation.setOptions({
		title: `Productos`,
	})

	return (
		<View style={{ flex: 1 }}>
			{error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				(
					<View>
						<ProductList
							navigation={navigation}
							list={products}
							doRefresh={doRefresh}
							loadMore={loadMore}
							renderLoader={renderLoader}
							refreshing={refreshing}
						/>
					</View>
				)
			}
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		padding: 18,
		borderRadius: 50,
		position: 'absolute',
		elevation: 12,
	},
})
