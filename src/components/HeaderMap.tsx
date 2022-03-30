import { DrawerNavigationProp } from '@react-navigation/drawer';
import UserProfile from 'assets/img/user-profile.svg';
import SOS from 'assets/img/sos.svg';
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
import { RFValue } from 'react-native-responsive-fontsize';

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

  const goToAccountScreen = () => {
    navigation.navigate('Account');
  };

  return (
    <View
      style={[
        styles.shadowContainer,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: RFValue(12),
          width: WINDOW_WIDTH,
          zIndex: 1,
        },
      ]}>
      <TouchableOpacity onPress={goToAccountScreen} style={styles.drawerIcon}>
        <UserProfile
          width={RFValue(26)}
          height={RFValue(26)}
          style={{ marginTop: -RFValue(8) }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={call}>
        <SOS style={{ width: RFValue(20), height: RFValue(20) }} />
      </TouchableOpacity>
    </View>
  );
};
export default HeaderMap;
