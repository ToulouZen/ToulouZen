import firebaseAuth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { styles } from 'common/styles/styles';
import { AuthContextProvider } from 'contexts/AuthContext';
import { FirestoreContextProvider } from 'contexts/FirestoreContext';
import { LocationContextProvider } from 'contexts/LocationContext';
import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { AccountScreen } from 'screens/app/AccountScreen';
import DriverConfirmScreen from 'screens/app/DriverConfirmScreen';
import HomeScreen from 'screens/app/HomeScreen';
import PathsScreen from 'screens/app/PathsScreen';
import SettingsScreen from 'screens/app/SettingsScreen';
import LoginScreen from 'screens/auth/LoginScreen';
import PasswordResetScreen from 'screens/auth/PasswordResetScreen';
import SignupScreen from 'screens/auth/SignupScreen';
import UserTypeScreen from 'screens/auth/UserTypeScreen';
import { logCurrentStorage } from 'utils/utils';

const App = () => {
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  const AppStack = createStackNavigator();
  const AppDrawerStack = createStackNavigator();

  const LoggedStack = () => {
    return (
      <AppDrawerStack.Navigator initialRouteName="Home">
        <AppDrawerStack.Group screenOptions={{ headerShown: false }}>
          <AppDrawerStack.Screen
            name="Home"
            component={HomeScreen}
            // options={{ drawerLabel: I18n.t('general.drawer_menu.home') }}
          />
          <AppDrawerStack.Screen name="Paths" component={PathsScreen} />
          <AppDrawerStack.Screen name="Settings" component={SettingsScreen} />
          <AppDrawerStack.Group screenOptions={{ presentation: 'modal' }}>
            <AppDrawerStack.Screen name="Account" component={AccountScreen} />
          </AppDrawerStack.Group>
        </AppDrawerStack.Group>
      </AppDrawerStack.Navigator>
    );
  };

  const AuthStack = () => {
    return (
      <AppStack.Navigator initialRouteName="Login">
        <AppStack.Group screenOptions={{ headerShown: false }}>
          <AppStack.Screen name="Login" component={LoginScreen} />
          <AppStack.Screen name="UserType" component={UserTypeScreen} />
          <AppStack.Screen name="Signup" component={SignupScreen} />
          <AppStack.Screen
            name="PasswordReset"
            component={PasswordResetScreen}
          />
        </AppStack.Group>
      </AppStack.Navigator>
    );
  };

  const FullAppStack = () => {
    return (
      <AppStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={
          firebaseAuth().currentUser !== null ? 'LoggedApp' : 'AuthApp'
        }>
        <AppStack.Screen name="AuthApp" component={AuthStack} />
        <AppStack.Screen name="LoggedApp" component={LoggedStack} />
        <AppStack.Screen name="DriverConfirm" component={DriverConfirmScreen} />
      </AppStack.Navigator>
    );
  };

  useEffect(() => {
    logCurrentStorage();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{ bottom: 'never' }}
        style={styles.blackBackgroundColor}
      />
      <SafeAreaView
        forceInset={{ top: 'never', bottom: 'never' }}
        style={styles.container}>
        <LocationContextProvider>
          <AuthContextProvider>
            <FirestoreContextProvider>
              <NavigationContainer>
                <StatusBar barStyle="light-content" />
                <FullAppStack />
              </NavigationContainer>
            </FirestoreContextProvider>
          </AuthContextProvider>
        </LocationContextProvider>
      </SafeAreaView>
      <SafeAreaView
        forceInset={{ top: 'never' }}
        style={styles.blackBackgroundColor}
      />
    </SafeAreaProvider>
  );
};

export default App;
