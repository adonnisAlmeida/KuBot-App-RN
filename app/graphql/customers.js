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
	mutation accountAddressUpdate($id: ID!, $input: AddressInput! ) {
		accountAddressUpdate(id: $id, input: $input) {
			errors{
				field
				message
			}
			accountErrors{
				field
				message
				code
			}
			user{
				addresses{
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
					  code
					}
					countryArea
					phone
				}
			}
		}
	}
`

export const ADDRESS_CREATE = gql`
	mutation accountAddressCreate($input: AddressInput!, $type: AddressTypeEnum ) {
		accountAddressCreate(input: $input, type: $type) {
			errors{
				field
				message
			}
			accountErrors{
				field
				message
				code
			}
			user{
				addresses{
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
					  code
					}
					countryArea
					phone
				}
			}
		}
	}
`

export const ADDRESS_DELETE = gql`
	mutation accountAddressDelete($id: ID! ) {
		accountAddressDelete(id: $id) {
			errors{
				field
				message
			}
			accountErrors{
				field
				message
				code
			}
			user{
				addresses{
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
					  code
					}
					countryArea
					phone
				}
			}
		}
	}
`
