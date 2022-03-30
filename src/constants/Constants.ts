import { Dimensions, Platform } from 'react-native';

export const MAPBOX_PUBLIC_API_KEY =
  'pk.eyJ1IjoidG91bG91emVuIiwiYSI6ImNreDdiMm9oeTJubnEycXB6amp2MjQ3NTkifQ.9rhOsN9V4Xx_F2OWBGil3Q';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const PASSENGER = 'passenger';
export const PASSENGER_POSITION = 'Position du passager';
export const DRIVER = 'driver';
export const DONE = 'DONE';
export const CREATED = 'CREATED';
export const STARTED = 'STARTED';

export const TOULOUZEN_USER_ID = 'ToulouzenUserUID';
export const TOULOUZEN_FIRST_NAME = 'ToulouzenFirstname';
export const TOULOUZEN_LAST_NAME = 'ToulouzenLastname';
export const TOULOUZEN_EMAIL = 'ToulouzenEmail';
export const TOULOUZEN_USER_TYPE = 'ToulouzenUserType';
export const TOULOUZEN_TOKEN = 'ToulouzenToken';

export const COLORS = {
  raspberry: '#b01848',
  black: '#000000',
  blackBackground: '#202020',
  white: '#ffffff',
  green: '#A5EAC6',
  nude: '#FFDFD3',
  pink: '#FFC8B6',
  peach: '#E4613D',
  bluePrimary: '#7DB1AF',
  blue: '#49a987',
  lightGrey: '#f0f0f0',
  darkGrey: '#888888',
  primaryColor: '#ee725a',
  backgroundSurface: '#f8f8f8',
  inputBorderColor: '#aebfbd',
  inputTextColor: '#a0a3bd',
  text: '#1e2625',
  whiteText: '#f7f7fc',
  disable: '#AEBFBD',
};
