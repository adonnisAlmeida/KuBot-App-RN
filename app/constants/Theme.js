const LIGHT = {
	TOOLBAR: '#F7F7FF',
	PRIMARY: '#2DCE8A', // este
	PRIMARY_VARIANT: '#2DCE8A', // este
	SECUNDARY: '#53DBA2',
	SECUNDARY_VARIANT: '#53DBA2',
	BACKGROUND: '#F7F7FF',
	SURFACE: '#FFFFFF',
	ERROR: '#B00020',
	ON_PRIMARY: '#FFFFFF',
	ON_SECUNDARY: '#000000',
	ON_BACKGROUND: '#0E162D',
	ON_SURFACE: '#0E162D',
	ON_SURFACE_VARIANT: '#000000',
	ON_ERROR: '#FFFFFF',
	MODAL: '#FFFFFF',
	ON_MODAL: '#000000',
}

const DARK = {
	TOOLBAR: '#151515',
	PRIMARY: '#2DCE8A',
	PRIMARY_VARIANT: '#2DCE8A',
	SECUNDARY: '#53DBA2',
	SECUNDARY_VARIANT: '#53DBA2',
	BACKGROUND: '#151515',
	SURFACE: '#232526',
	ERROR: '#CF6679',
	ON_PRIMARY: '#000000',
	ON_SECUNDARY: '#000000',
	ON_BACKGROUND: '#DFDFDF',
	ON_SURFACE: '#E1E1E1',
	ON_SURFACE_VARIANT: '#8E8E8E',
	ON_ERROR: '#000000',
	MODAL: '#2D2D2D',
	ON_MODAL: '#E3E3E3',
}

const ThemeLight = {
	dark: false,
	colors: {
		...LIGHT,
		primary: LIGHT.PRIMARY,
		background: LIGHT.BACKGROUND,
		card: LIGHT.TOOLBAR,
		text: LIGHT.ON_SURFACE,
		border: LIGHT.BACKGROUND,
		notification: LIGHT.ERRROR,
	},
}

const ThemeDark = {
	dark: true,
	colors: {
		...DARK,
		primary: DARK.PRIMARY,
		background: DARK.BACKGROUND,
		card: DARK.TOOLBAR,
		text: DARK.ON_SURFACE,
		border: DARK.BACKGROUND,
		notification: DARK.ERRROR,
	},
}

const SIZES = {
	BASE: 16,
	FONT: 14,
	OPACITY: 0.8,
	RADIUS: 12,
	PADDING: 25,
	// font sizes
	h1: 26,
	h2: 20,
	h3: 17,
	title: 18,
	header: 16,
	body: 14,
	caption: 12,
	small: 12,
}

const FONTS = {
	h1: {
		fontSize: SIZES.h1,
	},
	h2: {
		fontSize: SIZES.h2,
	},
	h3: {
		fontSize: SIZES.h3,
	},
	header: {
		fontSize: SIZES.header,
	},
	title: {
		fontSize: SIZES.title,
	},
	body: {
		fontSize: SIZES.body,
	},
	caption: {
		fontSize: SIZES.caption,
	},
	small: {
		fontSize: SIZES.small,
	},
}

export default {
	LIGHT,
	DARK,
	ThemeLight,
	ThemeDark,
	SIZES,
	FONTS,
}
