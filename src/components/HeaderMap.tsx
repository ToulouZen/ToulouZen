import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import {
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from 'common/styles/styles';
import { COLORS, WINDOW_WIDTH } from 'constants/Constants';
import { RootStackParamsList } from 'common/types/types';

type Props = {
  navigation: DrawerNavigationProp<
    RootStackParamsList,
    'Home' | 'Paths' | 'Settings'
  >;
};

const HeaderMap: React.FC<Props> = ({ navigation }) => {
  const _emergencyCall = async () => {
    let url = '';
    if (Platform.OS == 'android') {
      url = 'tel:17';
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Application Tarn Habitat',
            message:
              "Autorisez l'application Tarn Habitat à accéder au téléphone de l'appareil pour vous mettre en lien avec vos interlocteurs ?",
            buttonPositive: 'Ok',
            buttonNegative: 'Non',
            buttonNeutral: 'Plus tard',
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
    Alert.alert("Appel d'urgence", 'Vous vous sentez en danger ?', [
      {
        text: 'Oui',
        onPress: () => _emergencyCall(),
      },
      {
        text: 'Non',
      },
    ]);
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
        <Icon
          type="entypo"
          name="menu"
          size={WINDOW_WIDTH * 0.1}
          color={COLORS.white}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => call()}>
        <Image
          source={require('../assets/img/Button_SOS.png')}
          resizeMode="contain"
          style={{ width: WINDOW_WIDTH * 0.1, height: WINDOW_WIDTH * 0.1 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default HeaderMap;
