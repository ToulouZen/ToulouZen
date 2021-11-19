import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from 'common/styles/styles';
import { COLORS, PASSENGER, WINDOW_WIDTH } from 'constants/Constants';
import { RootStackParamsList } from 'common/types/types';
import I18n from 'internationalization';

type Props = StackScreenProps<RootStackParamsList, 'UserType'>;

const UserTypeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logoHeader}
        source={require('../../assets/img/logo_toulouzen.png')}
        resizeMode="contain"
      />
      <Image
        style={{ width: WINDOW_WIDTH }}
        source={require('../../assets/img/Courbe.png')}
        resizeMode="contain"
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
