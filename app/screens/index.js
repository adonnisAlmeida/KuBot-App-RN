import HomeScreen from './home/HomeScreen'
import ProductsScreen from './products/ProductsScreen'
import ProductScreen from './products/ProductScreen'
import LoginScreen from './login/LoginScreen'
import RegisterScreen from './login/RegisterScreen'
import ProfileScreen from './profile/ProfileScreen'
import EditProfileScreen from './profile/EditProfileScreen'
import HolidaysScreen from './holidays/HolidaysScreen'
import HolidaysFormScreen from './holidays/HolidaysFormScreen'
import OnboardingScreen from './onboarding/OnboardingScreen'
import MessengerOrdersScreen from './messenger_orders/MessengerOrdersScreen'
import MessengerOrdersDetailScreen from './messenger_orders/MessengerOrdersDetailScreen'
import DeliveryAreasScreen from './delivery_areas/DeliveryAreasScreen'
import DeliveryAreasFormScreen from './delivery_areas/DeliveryAreasFormScreen'
import DeliverySchedulesScreen from './delivery_schedules/DeliverySchedulesScreen'
import DeliverySchedulesFormScreen from './delivery_schedules/DeliverySchedulesFormScreen'
import ClientsScreen from './clients/ClientsScreen'
import ClientsDetailsScreen from './clients/ClientDetailsScreen'
import SellersScreen from './sellers/SellersScreen'
import SellerDetailsScreen from './sellers/SellerDetailsScreen'
import AcceptShippingScreen from './accept_shipping/AcceptShippingScreen'
import AcceptShippingDetailsScreen from './accept_shipping/AcceptShippingDetailsScreen'
import EditAddressScreen from './profile/EditAddressScreen'
import MessagesScreen from './messages/MessagesScreen'
import MessagesChatScreen from './messages/MessagesChatScreen'
import NewMessageScreen from './messages/NewMessageScreen'
import Pruebas from './home/Pruebas'
import WriteMessageScreen from './messages/WriteMessageScreen'
import CarrierApplicationScreen from './carrier_application/CarrierApplicationScreen'

