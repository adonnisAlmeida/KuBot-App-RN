import { gql } from '@apollo/client'

export const USER_ID = gql`
	query User($id: ID!) {
		user(id: $id) {
			id
			email
			firstName
			lastName
		}
	}
`
