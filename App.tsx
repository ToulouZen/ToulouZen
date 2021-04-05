/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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
import HeaderMap from './src/components/HeaderMap';
import CustomDrawer from './src/components/CustomDrawer';
import { FirestoreContextProvider } from './src/contexts/FirestoreContext';



const App = () => {

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
        <AppStack.Screen name="Home" component={HomeScreen} options={{ drawerLabel: "Vos courses" }} />
        <AppStack.Screen name="Test" component={HeaderMap} options={{ drawerLabel: "Vos tests" }} />
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