export default {
	ONBOARDING: {
		component: OnboardingScreen,
		name: 'Onboarding',
	},
	LOGIN: {
		component: LoginScreen,
		name: 'Login',
	},
	REGISTER: {
		component: RegisterScreen,
		name: 'Register',
	},
	HOME: {
		component: HomeScreen,
		title: 'KuBot',
		name: 'Home',
		icon: 'home',
		drawer: true,
		carrier_only: false,
	},
	PRUEBAS: {
		component: Pruebas,
		title: 'Pruebas',
		name: 'PruebasScreen',
		icon: 'home',
		drawer: false,
		carrier_only: false,
	},
	CARRIER_APPLICATION: {
		component: CarrierApplicationScreen,
		title: 'Registro de Mensajero',
		name: 'CarrierApplicationScreen',
		icon: 'home',
		drawer: false,
		carrier_only: false,
	},
	MESSAGES: {
		component: MessagesScreen,
		title: 'Mensajes',
		name: 'MessagesScreen',
		icon: 'comments',
		drawer: true,
		carrier_only: true,
	},
	MESSAGES_CHAT: {
		component: MessagesChatScreen,
		title: 'Mensajes',
		name: 'MessagesChatScreen',
		icon: 'comments',
		drawer: false,
		carrier_only: true,
	},
	NEW_MESSAGE: {
		component: NewMessageScreen,
		title: 'Redactar Nuevo Mensaje',
		name: 'NewMessageScreen',
		drawer: false,
		carrier_only: true,
	},
	WRITE_MESSAGE: {
		component: WriteMessageScreen,
		title: 'Redactar Mensaje',
		name: 'WriteMessageScreen',
		drawer: false,
		carrier_only: true,
	},
	PRODUCTS: {
		component: ProductsScreen,
		title: 'Productos',
		name: 'Products',
		icon: 'product-hunt',
		drawer: true,
		carrier_only: false,
	},
	PRODUCT: {
		component: ProductScreen,
		title: 'Product',
		name: 'Product',
		icon: 'navicon',
		drawer: false,
		carrier_only: false,
	},
	PROFILE: {
		component: ProfileScreen,
		title: 'Perfil',
		name: 'Profile',
		icon: 'user',
		drawer: true,
		carrier_only: false,
	},
	EDITAR_PROFILE: {
		component: EditProfileScreen,
		title: 'Editar Perfil',
		name: 'EditarProfile',
		icon: 'edit',
		drawer: false,
		carrier_only: false,
	},
	HOLIDAYS: {
		component: HolidaysScreen,
		title: 'Vacaciones',
		name: 'Holidays',
		icon: 'plane',
		drawer: true,
		carrier_only: true,
	},
	HOLIDAYSFORM: {
		component: HolidaysFormScreen,
		title: 'Adicionar Vacaciones',
		name: 'HolidaysForm',
		icon: 'plane',
		drawer: false,
		carrier_only: true,
	},
	ACCEPT_SHIPPING: {
		component: AcceptShippingScreen,
		title: 'Aceptar Envío',
		name: 'AcceptShippingScreen',
		icon: 'check-square-o',
		drawer: true,
		carrier_only: true,
	},
	ACCEPT_SHIPPING_DETAIL: {
		component: AcceptShippingDetailsScreen,
		title: 'Detalles de la orden',
		name: 'AcceptShippingDetailsScreen',
		icon: 'check-square-o',
		drawer: false,
		carrier_only: true,
	},
	MESSENGER_ORDERS: {
		component: MessengerOrdersScreen,
		title: 'Orden de Mensajero',
		name: 'MessengerOrders',
		icon: 'envelope-open',
		drawer: true,
		carrier_only: true,
	},
	MESSENGER_ORDERS_DETAIL: {
		component: MessengerOrdersDetailScreen,
		title: 'Detalles',
		name: 'MessengerOrdersDetail',
		icon: 'sort-alpha-asc',
		drawer: false,
		carrier_only: true,
	},
	CLIENTS: {
		component: ClientsScreen,
		title: 'Clientes',
		name: 'Clients',
		icon: 'group',
		drawer: true,
		carrier_only: true,
	},
	CLIENT_DETAILS: {
		component: ClientsDetailsScreen,
		title: 'Cliente',
		name: 'ClientDetails',
		icon: 'group',
		drawer: false,
		carrier_only: true,
	},
	SELLERS: {
		component: SellersScreen,
		title: 'Vendedores',
		name: 'Sellers',
		icon: 'group',
		drawer: true,
		carrier_only: true,
	},
	SELLER_DETAILS: {
		component: SellerDetailsScreen,
		title: 'Vendedor',
		name: 'SellerDetails',
		icon: 'group',
		drawer: false,
		carrier_only: true,
	},
	DELIVERY_AREAS: {
		component: DeliveryAreasScreen,
		title: 'Zonas de entregas',
		name: 'DeliveryAreas',
		icon: 'location-arrow',
		drawer: true,
		carrier_only: true,
	},
	DELIVERY_AREAS_FORM: {
		component: DeliveryAreasFormScreen,
		title: 'Editar zonas de entregas',
		name: 'DeliveryAreasForm',
		icon: 'map',
		drawer: false,
		carrier_only: true,
	},
	DELIVERY_SCHEDULES: {
		component: DeliverySchedulesScreen,
		title: 'Horario de Reparto',
		name: 'DeliverySchedulesScreen',
		icon: 'sort-alpha-asc',
		drawer: true,
		carrier_only: true,
	},
	DELIVERY_SCHEDULES_FORM: {
		component: DeliverySchedulesFormScreen,
		title: 'Adicionar Horario de Reparto',
		name: 'DeliverySchedulesFormScreen',
		icon: 'sort-alpha-asc',
		drawer: false,
		carrier_only: true,
	},
	/* EDIT_ADDRESS_FORM: {
		component: EditAddressScreen,
		title: 'Editar dirección',
		name: 'EditAddressScreen',
		icon: 'sort-alpha-asc',
		drawer: false,
	}, */
}
