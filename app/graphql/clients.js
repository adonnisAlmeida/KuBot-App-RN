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
export const MY_CLIENTS = gql`
    query myClients($after: String!, $before: String!){
        myClients(first: 20, after: $after, before: $before){
            edges{
                node{
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
            pageInfo{
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`

export const MY_SELLERS = gql`
    query mySellers($after: String!, $before: String!){
        mySellers(first: 20, after: $after, before: $before){
            edges{
                node{
                    serverId
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
                          serverId
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
            pageInfo{
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
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