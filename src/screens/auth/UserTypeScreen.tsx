import { StackScreenProps } from '@react-navigation/stack';
import ToulouZenLogo from 'assets/img/logo-toulouzen.svg';
import ToulouZenCurve from 'assets/img/toulouzen-curve.svg';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { COLORS, DRIVER, PASSENGER, WINDOW_WIDTH } from 'constants/Constants';
import I18n from 'internationalization';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = StackScreenProps<RootStackParamsList, 'UserType'>;

const UserTypeScreen: FC<Props> = ({ navigation }) => {
  const goToDriverSignUp = () => {
    navigation.navigate('Signup', { userType: DRIVER });
  };

  const goToPassengerSignUp = () => {
    navigation.navigate('Signup', { userType: PASSENGER });
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ToulouZenLogo
        width={WINDOW_WIDTH * 0.7}
        height={100}
        style={styles.logoHeader}
      />
      <ToulouZenCurve
        style={{ marginTop: -50 }}
        width={WINDOW_WIDTH}
        height={175}
      />
      <View style={[styles.container, { marginTop: WINDOW_WIDTH * 0.12 }]}>
        <View style={styles.authViewContainer}>
          <Text style={[styles.logTitle, styles.containerMargin]}>
            {I18n.t('auth.user_type.i_am')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={goToDriverSignUp}
          style={styles.userTypeButton}>
          <Text style={styles.userTypeTextButton}>
            {I18n.t('auth.user_type.driver')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToPassengerSignUp}
          style={[
            styles.userTypeButton,
            { backgroundColor: COLORS.primaryColor },
          ]}>
          <Text style={[styles.userTypeTextButton, { color: COLORS.white }]}>
            {I18n.t('auth.user_type.passenger')}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={goBack}
        style={[
          styles.userTypeButton,
          {
            width: WINDOW_WIDTH * 0.4,
            padding: WINDOW_WIDTH * 0.02,
            marginBottom: 40,
          },
        ]}>
        <Text style={styles.userTypeTextButton}>{I18n.t('common.cancel')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserTypeScreen;
