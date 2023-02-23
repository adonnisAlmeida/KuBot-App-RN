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
	},
	PRODUCTS: {
		component: ProductsScreen,
		title: 'Productos',
		name: 'Products',
		icon: 'product-hunt',
		drawer: true,
	},
	PRODUCT: {
		component: ProductScreen,
		title: 'Product',
		name: 'Product',
		icon: 'navicon',
		drawer: false,
	},
	PROFILE: {
		component: ProfileScreen,
		title: 'Perfil',
		name: 'Profile',
		icon: 'user',
		drawer: true,
	},
	EDITAR_PROFILE: {
		component: EditProfileScreen,
		title: 'Editar Perfil',
		name: 'EditarProfile',
		icon: 'edit',
		drawer: false,
	},
	HOLIDAYS: {
		component: HolidaysScreen,
		title: 'Vacaciones',
		name: 'Holidays',
		icon: 'plane',
		drawer: true,
	},
	HOLIDAYSFORM: {
		component: HolidaysFormScreen,
		title: 'Adicionar Vacaciones',
		name: 'HolidaysForm',
		icon: 'plane',
		drawer: false,
	},
	ACCEPT_SHIPPING: {
		component: AcceptShippingScreen,
		title: 'Aceptar Envío',
		name: 'AcceptShippingScreen',
		icon: 'check-square-o',
		drawer: true,
	},
	ACCEPT_SHIPPING_DETAIL: {
		component: AcceptShippingDetailsScreen,
		title: 'Detalles de la orden',
		name: 'AcceptShippingDetailsScreen',
		icon: 'check-square-o',
		drawer: false,
	},
	MESSENGER_ORDERS: {
		component: MessengerOrdersScreen,
		title: 'Orden de Mensajero',
		name: 'MessengerOrders',
		icon: 'envelope-open',
		drawer: true,
	},
	MESSENGER_ORDERS_DETAIL: {
		component: MessengerOrdersDetailScreen,
		title: 'Detalles',
		name: 'MessengerOrdersDetail',
		icon: 'sort-alpha-asc',
		drawer: false,
	},
	CLIENTS: {
		component: ClientsScreen,
		title: 'Clientes',
		name: 'Clients',
		icon: 'group',
		drawer: true,
	},
	CLIENT_DETAILS: {
		component: ClientsDetailsScreen,
		title: 'Cliente',
		name: 'ClientDetails',
		icon: 'group',
		drawer: false,
	},
	SELLERS: {
		component: SellersScreen,
		title: 'Vendedores',
		name: 'Sellers',
		icon: 'group',
		drawer: true,
	},
	SELLER_DETAILS: {
		component: SellerDetailsScreen,
		title: 'Vendedor',
		name: 'SellerDetails',
		icon: 'group',
		drawer: false,
	},
	DELIVERY_AREAS: {
		component: DeliveryAreasScreen,
		title: 'Zonas de entregas',
		name: 'DeliveryAreas',
		icon: 'location-arrow',
		drawer: true,
	},
	DELIVERY_AREAS_FORM: {
		component: DeliveryAreasFormScreen,
		title: 'Editar zonas de entregas',
		name: 'DeliveryAreasForm',
		icon: 'map',
		drawer: false,
	},
	DELIVERY_SCHEDULES: {
		component: DeliverySchedulesScreen,
		title: 'Horario de Reparto',
		name: 'DeliverySchedulesScreen',
		icon: 'sort-alpha-asc',
		drawer: true,
	},
	DELIVERY_SCHEDULES_FORM: {
		component: DeliverySchedulesFormScreen,
		title: 'Adicionar Horario de Reparto',
		name: 'DeliverySchedulesFormScreen',
		icon: 'sort-alpha-asc',
		drawer: false,
	},
	/* EDIT_ADDRESS_FORM: {
		component: EditAddressScreen,
		title: 'Editar dirección',
		name: 'EditAddressScreen',
		icon: 'sort-alpha-asc',
		drawer: false,
	}, */
}
