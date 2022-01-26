import { DrawerContentScrollView } from '@react-navigation/drawer';
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
import { MMKVStorage } from 'common/storage';
import { styles } from 'common/styles/styles';
import DrawerItemCustom from 'components/DrawerItemCustom';
import {
  COLORS,
  TOULOUZEN_AGE,
  TOULOUZEN_EMAIL,
  TOULOUZEN_FIRST_NAME,
  TOULOUZEN_LAST_NAME,
  TOULOUZEN_USER_ID,
  TOULOUZEN_USER_TYPE,
  WINDOW_WIDTH,
} from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import I18n from 'internationalization';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ToulouZenLogo from 'assets/img/logo.svg';

type PropsDrawer = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};
const CustomDrawer: FC<PropsDrawer> = ({ state, descriptors, navigation }) => {
  const auth = useAuth();
  const firestore = useFirestore();

  const disconnect = async () => {
    firestore.resetAll();
    MMKVStorage.delete(TOULOUZEN_USER_ID);
    MMKVStorage.delete(TOULOUZEN_FIRST_NAME);
    MMKVStorage.delete(TOULOUZEN_LAST_NAME);
    MMKVStorage.delete(TOULOUZEN_EMAIL);
    MMKVStorage.delete(TOULOUZEN_AGE);
    MMKVStorage.delete(TOULOUZEN_USER_TYPE);
    auth.signOut();
    navigation.navigate('AuthApp');
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
          <ToulouZenLogo
            fill={COLORS.white}
            height={WINDOW_WIDTH * 0.3}
            width={WINDOW_WIDTH * 0.3}
            style={{
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
