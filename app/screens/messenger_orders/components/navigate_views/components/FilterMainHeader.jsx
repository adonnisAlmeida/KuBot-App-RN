import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Typography } from '../../../../../components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../../../../constants/Colors'
import FilterElement from './FilterElement'
import { orderShippingStatusDisplay } from '../../../../../utils/CommonFunctions'
import moment from 'moment'
moment.locale('es')

const FilterMainHeader = ({ setShowFilter, activeFilters, setActiveView, filterOptions, setComeFromHeader }) => {
    const [filtersCount, setFiltersCount] = useState(0)

    useEffect(() => {
        let cont = 0
        Object.keys(activeFilters).forEach(function (key) {
            if (activeFilters[key]) {
                cont++
            }
        })
        setFiltersCount(cont)
    }, [activeFilters])

    const sellerLabel = (seller) => {
        if (seller == null)
            return ''

        if (seller?.user) {
            if (seller.user.firstName) {
                return seller.user.firstName + " " + seller.user.lastName
            } else {
                return seller.user.userName
            }
        } else {
            return "Invitado"
        }
    }

    const clientLabel = (client) => {
        if (client == null)
            return ''

        if (client) {
            if (client.firstName) {
                return client.firstName + " " + client.lastName
            } else {
                return client.userName
            }
        } else {
            return "Invitado"
        }
    }

    const dateLabel = () => {
        if(!activeFilters.date){
            return ''
        }
        if (filterOptions.from && filterOptions.to) {
            return moment(filterOptions.from).format("YYYY-MM-DD") + " - " + moment(filterOptions.to).format("YYYY-MM-DD")
        } else if (filterOptions.to && filterOptions.from == null) {
            return "Hasta: " + moment(filterOptions.to).format("YYYY-MM-DD")
        }else if(filterOptions.to == null && filterOptions.from){
            return "Desde: " + moment(filterOptions.from).format("YYYY-MM-DD")
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ marginRight: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        setComeFromHeader(false)
                        setShowFilter(true)
                    }}
                    style={{ padding: 4 }}
                >
                    <MaterialCommunityIcons
                        name='filter'
                        color={Colors.COLORS.WEB_LINK}
                        size={25}
                    />
                    <Typography
                        bold
                        color={Colors.COLORS.WEB_LINK}
                        style={{
                            position: 'absolute',
                            right: 2,
                            bottom: 2
                        }}
                    >{filtersCount}</Typography>
                </TouchableOpacity>
            </View>
            <ScrollView
                style={{ backgroundColor: 'transparent' }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {activeFilters.number && (
                    <FilterElement
                        content={'Orden # ' + filterOptions.number}
                        pressedFilter={() => {
                            setActiveView(2)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
                {activeFilters.country && (
                    <FilterElement
                        content={filterOptions.country}
                        pressedFilter={() => {
                            setActiveView(3)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
                {activeFilters.province && (
                    <FilterElement
                        content={filterOptions.province}
                        pressedFilter={() => {
                            setActiveView(4)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
                {activeFilters.municipality && (
                    <FilterElement
                        content={filterOptions.municipality}
                        pressedFilter={() => {
                            setActiveView(5)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
                {activeFilters.state && (
                    <FilterElement
                        content={orderShippingStatusDisplay(filterOptions.state)}
                        pressedFilter={() => {
                            setActiveView(6)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
                {activeFilters.seller && (
                    <FilterElement
                        content={sellerLabel(filterOptions.seller)}
                        pressedFilter={() => {
                            setActiveView(7)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
                {activeFilters.client && (
                    <FilterElement
                        content={clientLabel(filterOptions.client)}
                        pressedFilter={() => {
                            setActiveView(8)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
                {activeFilters.date && (
                    <FilterElement
                        content={dateLabel()}
                        pressedFilter={() => {
                            setActiveView(9)
                            setComeFromHeader(true)
                            setShowFilter(true)
                        }}
                    />
                )}
            </ScrollView>
        </View>
    )
}

export default FilterMainHeader

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        height: 55,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        zIndex: 999,
        elevation: 6,
    },
})