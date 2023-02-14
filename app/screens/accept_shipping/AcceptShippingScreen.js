import { View, Text } from 'react-native'
import React from 'react'
import { Loading, NetworkError } from '../../components'
import AcceptShippingList from './components/AcceptShippingList'
import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ORDERS_LIST } from '../../graphql/orders'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setAcceptShipping } from '../../redux/accept_shipping/accept_shippingSlice'

const test_orders = [
    {
        "node": {
            "id": "T3JkZXI6MzM4",
            "number": "338",
            "statusDisplay": "No completada",
            "weight": {
                "unit": "kg",
                "value": 3.5
            },
            "isPaid": false,
            "created": "2022-12-21T17:33:28.864122+00:00",
            "shippingAddress": {
                "streetAddress1": "786 Amanda Coves",
                "phone": "",
                "id": "QWRkcmVzczoyNTQ=",
                "streetAddress2": "",
                "city": "Suarezview",
                "cityArea": "",
                "firstName": "Marilyn",
                "lastName": "Villarreal",
                "companyName": "",
                "postalCode": "03921",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-12-21T17:33:29.241287+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-12-21T17:33:29.243246+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjox",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar2.png",
                        "alt": null
                    },
                    "email": "seller0@example.com",
                    "firstName": "seller0",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:40.957559+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjoxMzY=",
                "firstName": "Marilyn",
                "lastName": "Villarreal",
                "email": "marilyn.villarreal@example.com",
                "dateJoined": "2022-10-12T17:14:43.025965+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "786 Amanda Coves",
                        "city": "Suarezview",
                        "postalCode": "03921"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6Mjk1",
            "number": "295",
            "statusDisplay": "Completada",
            "weight": {
                "unit": "kg",
                "value": 2
            },
            "isPaid": true,
            "created": "2022-11-30T13:19:50.310950+00:00",
            "shippingAddress": {
                "streetAddress1": "700 Kevin Dale",
                "phone": "",
                "id": "QWRkcmVzczo1OTI=",
                "streetAddress2": "",
                "city": "SANTA CLARA",
                "cityArea": "",
                "firstName": "Linda",
                "lastName": "Walker",
                "companyName": "",
                "postalCode": "76260",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-11-30T13:19:50.321683+00:00",
                    "message": null,
                    "type": "PLACED",
                    "user": {
                        "firstName": "carrier0"
                    }
                },
                {
                    "date": "2022-11-30T13:19:51.761251+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": {
                        "firstName": "carrier0"
                    }
                },
                {
                    "date": "2022-11-30T13:22:41.870810+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-11-30T13:22:41.874204+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-11-30T13:24:02.964180+00:00",
                    "message": null,
                    "type": "FULFILLMENT_FULFILLED_ITEMS",
                    "user": {
                        "firstName": ""
                    }
                },
                {
                    "date": "2022-11-30T13:24:03.008411+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": {
                        "firstName": ""
                    }
                },
                {
                    "date": "2022-11-30T13:46:28.104460+00:00",
                    "message": null,
                    "type": "ACCEPTED_CARRIER",
                    "user": null
                },
                {
                    "date": "2022-11-30T13:46:29.329069+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-11-30T13:54:42.723673+00:00",
                    "message": "be careful",
                    "type": "NOTE_ADDED",
                    "user": {
                        "firstName": ""
                    }
                },
                {
                    "date": "2022-12-01T00:26:52.499618+00:00",
                    "message": null,
                    "type": "PICKED_UP_CARRIER",
                    "user": null
                },
                {
                    "date": "2022-12-01T00:26:54.451772+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-12-01T00:29:12.597549+00:00",
                    "message": null,
                    "type": "IN_TRANSIT",
                    "user": null
                },
                {
                    "date": "2022-12-01T00:29:13.634075+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-12-01T00:29:40.810658+00:00",
                    "message": null,
                    "type": "DELIVERED",
                    "user": null
                },
                {
                    "date": "2022-12-01T00:29:41.827672+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": {
                        "firstName": "carrier0"
                    }
                }
            ],
            "customerNote": "alert",
            "sellers": [
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": {
                    "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar6.png",
                    "alt": null
                },
                "id": "VXNlcjoyNA==",
                "firstName": "carrier0",
                "lastName": "",
                "email": "carrier0@example.com",
                "dateJoined": "2022-09-23T03:01:58.020727+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "700 Kevin Dale",
                        "city": "SANTA CLARA",
                        "postalCode": "76260"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "1889 Castro Square Apt. 557",
                        "city": "Christopherland",
                        "postalCode": "07629"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "7199 Sonya Bridge Suite 289",
                        "city": "Karenborough",
                        "postalCode": "67486"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "6196 Wheeler Manor",
                        "city": "New Madisonchester",
                        "postalCode": "69291"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "64098 Jennifer Fords Apt. 429",
                        "city": "Kimshire",
                        "postalCode": "06944"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "4157 Maria Burg Apt. 966",
                        "city": "Katherineland",
                        "postalCode": "90663"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "31885 James Stream Apt. 119",
                        "city": "Port Kellimouth",
                        "postalCode": "63220"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "801 James Views Suite 791",
                        "city": "Matthewchester",
                        "postalCode": "08459"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "245 Christopher Turnpike Suite 025",
                        "city": "New Samantha",
                        "postalCode": "94355"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "6420 Williams Crossing",
                        "city": "Johnsonfort",
                        "postalCode": "14822"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "9598 Johnny Island",
                        "city": "West Elaineland",
                        "postalCode": "10046"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "041 Wells View",
                        "city": "Watsonmouth",
                        "postalCode": "93264"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "453 Brown Roads Suite 995",
                        "city": "New Tiffanychester",
                        "postalCode": "84282"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "9145 Evans Garden Apt. 465",
                        "city": "Clarenceberg",
                        "postalCode": "55527"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "26274 Robert Mews",
                        "city": "Hillville",
                        "postalCode": "78807"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "4782 Rose Hills Apt. 485",
                        "city": "Jenniferbury",
                        "postalCode": "24507"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "8134 Harrison Harbors",
                        "city": "Crystalberg",
                        "postalCode": "83439"
                    },
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "627 Amanda Summit Suite 878",
                        "city": "South Timothy",
                        "postalCode": "28713"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6MjI2",
            "number": "226",
            "statusDisplay": "Completada",
            "weight": {
                "unit": "kg",
                "value": 1
            },
            "isPaid": false,
            "created": "2022-11-10T14:20:37.284452+00:00",
            "shippingAddress": {
                "streetAddress1": "578 Thompson Oval",
                "phone": "",
                "id": "QWRkcmVzczo5Mw==",
                "streetAddress2": "",
                "city": "SANTA CLARA",
                "cityArea": "",
                "firstName": "Victoria",
                "lastName": "Alexander",
                "companyName": "",
                "postalCode": "50463",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-11-11T23:22:37.944666+00:00",
                    "message": null,
                    "type": "FULFILLMENT_FULFILLED_ITEMS",
                    "user": {
                        "firstName": "Victoria"
                    }
                },
                {
                    "date": "2022-11-11T23:22:38.022695+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:38.028964+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:38.060054+00:00",
                    "message": null,
                    "type": "ACCEPTED_CARRIER",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:42.279528+00:00",
                    "message": null,
                    "type": "PICKED_UP_CARRIER",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:42.508407+00:00",
                    "message": null,
                    "type": "IN_TRANSIT",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:42.722582+00:00",
                    "message": null,
                    "type": "DELIVERED",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjo2MQ==",
                "firstName": "Victoria",
                "lastName": "Alexander",
                "email": "victoria.alexander@example.com",
                "dateJoined": "2022-09-27T23:35:36.028956+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "578 Thompson Oval",
                        "city": "SANTA CLARA",
                        "postalCode": "50463"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6MjA4",
            "number": "208",
            "statusDisplay": "No completada",
            "weight": {
                "unit": "kg",
                "value": 3
            },
            "isPaid": false,
            "created": "2022-11-10T14:16:49.434842+00:00",
            "shippingAddress": {
                "streetAddress1": "730 James Forks Apt. 995",
                "phone": "",
                "id": "QWRkcmVzczo0MjU=",
                "streetAddress2": "",
                "city": "Thomaschester",
                "cityArea": "",
                "firstName": "Robert",
                "lastName": "Middleton",
                "companyName": "",
                "postalCode": "25439",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-11-10T14:16:49.878560+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-11-10T14:16:49.881975+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": null
        }
    },
    {
        "node": {
            "id": "T3JkZXI6MTky",
            "number": "192",
            "statusDisplay": "Parcialmente completada",
            "weight": {
                "unit": "kg",
                "value": 6.5
            },
            "isPaid": false,
            "created": "2022-11-10T02:40:50.318944+00:00",
            "shippingAddress": {
                "streetAddress1": "74618 Christopher Brook",
                "phone": "",
                "id": "QWRkcmVzczozODE=",
                "streetAddress2": "",
                "city": "SANTA CLARA",
                "cityArea": "",
                "firstName": "Dana",
                "lastName": "Welch",
                "companyName": "",
                "postalCode": "53715",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-11-10T02:40:50.730141+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-11-10T02:40:50.732465+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjox",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar2.png",
                        "alt": null
                    },
                    "email": "seller0@example.com",
                    "firstName": "seller0",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:40.957559+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjox",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar2.png",
                        "alt": null
                    },
                    "email": "seller0@example.com",
                    "firstName": "seller0",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:40.957559+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjoyMDk=",
                "firstName": "Dana",
                "lastName": "Welch",
                "email": "dana.welch@example.com",
                "dateJoined": "2022-11-10T02:40:45.640893+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "74618 Christopher Brook",
                        "city": "SANTA CLARA",
                        "postalCode": "53715"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6MTU1",
            "number": "155",
            "statusDisplay": "Completada",
            "weight": {
                "unit": "kg",
                "value": 4
            },
            "isPaid": true,
            "created": "2022-10-26T18:28:17.787968+00:00",
            "shippingAddress": {
                "streetAddress1": "259 Smith Viaduct Suite 058",
                "phone": "",
                "id": "QWRkcmVzczozMDk=",
                "streetAddress2": "",
                "city": "SANTA CLARA",
                "cityArea": "",
                "firstName": "William",
                "lastName": "Miller",
                "companyName": "",
                "postalCode": "80354",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-10-26T18:28:18.057527+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-10-26T18:28:18.060112+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-11-10T14:17:39.304526+00:00",
                    "message": null,
                    "type": "FULFILLMENT_FULFILLED_ITEMS",
                    "user": null
                },
                {
                    "date": "2022-11-10T14:17:39.354812+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-11-10T14:17:39.406928+00:00",
                    "message": null,
                    "type": "ACCEPTED_CARRIER",
                    "user": null
                },
                {
                    "date": "2022-11-10T14:17:41.019707+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:38.982104+00:00",
                    "message": null,
                    "type": "ACCEPTED_CARRIER",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:42.352297+00:00",
                    "message": null,
                    "type": "PICKED_UP_CARRIER",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:42.580526+00:00",
                    "message": null,
                    "type": "IN_TRANSIT",
                    "user": null
                },
                {
                    "date": "2022-11-11T23:22:42.785705+00:00",
                    "message": null,
                    "type": "DELIVERED",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjox",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar2.png",
                        "alt": null
                    },
                    "email": "seller0@example.com",
                    "firstName": "seller0",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:40.957559+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": null
        }
    },
    {
        "node": {
            "id": "T3JkZXI6OTA=",
            "number": "90",
            "statusDisplay": "No completada",
            "weight": {
                "unit": "kg",
                "value": 2
            },
            "isPaid": true,
            "created": "2022-09-27T23:49:46.185724+00:00",
            "shippingAddress": {
                "streetAddress1": "24736 Medina Well",
                "phone": "",
                "id": "QWRkcmVzczo1OQ==",
                "streetAddress2": "",
                "city": "East Sarahland",
                "cityArea": "",
                "firstName": "Robert",
                "lastName": "Watson",
                "companyName": "",
                "postalCode": "22726",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-09-27T23:49:46.317502+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-09-27T23:49:46.319481+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjox",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar2.png",
                        "alt": null
                    },
                    "email": "seller0@example.com",
                    "firstName": "seller0",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:40.957559+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjo0OA==",
                "firstName": "Robert",
                "lastName": "Watson",
                "email": "robert.watson@example.com",
                "dateJoined": "2022-09-27T14:56:03.272796+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "24736 Medina Well",
                        "city": "East Sarahland",
                        "postalCode": "22726"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6ODU=",
            "number": "85",
            "statusDisplay": "No completada",
            "weight": {
                "unit": "kg",
                "value": 4.5
            },
            "isPaid": true,
            "created": "2022-09-27T23:49:44.865502+00:00",
            "shippingAddress": {
                "streetAddress1": "90876 Monica Haven",
                "phone": "",
                "id": "QWRkcmVzczoxODc=",
                "streetAddress2": "",
                "city": "Anthonymouth",
                "cityArea": "",
                "firstName": "Andrea",
                "lastName": "Brown",
                "companyName": "",
                "postalCode": "38579",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-09-27T23:49:45.133233+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-09-27T23:49:45.137598+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": null
        }
    },
    {
        "node": {
            "id": "T3JkZXI6NjY=",
            "number": "66",
            "statusDisplay": "No completada",
            "weight": {
                "unit": "kg",
                "value": 1
            },
            "isPaid": false,
            "created": "2022-09-27T23:36:01.008928+00:00",
            "shippingAddress": {
                "streetAddress1": "319 Matthew Lane Apt. 374",
                "phone": "",
                "id": "QWRkcmVzczoxNDk=",
                "streetAddress2": "",
                "city": "West Billstad",
                "cityArea": "",
                "firstName": "Debra",
                "lastName": "Graham",
                "companyName": "",
                "postalCode": "24319",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": null
        }
    },
    {
        "node": {
            "id": "T3JkZXI6NjA=",
            "number": "60",
            "statusDisplay": "No completada",
            "weight": {
                "unit": "kg",
                "value": 2
            },
            "isPaid": false,
            "created": "2022-09-27T23:35:41.068865+00:00",
            "shippingAddress": {
                "streetAddress1": "4401 Luis Grove Suite 290",
                "phone": "",
                "id": "QWRkcmVzczoxMw==",
                "streetAddress2": "",
                "city": "Morrisstad",
                "cityArea": "",
                "firstName": "Lisa",
                "lastName": "Adams",
                "companyName": "",
                "postalCode": "38611",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjoxMg==",
                "firstName": "Lisa",
                "lastName": "Adams",
                "email": "lisa.adams@example.com",
                "dateJoined": "2022-09-23T03:01:53.191327+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "4401 Luis Grove Suite 290",
                        "city": "Morrisstad",
                        "postalCode": "38611"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6NTE=",
            "number": "51",
            "statusDisplay": "Parcialmente completada",
            "weight": {
                "unit": "kg",
                "value": 2
            },
            "isPaid": false,
            "created": "2022-09-27T23:35:39.162804+00:00",
            "shippingAddress": {
                "streetAddress1": "9588 Jessica Key",
                "phone": "",
                "id": "QWRkcmVzczo1MA==",
                "streetAddress2": "",
                "city": "East Paul",
                "cityArea": "",
                "firstName": "Deborah",
                "lastName": "Smith",
                "companyName": "",
                "postalCode": "41590",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjox",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar2.png",
                        "alt": null
                    },
                    "email": "seller0@example.com",
                    "firstName": "seller0",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:40.957559+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjozOQ==",
                "firstName": "Deborah",
                "lastName": "Smith",
                "email": "deborah.smith@example.com",
                "dateJoined": "2022-09-27T14:56:01.891766+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "9588 Jessica Key",
                        "city": "East Paul",
                        "postalCode": "41590"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6NTA=",
            "number": "50",
            "statusDisplay": "Parcialmente completada",
            "weight": {
                "unit": "kg",
                "value": 3
            },
            "isPaid": false,
            "created": "2022-09-27T23:35:38.945694+00:00",
            "shippingAddress": {
                "streetAddress1": "286 Wanda Village Apt. 656",
                "phone": "",
                "id": "QWRkcmVzczoxMDc=",
                "streetAddress2": "",
                "city": "East Stephanie",
                "cityArea": "",
                "firstName": "Sarah",
                "lastName": "Miller",
                "companyName": "",
                "postalCode": "76378",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": null
        }
    },
    {
        "node": {
            "id": "T3JkZXI6MjE=",
            "number": "21",
            "statusDisplay": "Parcialmente completada",
            "weight": {
                "unit": "kg",
                "value": 2.5
            },
            "isPaid": true,
            "created": "2022-09-27T14:56:03.538220+00:00",
            "shippingAddress": {
                "streetAddress1": "0526 Rose Path Apt. 166",
                "phone": "",
                "id": "QWRkcmVzczoyMA==",
                "streetAddress2": "",
                "city": "SANTA CLARA",
                "cityArea": "",
                "firstName": "Jeremy",
                "lastName": "Smith",
                "companyName": "",
                "postalCode": "04862",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [
                {
                    "date": "2022-09-27T14:56:03.670278+00:00",
                    "message": null,
                    "type": "ORDER_FULLY_PAID",
                    "user": null
                },
                {
                    "date": "2022-09-27T14:56:03.672444+00:00",
                    "message": null,
                    "type": "EMAIL_SENT",
                    "user": null
                }
            ],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjox",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar2.png",
                        "alt": null
                    },
                    "email": "seller0@example.com",
                    "firstName": "seller0",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:40.957559+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjoxOQ==",
                "firstName": "Jeremy",
                "lastName": "Smith",
                "email": "jeremy.smith@example.com",
                "dateJoined": "2022-09-23T03:01:54.146740+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "0526 Rose Path Apt. 166",
                        "city": "SANTA CLARA",
                        "postalCode": "04862"
                    }
                ]
            }
        }
    },
    {
        "node": {
            "id": "T3JkZXI6Mg==",
            "number": "2",
            "statusDisplay": "No completada",
            "weight": {
                "unit": "kg",
                "value": 2
            },
            "isPaid": false,
            "created": "2022-09-23T03:01:54.960089+00:00",
            "shippingAddress": {
                "streetAddress1": "986 Blackburn Harbor",
                "phone": "",
                "id": "QWRkcmVzczo1",
                "streetAddress2": "",
                "city": "South Crystalmouth",
                "cityArea": "",
                "firstName": "Richard",
                "lastName": "Jackson",
                "companyName": "",
                "postalCode": "66666",
                "country": {
                    "country": "Cuba",
                    "code": "CU"
                }
            },
            "events": [],
            "customerNote": "",
            "sellers": [
                {
                    "id": "VXNlcjoy",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar7.png",
                        "alt": null
                    },
                    "email": "seller1@example.com",
                    "firstName": "seller1",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:41.927156+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "North Brandonville",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                },
                {
                    "id": "VXNlcjoz",
                    "avatar": {
                        "url": "https://saleor-app-bucket.s3.amazonaws.com/static/user-avatars/avatar8.png",
                        "alt": null
                    },
                    "email": "seller2@example.com",
                    "firstName": "seller2",
                    "lastName": "",
                    "dateJoined": "2022-09-23T03:01:42.273930+00:00",
                    "addresses": [
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "885 Amy Valley",
                            "city": "SANTA CLARA",
                            "postalCode": "53304"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "56223 Washington Throughway Apt. 346",
                            "city": "Erichaven",
                            "postalCode": "07961"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "20206 Hernandez Square",
                            "city": "Richmouth",
                            "postalCode": "42478"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "594 Michael Mews",
                            "city": "Evanland",
                            "postalCode": "24291"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "09197 Brown Isle Suite 728",
                            "city": "Leonardton",
                            "postalCode": "87480"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "70006 Jason Fields",
                            "city": "Carterhaven",
                            "postalCode": "81520"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "590 Smith Parkways",
                            "city": "New Jesse",
                            "postalCode": "45111"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3112 Watts Loop Suite 263",
                            "city": "Lake Janetburgh",
                            "postalCode": "81229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3386 Cheryl Gardens",
                            "city": "North Wanda",
                            "postalCode": "06726"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "6910 Cynthia Parkway",
                            "city": "Christopherland",
                            "postalCode": "13519"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "5662 Ruiz Shoal",
                            "city": "Gonzalezport",
                            "postalCode": "86844"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "3129 Melissa Creek",
                            "city": "North Jefferymouth",
                            "postalCode": "23897"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "9351 Elizabeth Union Apt. 339",
                            "city": "New Amanda",
                            "postalCode": "03431"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "1864 Jessica Wall Apt. 909",
                            "city": "Shermanport",
                            "postalCode": "71229"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "26479 Jacob Ferry Apt. 321",
                            "city": "North Andrea",
                            "postalCode": "78411"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "957 Everett Camp",
                            "city": "Lake Destinystad",
                            "postalCode": "88079"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "193 Clark Plain Suite 753",
                            "city": "East Duaneport",
                            "postalCode": "85649"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "724 Parker Junctions Suite 701",
                            "city": "Murphystad",
                            "postalCode": "01261"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "895 Gregory Curve",
                            "city": "Ashleyborough",
                            "postalCode": "55284"
                        },
                        {
                            "country": {
                                "country": "Cuba"
                            },
                            "streetAddress1": "69667 Amy Gateway",
                            "city": "North Seanfort",
                            "postalCode": "66410"
                        }
                    ]
                }
            ],
            "user": {
                "avatar": null,
                "id": "VXNlcjo0",
                "firstName": "Richard",
                "lastName": "Jackson",
                "email": "richard.jackson@example.com",
                "dateJoined": "2022-09-23T03:01:51.175079+00:00",
                "addresses": [
                    {
                        "country": {
                            "country": "Cuba"
                        },
                        "streetAddress1": "986 Blackburn Harbor",
                        "city": "South Crystalmouth",
                        "postalCode": "66666"
                    }
                ]
            }
        }
    }
]

