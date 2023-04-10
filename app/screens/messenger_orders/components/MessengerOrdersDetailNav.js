import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailsNavView from './navigate_views/DetailsNavView'
import HistoryNavView from './navigate_views/HistoryNavView'
import PaymentNavView from './navigate_views/PaymentNavView'
import ProductsNavView from './navigate_views/ProductsNavView';
import Colors from '../../../constants/Colors';

const Tab = createMaterialTopTabNavigator();

const MessengerOrdersDetailNav = ({ navigation, route, data }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: Colors.COLORS.PRIMARY },
                tabBarIndicatorStyle: { backgroundColor: '#fff' },
                tabBarLabelStyle: { fontWeight: "bold", fontSize: 16, textTransform: "none" },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
            }}>
            <Tab.Screen initialParams={{ data: data }} name="DetailsNavView" options={{ tabBarLabel: 'Detalles' }} component={DetailsNavView} />
            <Tab.Screen initialParams={{ data: data }} name="ProductsNavView" options={{ tabBarLabel: 'Productos' }} component={ProductsNavView} />
            {/* <Tab.Screen initialParams={{ data: data }} name="PaymentNavView" options={{tabBarLabel: 'Pagos'}} component={PaymentNavView} /> */}
            <Tab.Screen initialParams={{ data: data }} name="HistoryNavView" options={{ tabBarLabel: 'Historia' }} component={HistoryNavView} />
        </Tab.Navigator>
    )
}

export default MessengerOrdersDetailNav