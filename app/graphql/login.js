import { gql } from '@apollo/client'

export const TOKEN_CREATE = gql`
	mutation TokenCreate($email: String!, $password: String!) {
		tokenCreate(email: $email, password: $password) {
			token
			user {
				id
				isCarrier
				isStaff
        		isSeller
				serverId
				firstName
				lastName
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
					}
					countryArea
					phone
				}
				avatar {
					url
					alt
				}
				email
			}
			errors {
				field
				message
			}
		}
	}
`

export const ACCOUNT_REGISTER = gql`
	mutation AccountRegister($email: String!, $password: String!) {
		accountRegister(input: { email: $email, password: $password }) {
			accountErrors {
				field
				code
			}
			user {
				firstName
        		lastName
			}
		}
	}
`

export const CARRIER_REGISTER = gql`
	mutation carrierRegister($input: CarrierCreateInput!) {
		carrierRegister(input: $input) {
			errors{
				field
				message
			}
			carrierErrors{
				field
				message
				code
			}
			carrier{
				isActive
				serverId
			}
		}
	}
`

export const GET_CARRIER_BY_USER_EMAIL = gql`
	query CarrierByUserEmail($userEmail: String!) {
		carriers(first: 1, userEmail: $userEmail) {
			edges {
				node {
					id
					kyc
					isActive
					serverId
					piPhotoFrontal{
						image{
						  url
						}
					}
					piPhotoBack{
						image{
						  url
						}
					}
					bustPhoto{
						image{
						  url
						}
					}
				}
			}
		}
	}
`
