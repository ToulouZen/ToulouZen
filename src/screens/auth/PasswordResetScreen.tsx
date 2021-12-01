import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import {
  Alert,
  Image,
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

type Props = StackScreenProps<RootStackParamsList, 'PasswordReset'>;

const PasswordResetScreen: React.FC<Props> = ({ navigation }) => {
  const [mail, setMail] = React.useState<string>('');
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
                { padding: WINDOW_WIDTH * 0.04 },
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
