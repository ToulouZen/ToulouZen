import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from 'common/styles/styles';
import { WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { RootStackParamsList } from 'common/types/types';
import I18n from 'internationalization';
import ToulouZenLogo from 'assets/img/logo-toulouzen.svg';
import ToulouZenCurve from 'assets/img/toulouzen-curve.svg';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = StackScreenProps<RootStackParamsList, 'PasswordReset'>;

const PasswordResetScreen: FC<Props> = ({ navigation }) => {
  const [mail, setMail] = useState<string>('');
  const auth = useAuth();

  const reset = () => {
    Alert.alert(
      I18n.t('auth.reset_password.reset_password_dialog.title'),
      I18n.t('auth.reset_password.reset_password_dialog.description'),
      [
        {
          text: I18n.t('common.yes'),
          onPress: () => auth.resetPassword(mail, navigation),
        },
        {
          text: I18n.t('common.cancel'),
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
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
        <View style={styles.container}>
          <View style={styles.authViewContainer}>
            <Text style={[styles.logTitle, styles.containerMargin]}>
              {I18n.t('auth.reset_password.title')}
            </Text>
          </View>
          <View style={styles.container}>
            <TextInput
              value={mail}
              keyboardType="email-address"
              onChangeText={value => setMail(value)}
              placeholder={I18n.t('auth.email')}
              style={[
                styles.logInputs,
                styles.containerMargin,
                { padding: RFValue(14) },
              ]}
            />

            <TouchableOpacity
              onPress={() => reset()}
              style={[
                styles.logButtons,
                mail.length === 0 ? styles.disabled : styles.logButtons,
                styles.containerMargin,
              ]}
              disabled={mail.length === 0}>
              <Text style={styles.userTypeTextConductrice}>
                {I18n.t('auth.reset_password.action')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PasswordResetScreen;
