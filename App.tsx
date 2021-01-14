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

const LogStack = createStackNavigator();
function MyLogStack() {
  return (
    <LogStack.Navigator>
      <LogStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <LogStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    </LogStack.Navigator>
  )
}

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <MyLogStack />
    </NavigationContainer>
  )
}

export default App;
