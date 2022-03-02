import { DrawerNavigationProp } from '@react-navigation/drawer';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { WINDOW_WIDTH } from 'constants/Constants';
import I18n from 'internationalization';
import React, { FC } from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import Burger from 'assets/img/menu_burger.svg';
import SOS from 'assets/img/sos.svg';

type Props = {
  navigation: DrawerNavigationProp<
    RootStackParamsList,
    'Home' | 'Paths' | 'Settings'
  >;
};

const HeaderMap: FC<Props> = ({ navigation }) => {
  const _emergencyCall = async () => {
    let url = '';
    if (Platform.OS === 'android') {
      url = 'tel:17';
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: I18n.t('permissions.phone.title'),
            message: I18n.t('permissions.phone.description'),
            buttonPositive: I18n.t('common.ok'),
            buttonNegative: I18n.t('common.no'),
            buttonNeutral: I18n.t('common.later'),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const canOpen = await Linking.canOpenURL(url);
          if (!canOpen) {
            throw new Error('Provided URL can not be handled');
          }
          return Linking.openURL(url);
        }
      } catch (err) {
        return err;
      }
    } else {
      url = 'telprompt:17';
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Provided URL can not be handled');
      }
      return Linking.openURL(url);
    }
  };
  const call = () => {
    Alert.alert(
      I18n.t('emergency_call_dialog.title'),
      I18n.t('emergency_call_dialog.description'),
      [
        {
          text: I18n.t('common.yes'),
          onPress: () => _emergencyCall(),
        },
        {
          text: I18n.t('common.no'),
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.shadowContainer,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: WINDOW_WIDTH * 0.03,
          width: WINDOW_WIDTH,
        },
      ]}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.drawerIcon}>
        <Burger width={20} height={20} color="red" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => call()}>
        <SOS
          style={{ width: WINDOW_WIDTH * 0.1, height: WINDOW_WIDTH * 0.1 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default HeaderMap;
