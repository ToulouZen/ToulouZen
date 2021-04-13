/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Alert, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { styles } from './src/styles/styles';
import HomeScreen from './src/screens/app/HomeScreen';
import LoginScreen from './src/screens/logs/LoginScreen';
import SignupScreen from './src/screens/logs/SignupScreen';
import { AuthContextProvider, useAuth } from './src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserTypeScreen from './src/screens/logs/UserTypeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import CustomDrawer from './src/components/CustomDrawer';
import { FirestoreContextProvider } from './src/contexts/FirestoreContext';
import PathsScreen from './src/screens/app/PathsScreen';
import SettingsScreen from './src/screens/app/SettingsScreen';
import DriverConfirmScreen from './src/screens/app/DriverConfirmScreen';
import PasswordResetScreen from './src/screens/logs/PasswordResetScreen';
// Notification
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";


const App = () => {

  // Notification
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token:any) {
      console.log("TOKEN:", token);
    },
  
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification:any) {
      // process the notification
      console.log('NOTIFICATION:', notification);

      if (Platform.OS == "ios") 
      {
        if ( notification.foreground && (notification.userInteraction || notification.remote)) 
        {
          PushNotification.localNotification(notification);
        }
      } 
      else 
      {
        PushNotification.localNotification(notification);
      }
  
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification:any) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
  
      // process the action
    },
  
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err:any) {
      console.error(err.message, err);
    },
  
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
  
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    message: "My Notification Message", // (required)
    date: new Date(Date.now() + 60 * 500), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });

  PushNotification.popInitialNotification((notification:any) => {
    console.log('Initial Notification', notification);
  });


  const [token, setToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    getToken()
  }, [])

  const getToken = async () => {
    const token = await AsyncStorage.getItem('ToulouzenToken')
    setToken(token)
  }

  const AppStack = createDrawerNavigator();
  function MyAppStack() {
    return (
      <AppStack.Navigator drawerContent={props => <CustomDrawer {...props} />}
        drawerStyle={styles.drawer} initialRouteName="Home">
        <AppStack.Screen name="Home" component={HomeScreen} options={{ drawerLabel: "Accueil" }} />
        <AppStack.Screen name="Paths" component={PathsScreen} options={{ drawerLabel: "Mes courses" }} />
        <AppStack.Screen name="Settings" component={SettingsScreen} options={{ drawerLabel: "Mes paramètres" }} />
      </AppStack.Navigator>
    )
  }

  const LogStack = createStackNavigator();
  function MyLogStack() {
    return (
      <LogStack.Navigator initialRouteName="Login">
        <LogStack.Screen name="UserType" component={UserTypeScreen} options={{ headerShown: false }} />
        <LogStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <LogStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      </LogStack.Navigator>
    )
  }

  const FullAppStack = createStackNavigator();
  function MyFullAppStack() {
    return (
      <FullAppStack.Navigator initialRouteName={token == "autolog" ? 'App' : 'Login'}>
        <FullAppStack.Screen name="Log" component={MyLogStack} options={{ headerShown: false }} />
        <FullAppStack.Screen name="App" component={MyAppStack} options={{ headerShown: false }} />
        <FullAppStack.Screen name="DriverConfirm" component={DriverConfirmScreen} options={{ headerShown: false }} />
        <FullAppStack.Screen name="PasswordReset" component={PasswordResetScreen} options={{ headerShown: false }} />
      </FullAppStack.Navigator>
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView forceInset={{ bottom: 'never' }} style={{ backgroundColor: '#000' }} />
      <SafeAreaView forceInset={{ top: 'never', bottom: 'never' }} style={styles.container}>
        <AuthContextProvider>
          <FirestoreContextProvider>
            <NavigationContainer>
              <StatusBar barStyle="light-content" />
              <MyFullAppStack />
            </NavigationContainer>
          </FirestoreContextProvider>
        </AuthContextProvider>
      </SafeAreaView>
      <SafeAreaView forceInset={{ top: 'never' }} style={{ backgroundColor: '#000' }} />
    </SafeAreaProvider>
  )
}

export default App;
