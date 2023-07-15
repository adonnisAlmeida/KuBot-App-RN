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

export const ORDER_REJECTED = gql`
mutation orderRejected($id: ID!, $input: ReasonRejectedInput!) {
	orderRejected(id: $id, input: $input) {
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

export const DELETE_SIGNATURE_IMAGE_REJECTION = gql`
mutation deleteSignatureImageRejection($id: ID!) {
	deleteSignatureImageRejection(id: $id) {
		errors{
			field
			message
		}
		orderErrors{
			field
			message
			code
		}
	}
}
`

export const DELETE_SIGNATURE_IMAGE_DELIVERED = gql`
mutation deleteSignatureImageDelivered($id: ID!) {
	deleteSignatureImageDelivered(id: $id) {
		errors{
			field
			message
		}
		orderErrors{
			field
			message
			code
		}
	}
}
`

export const DELETE_EVIDENCE_IMAGE_REJECTION = gql`
mutation deleteEvidenceImageRejection($id: ID!) {
	deleteEvidenceImageRejection(id: $id) {
		errors{
			field
			message
		}
		orderErrors{
			field
			message
			code
		}
	}
}
`
export const DELETE_PACKAGE_IMAGE_DELIVERED = gql`
mutation deletePackageImageDelivered($id: ID!) {
	deletePackageImageDelivered(id: $id) {
		errors{
			field
			message
		}
		orderErrors{
			field
			message
			code
		}
	}
}
`

export const SIGNATURE_REJECTED_IMAGES = gql`
mutation signatureImagesRejection($id: ID!, $images: [Upload!]) {
	signatureImagesRejection( id: $id, input: {images: $images} ) {
		order{
			rejectedOrder{
				id
				reason
				shipImg{
				  alt
				  id
				  image{
					url
					alt
				  }
				}
				signImg{
				  alt
				  id
				  image{
					url
					alt
				  }
				}
			}
		}
		orderErrors{
			field
			message
			code
		}
		errors {
			field
			message
		}
	}
}
`

export const EVIDENCE_REJECTED_IMAGES = gql`
mutation evidenceImagesRejection($id: ID!, $images: [Upload!]) {
	evidenceImagesRejection( id: $id, input: {images: $images} ) {
		order{
			rejectedOrder{
				id
				reason
				shipImg{
				  alt
				  id
				  image{
					url
					alt
				  }
				}
				signImg{
				  alt
				  id
				  image{
					url
					alt
				  }
				}
			}
		}
		orderErrors{
			field
			message
			code
		}
		errors {
			field
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
					defaultPickupAddress{
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
			defaultPickupAddress{
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
				id
				image {
				  url
				}
			  }
			  packageImagesDelivery {
				id
				image {
				  url
				}
			  }
			  rejectedOrder{
				id
				reason
				shipImg{
				  alt
				  id
				  image{
					url
					alt
				  }
				}
				signImg{
				  alt
				  id
				  image{
					url
					alt
				  }
				}
			  }
			  defaultPickupAddress{
				phone
				id
				streetAddress1
				streetAddress2
				city
				cityArea
				countryArea
				firstName
				lastName
				companyName
				postalCode
				country{
				  country
				  code
				}
			  }
			shippingAddress{
				phone
				id
				streetAddress1
				streetAddress2
				countryArea
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
					serverId
					userName
					avatar{
						url
						alt
					}
					firstName
					lastName
					dateJoined
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
				serverId
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
