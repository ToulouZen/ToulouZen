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
import { SafeAreaView, StatusBar } from 'react-native';
import { styles } from './src/styles/styles';
import HomeScreen from './src/screens/app/HomeScreen';
import LoginScreen from './src/screens/logs/LoginScreen';
import SignupScreen from './src/screens/logs/SignupScreen';
import { AuthContextProvider } from './src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './src/constants/Constants';



const App = () => {

  const [token, setToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    getToken()
  }, [])

  const getToken = async () => {
    const token = await AsyncStorage.getItem('ToulouzenToken')
    setToken(token)
  }

  const LogStack = createStackNavigator();
  function MyLogStack() {
    return (
      <LogStack.Navigator initialRouteName={token == "autolog" ? 'App' : 'Login'}>
        <LogStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <LogStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <LogStack.Screen name="App" component={HomeScreen} options={{ headerShown: false }} />
      </LogStack.Navigator>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthContextProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <MyLogStack />
        </NavigationContainer>
      </AuthContextProvider>
    </SafeAreaView>
  )
}

export default App;
