import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerContentOptions,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from '@react-navigation/drawer/lib/typescript/src/types';
import {
  CommonActions,
  DrawerActions,
  DrawerNavigationState,
  ParamListBase,
} from '@react-navigation/native';
import DrawerItemCustom from 'components/DrawerItemCustom';
import { COLORS, WINDOW_WIDTH } from 'constants/Constants';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from 'common/styles/styles';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import I18n from 'internationalization';

type PropsDrawer = Omit<
  DrawerContentOptions,
  'contentContainerStyle' | 'style'
> & {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};
const CustomDrawer: React.FC<PropsDrawer> = ({
  state,
  descriptors,
  navigation,
}) => {
  const [isSwitched, setIsSwitched] = React.useState<boolean>(false);
  const auth = useAuth();
  const firestore = useFirestore();

  React.useEffect(() => {
    if (auth.userInfo?.userType == 'driver') {
      setIsSwitched(false);
    } else {
      setIsSwitched(true);
    }
    _setUserType(auth.userInfo?.userType);
  }, [auth.userInfo?.userType]);

  const _setUserType = async (userType: string | null | undefined) => {
    if (typeof userType == 'string') {
      AsyncStorage.setItem('ToulouzenUserType', userType).then(() =>
        auth.getUserInfo(),
      );
    }
  };

  const disconnect = async () => {
    firestore.resetAll();
    await AsyncStorage.multiRemove([
      'ToulouzenUserUID',
      'ToulouzenFirstname',
      'ToulouzenLastname',
      'ToulouzenEmail',
      'ToulouzenAge',
      'ToulouzenUserType',
      'ToulouzenToken',
    ]);
    auth.signOut();
    navigation.navigate('Log', { screen: 'Login' });
  };

  return (
    <DrawerContentScrollView
      bounces={false}
      contentContainerStyle={{
        flex: 1,
        paddingTop: 0,
        justifyContent: 'space-between',
      }}
      {...state}
      {...descriptors}
      {...navigation}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: COLORS.peach,
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/img/logo.png')}
            resizeMode="contain"
            style={{
              width: WINDOW_WIDTH * 0.15,
              height: WINDOW_WIDTH * 0.15,
              tintColor: '#fff',
              margin: WINDOW_WIDTH * 0.07,
            }}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: WINDOW_WIDTH * 0.07,
              fontWeight: 'bold',
            }}>
            {auth.userInfo?.firstname}
          </Text>
        </View>
        {state.routes.map((route, i) => {
          const focused = i === state.index;
          const { drawerLabel } = descriptors[route.key].options;
          return (
            <DrawerItemCustom
              key={route.key}
              focused={focused}
              title={drawerLabel}
              onPress={() => {
                navigation.dispatch({
                  ...(focused
                    ? DrawerActions.closeDrawer()
                    : CommonActions.navigate(route.name)),
                  target: state.key,
                });
              }}
            />
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => disconnect()}
        style={styles.deconnectionView}>
        <Text style={[styles.drawerCustomItemText, { color: '#fff' }]}>
          {I18n.t('common.logout')}
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
