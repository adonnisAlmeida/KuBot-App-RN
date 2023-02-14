import { gql } from '@apollo/client'

export const CUSTOMER_UPDATE = gql`
	mutation CustomerUpdate($id: ID!, $firstName: String!, $lastName: String!) {
		customerUpdate(
			id: $id
			input: { firstName: $firstName, lastName: $lastName }
		) {
			user {
				id
				firstName
				lastName
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
