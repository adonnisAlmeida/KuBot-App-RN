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
                        serverId
                        avatar{
                            url
                            alt
                        }
                        firstName
                        lastName
                        dateJoined
                        addresses {
                            id
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
                        defaultAddress{
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
                        reviews{
                            createdAt
                            user{
                              firstName
                              lastName
                              userName
                              avatar{
                                url
                                alt
                              }
                            }
                            title
                            message
                            rating
                            approvalStatus
                            option{
                              name
                              description
                              serverId
                            }
                            order{
                              number
                            }
                        }
                        user{
                            userName
                            id
                            serverId
                            avatar{
                                url
                                alt
                            }
                            firstName
                            lastName
                            dateJoined
                            addresses {
                                id
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