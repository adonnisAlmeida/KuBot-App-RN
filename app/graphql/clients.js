import { gql } from '@apollo/client'

export const ORDERS_LIST_CLIENTS = gql`
	query Orders($carrier: Int) {
		orders(first: 100, carrier: $carrier) {
			edges {
				node {
					id
					user {
                        userName
                        id
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
		}
	}
`

export const ORDERS_LIST_SELLERS = gql`
	query Orders($carrier: Int) {
		orders(first: 100, carrier: $carrier) {
			edges {
				node {
					id
                    sellers{
                        user{
                            userName
                            id
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
			}
		}
	}
`