const AcceptShippingScreen = ({ route, navigation }) => {
    let reload = route.params?.reload
    const [loadingApp, setLoadingApp] = useState(false)
    const [orders, setOrders] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [loadingScroll, setLoadingScroll] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [endCursor, setEndCursor] = useState("")
    const dispatch = useDispatch()
    const userStore = useSelector(state => state.userlogin)
    const acceptShippingStore = useSelector(state =>state.accepShipping)
    const carrierID = userStore.carrierInfo.serverId;

    const [getOrdersList, { loading, error, data }] = useLazyQuery(ORDERS_LIST, {
        onCompleted: (data) => {
            if (data.orders.pageInfo.hasNextPage) {
                setHasNextPage(data.orders.pageInfo.hasNextPage)
                setEndCursor(data.orders.pageInfo.endCursor)
            } else {
                setHasNextPage(false)
            }
            if (loadingApp || refreshing) {
                let elementos = []
                data.orders.edges.map((edges) => elementos.push(edges.node))
                //setOrders(elementos)
                dispatch(setAcceptShipping(elementos))
            } else {
                let elementos = []
                data.orders.edges.map((edges) => elementos.push(edges.node))
                //setOrders([...orders, ...elementos])
                dispatch(setAcceptShipping(elementos))
            }
            /* let elementos = []
            data.orders.edges.map((edges) => elementos.push(edges.node))
            setMyOrders(elementos) */
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)

        },
        onError: () => {
            console.log('ERROR cargando ordenes >> ', error)
            console.log('ERROR cargando ordenes data var >> ', data)
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        setLoadingApp(true)
        getOrdersList({ variables: { /* carrier: carrierID, */ after: '', before: '', freeOrder: true } })
    }, [])

    useEffect(() => {
        setOrders(acceptShippingStore.listado)
    }, [acceptShippingStore.listado])

    const renderLoader = () => {
        return loadingScroll ? <Loading /> : null
    }

    const loadMore = () => {
        if (hasNextPage) {
            setLoadingScroll(true)
            getOrdersList({ variables: { /* carrier: carrierID, */  after: endCursor, before: '', freeOrder: true } })
        } else {
            console.log(`No hay datos para cargar`)
        }
    }

    const reloadApp = () => {
        setLoadingApp(true)
        getOrdersList({ variables: { /* carrier: carrierID, */ after: '', before: '', freeOrder: true } })
    }

    const doRefresh = () => {
        setRefreshing(true)
        getOrdersList({ variables: { /* carrier: carrierID, */ after: '', before: '', freeOrder: true } })
    }

    if (loadingApp) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            {error ?
                (
                    <NetworkError accion={reloadApp} />
                ) :
                (
                    <AcceptShippingList
                        navigation={navigation}
                        orders_list={orders}
                        doRefresh={doRefresh}
                        loadMore={loadMore}
                        renderLoader={renderLoader}
                        refreshing={refreshing}
                    />
                )}
        </View>
    )
}

export default AcceptShippingScreen