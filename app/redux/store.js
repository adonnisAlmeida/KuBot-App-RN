import { configureStore } from '@reduxjs/toolkit'

import darkModeSlice from './darkmode/darkModeSlice'
import userLoginSlice from './userlogin/userLoginSlice'
import onboardingSlice from './onboarding/onboardingSlice'
import deliveryareasSlice from './deliveryareas/deliveryareasSlice'
import holydaysSlice from './holydays/holydaysSlice'
import deliberyschedulesSlice from './deliberyschedules/deliberyschedulesSlice'
import clientsSlice from './clients/clientsSlice'
import sellersSlice from './sellers/sellersSlice'
import accept_shippingSlice from './accept_shipping/accept_shippingSlice'
import messenger_ordersSlice from './messenger_orders/messenger_ordersSlice'
import messagesSlice from './messages/messagesSlice'

export default configureStore({
	reducer: {
		darkmode: darkModeSlice,
		userlogin: userLoginSlice,
		onboarding: onboardingSlice,
		deliveryareas: deliveryareasSlice,
		holydays: holydaysSlice,
		deliberyschedules: deliberyschedulesSlice,
		clients: clientsSlice,
		sellers: sellersSlice,
		accepShipping: accept_shippingSlice,
		messengerOrders: messenger_ordersSlice,
		messages: messagesSlice
	},
})
