import { StackScreenProps } from '@react-navigation/stack';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { useAuth } from 'contexts/AuthContext';
import I18n from 'internationalization';
import React, { FC, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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

  const onEmailChange = (newValue: string) => setMail(newValue);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <View style={[styles.authViewContainer]}>
          <ScrollView>
            <Text
              style={[
                styles.logTitle,
                styles.containerMargin,
                {
                  textAlign: 'center',
                },
              ]}>
              {I18n.t('auth.reset_password.title')?.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.text,
                {
                  marginTop: RFValue(32),
                  textAlign: 'center',
                },
              ]}>
              {I18n.t('auth.reset_password.description')}
            </Text>
            <TextInput
              value={mail}
              keyboardType="email-address"
              onChangeText={onEmailChange}
              placeholder={I18n.t('auth.email')}
              style={[
                styles.logInputs,
                styles.logInputText,
                styles.containerMargin,
                { padding: RFValue(14), marginTop: RFValue(24) },
              ]}
            />
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={reset}
          style={[
            styles.logButtons,
            mail.length === 0 ? styles.disabled : styles.logButtons,
            styles.containerMargin,
            {
              height: 56,
            },
          ]}
          disabled={mail.length === 0}>
          <Text style={[styles.buttonText, { textAlign: 'center' }]}>
            {I18n.t('auth.reset_password.action')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordResetScreen;
