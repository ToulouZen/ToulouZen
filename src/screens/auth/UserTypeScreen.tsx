import { StackScreenProps } from '@react-navigation/stack';
import ToulouZenLogo from 'assets/img/logo-toulouzen.svg';
import ToulouZenCurve from 'assets/img/toulouzen-curve.svg';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { COLORS, PASSENGER, WINDOW_WIDTH } from 'constants/Constants';
import I18n from 'internationalization';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = StackScreenProps<RootStackParamsList, 'UserType'>;

const UserTypeScreen: FC<Props> = ({ navigation }) => {
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
          onPress={() => navigation.navigate('Signup', { userType: 'driver' })}
          style={[
            styles.logButtons,
            styles.containerMargin,
            { backgroundColor: COLORS.lightGrey },
          ]}>
          <Text style={styles.userTypeTextConductrice}>
            {I18n.t('auth.user_type.driver')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup', { userType: PASSENGER })}
          style={[styles.logButtons, styles.containerMargin]}>
          <Text style={styles.userTypeTextConductrice}>
            {I18n.t('auth.user_type.passenger')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserTypeScreen;
