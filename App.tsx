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
import { styles } from 'common/styles/styles';
import HomeScreen from 'screens/app/HomeScreen';
import LoginScreen from 'screens/auth/LoginScreen';
import SignupScreen from 'screens/auth/SignupScreen';
import { AuthContextProvider } from './src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserTypeScreen from 'screens/auth/UserTypeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import CustomDrawer from 'components/CustomDrawer';
import { FirestoreContextProvider } from './src/contexts/FirestoreContext';
import PathsScreen from 'screens/app/PathsScreen';
import SettingsScreen from 'screens/app/SettingsScreen';
import DriverConfirmScreen from 'screens/app/DriverConfirmScreen';
import PasswordResetScreen from 'screens/auth/PasswordResetScreen';
import I18n from 'internationalization';

const App = () => {
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('ToulouzenToken');
    setToken(token);
  };

  const AppStack = createDrawerNavigator();
  function MyAppStack() {
    return (
      <AppStack.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        initialRouteName="Home">
        <AppStack.Group screenOptions={{ headerShown: false }}>
          <AppStack.Screen
            name="Home"
            component={HomeScreen}
            options={{ drawerLabel: I18n.t('general.drawer_menu.home') }}
          />
          <AppStack.Screen
            name="Paths"
            component={PathsScreen}
            options={{ drawerLabel: I18n.t('general.drawer_menu.rides') }}
          />
          <AppStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ drawerLabel: I18n.t('general.drawer_menu.settings') }}
          />
        </AppStack.Group>
      </AppStack.Navigator>
    );
  }

  const LogStack = createStackNavigator();
  function MyLogStack() {
    return (
      <LogStack.Navigator initialRouteName="Login">
        <LogStack.Group screenOptions={{ headerShown: false }}>
          <LogStack.Screen name="UserType" component={UserTypeScreen} />
          <LogStack.Screen name="Login" component={LoginScreen} />
          <LogStack.Screen name="Signup" component={SignupScreen} />
        </LogStack.Group>
      </LogStack.Navigator>
    );
  }

  const FullAppStack = createStackNavigator();
  function MyFullAppStack() {
    return (
      <FullAppStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={token === 'autolog' ? 'App' : 'Login'}>
        <FullAppStack.Screen name="Log" component={MyLogStack} />
        <FullAppStack.Screen name="App" component={MyAppStack} />
        <FullAppStack.Screen
          name="DriverConfirm"
          component={DriverConfirmScreen}
        />
        <FullAppStack.Screen
          name="PasswordReset"
          component={PasswordResetScreen}
        />
      </FullAppStack.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{ bottom: 'never' }}
        style={{ backgroundColor: '#000' }}
      />
      <SafeAreaView
        forceInset={{ top: 'never', bottom: 'never' }}
        style={styles.container}>
        <AuthContextProvider>
          <FirestoreContextProvider>
            <NavigationContainer>
              <StatusBar barStyle="light-content" />
              <MyFullAppStack />
            </NavigationContainer>
          </FirestoreContextProvider>
        </AuthContextProvider>
      </SafeAreaView>
      <SafeAreaView
        forceInset={{ top: 'never' }}
        style={{ backgroundColor: '#000' }}
      />
    </SafeAreaProvider>
  );
};

export default App;
