import { gql } from '@apollo/client'

export const ACCEPT_ORDER = gql`
	mutation orderAcceptedCarrier($id: ID!) {
		orderAcceptedCarrier(id: $id) {
			order{
				shippingStatus
			}
			errors{
				field
				message
			}
		}
	}
`

export const ORDER_TRANSIT = gql`
	mutation orderInTransit($id: ID!) {
		orderInTransit(id: $id) {
			order{
				shippingStatus
			}
			errors{
				field
				message
			}
		}
	}
`

export const ORDER_LOST = gql`
	mutation orderLost($id: ID!) {
		orderLost(id: $id) {
			order{
				shippingStatus
			}
			errors{
				field
				message
			}
		}
	}
`

export const ORDER_DELIVERED = gql`
	mutation orderDelivered($id: ID!) {
		orderDelivered(id: $id) {
			order{
				shippingStatus
			}
			errors{
				field
				message
			}
		}
	}
`

export const SIGNATURE_IMAGES = gql`
mutation shipmentDeliveredSignatureImage($id: ID!, $images: [Upload!]) {
	shipmentDeliveredSignatureImage( id: $id, input: {images: $images} ) {
	  order {
		id
		signatureImagesDelivery {
		  image {
			url
		  }
		}
		packageImagesDelivery {
		  image {
			url
		  }
		}
	  }
	  errors {
		message
	  }
	}
  }
`

export const PACKAGE_IMAGES = gql`
mutation shipmentDeliveredPackageImage($id: ID!, $images: [Upload!]) {
	shipmentDeliveredPackageImage( id: $id, input: {images: $images} ) {
	  order {
		id
		signatureImagesDelivery {
		  image {
			url
		  }
		}
		packageImagesDelivery {
		  image {
			url
		  }
		}
	  }
	  errors {
		message
	  }
	}
  }
`

export const ORDERS_LIST = gql`
	query Orders($carrier: Int, $after: String!, $before: String!, $freeOrder: Boolean) {
		orders(first: 100, carrier: $carrier, after: $after, before: $before, freeOrder: $freeOrder) {
			edges {
				node {
					id
					number
					shippingStatus
					created
					status
					user {
						userName
						firstName
						lastName
					}
					shippingAddress{
						streetAddress1
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

export const ACCEPT_ORDERS_LIST = gql`
	query Orders($carrier: Int, $after: String!, $before: String!) {
		orders(first: 100, carrier: $carrier, after: $after, before: $before, freeOrder: true) {
			edges {
				node {
					id
					number
					shippingPrice{
						currency
						gross{
						  currency
						  amount
						}
						net{
						  currency
						  amount
						}
						tax{
						  currency
						  amount
						}
					}
					getDistance
					shippingAddress{
						city
						postalCode
						countryArea
						country{
						country
						code
						}
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

export const ACCEPT_ORDER_ID = gql`
	query Product($id: ID!) {
		order(id: $id) {
			id
			number
			created
			shippingPrice{
				currency
				gross{
				  currency
				  amount
				}
				net{
				  currency
				  amount
				}
				tax{
				  currency
				  amount
				}
			}
			getDistance
			allDimensions
			weight{
				unit
				value
			}
			shippingAddress{
				city
				postalCode
				countryArea
				country{
				country
				code
				}
			}
		}
	}
`

export const ORDER_ID = gql`
	query Product($id: ID!) {
		order(id: $id) {
			id
			status
			created
			shippingStatus
			allDimensions
			events{
				date
				message
				type
				user{
				  firstName
				}
			  }
			  signatureImagesDelivery {
				image {
				  url
				}
			  }
			  packageImagesDelivery {
				image {
				  url
				}
			  }
			shippingAddress{
				phone
				id
				streetAddress1
				streetAddress2
				city
				cityArea
				firstName
				lastName
				companyName
				postalCode
				country{
				  country
				  code
				}
			}
			lines {
				variant{
					name
				}
				quantity
				productName
				productSku
			}
			number
			sellers{
				user{
					userName
					avatar{
						url
						alt
					}
					firstName
					lastName
					addresses{
					  country {
							country
						}
						streetAddress1
						city
						postalCode
					}
				}
			} 
			customerNote
			weight{
				unit
				value
			}
			created
			status
			user {
				userName
				avatar{
					url
					alt
				}
				firstName
				lastName
				dateJoined
				addresses {
					country {
						country
					}
					streetAddress1
					city
					postalCode
				}
			}
		}
	}
`
