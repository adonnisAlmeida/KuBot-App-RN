import { gql } from '@apollo/client'

export const ACCOUNT_UPDATE = gql`
	mutation AccountUpdate($firstName: String!, $lastName: String!) {
		accountUpdate( input: {firstName: $firstName, lastName: $lastName }) {
			errors{
				field
				message
			}
			accountErrors{
				field
				message
				code
			}
			user {
				id
				firstName
				lastName
			}
		}
	}
`

export const USER_AVATAR_UPDATE = gql`
	mutation userAvatarUpdate($image: Upload!) {
		userAvatarUpdate(image: $image) {
			user {
				avatar {
					url
					alt
				}
			}
		}
	}
`

export const CUSTOMER_DELETE = gql`
	mutation customerDelete($id: String!) {
		customerDelete(id: $id) {
			user {
				id
				email
				firstName
				lastName
			}
		}
	}
`

export const ADDRESS_UPDATE = gql`
	mutation addressUpdate($id: ID!, $input: AddressInput! ) {
		addressUpdate(id: $id, input: $input) {
			address {
				id
					companyName
					isDefaultBillingAddress
					isDefaultShippingAddress
					streetAddress1
					firstName
					lastName
					streetAddress2
					city
					cityArea
					postalCode
					country{
					  country
					}
					countryArea
					phone
			}
		}
	}
`
