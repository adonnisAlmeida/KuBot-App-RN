import { gql } from '@apollo/client'

export const PRODUCT_TYPES = gql`
	query productTypes {
		productTypes(first: 10) {
			edges {
				node {
					name
					products {
						totalCount
					}
				}
			}
		}
	}
`

export const PRODUCTS_LIST = gql`
	query Products($after: String!, $before: String!) {
		products(first: 15, after: $after, before: $before) {
			edges {
				node {
					id
					name
					description
					images {
						url(size: 100)
					}
				}
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`

export const PRODUCTO_ID = gql`
	query Product($id: ID!) {
		product(id: $id) {
			id
			name
			description
			url
			category {
				name
			}
			productType {
				name
				isDigital
			}
			images {
				url
			}
			pricing {
				priceRange {
					start {
						currency
						gross {
							amount
						}
					}
				}
			}
		}
	}
`
