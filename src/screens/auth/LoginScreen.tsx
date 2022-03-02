import { StackScreenProps } from '@react-navigation/stack';
import FacebookIcon from 'assets/img/facebook.svg';
import GoogleIcon from 'assets/img/google.svg';
import ToulouZenLogo from 'assets/img/logo-toulouzen.svg';
import PasswordHide from 'assets/img/password-hide.svg';
import PasswordShow from 'assets/img/password-show.svg';
import ToulouZenCurve from 'assets/img/toulouzen-curve.svg';
import TwitterIcon from 'assets/img/twitter.svg';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import I18n from 'internationalization';
import React, { FC, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { handleAuthErrors } from 'utils/utils';

type Props = StackScreenProps<RootStackParamsList, 'Login'>;
const LoginScreen: FC<Props> = ({ navigation }) => {
  const [mail, setMail] = useState<string>('jeanne.dupont@gmail.com');
  const [password, setPassword] = useState<string>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const auth = useAuth();

  const reset = () => {
    setPassword('');
  };

  const login = async () => {
    auth
      .signIn(mail, password)
      .then(() => {
        auth.getUserInfo();
      })
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoggedApp' }],
        });
        reset();
      })
      .catch(e => {
        handleAuthErrors(e);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <ToulouZenLogo
          width={WINDOW_WIDTH * 0.7}
          height={50}
          style={[styles.logoHeader, { marginTop: 40 }]}
        />
        <ToulouZenCurve
          style={{ marginTop: -70 }}
          width={WINDOW_WIDTH}
          height={175}
        />
        <View style={styles.container}>
          <View style={styles.authViewContainer}>
            <Text
              style={[
                styles.logTitle,
                styles.containerMargin,
                { marginBottom: 20 },
              ]}>
              {I18n.t('auth.login.title')?.toUpperCase()}
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
                styles.logInputText,
                styles.containerMargin,
                { padding: WINDOW_WIDTH * 0.04 },
              ]}
            />
            <View
              style={[
                styles.logInputs,
                styles.containerMargin,
                styles.horizontalContent,
              ]}>
              <TextInput
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={value => setPassword(value)}
                placeholder={I18n.t('auth.login.password')}
                style={styles.logInputText}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ marginHorizontal: WINDOW_WIDTH * 0.02 }}>
                {showPassword ? (
                  <PasswordShow
                    width={WINDOW_WIDTH * 0.08}
                    height={WINDOW_WIDTH * 0.08}
                  />
                ) : (
                  <PasswordHide
                    width={WINDOW_WIDTH * 0.08}
                    height={WINDOW_WIDTH * 0.08}
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('PasswordReset')}
              style={[
                styles.containerMargin,
                {
                  width: WINDOW_WIDTH * 0.8,
                  alignSelf: 'center',
                  alignItems: 'flex-end',
                },
              ]}>
              <Text style={[styles.text, { borderBottomWidth: 0.5 }]}>
                {I18n.t('auth.login.forgot_password')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => login()}
              style={[
                styles.logButtons,
                styles.containerMargin,
                {
                  height: 56,
                },
              ]}
              disabled={mail.length === 0 || password.length === 0}>
              <Text style={[styles.buttonText, { textAlign: 'center' }]}>
                {I18n.t('auth.login.login')}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignSelf: 'center',
                marginVertical: WINDOW_HEIGHT * 0.03,
              }}>
              <Text style={[styles.text, { textAlign: 'center' }]}>
                {I18n.t('auth.login.login_with')}
              </Text>
              <View
                style={{
                  width: WINDOW_WIDTH * 0.4,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}>
                <TouchableOpacity>
                  <GoogleIcon width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FacebookIcon width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <TwitterIcon width={32} height={32} />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.container,
                { alignItems: 'center', justifyContent: 'center' },
              ]}>
              <Text style={[styles.text, styles.containerMargin]}>
                {I18n.t('auth.login.no_account')}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('UserType')}>
                <Text
                  style={[
                    styles.text,
                    styles.containerMargin,
                    {
                      color: COLORS.primaryColor,
                      borderColor: COLORS.primaryColor,
                      borderBottomWidth: 0.5,
                      paddingBottom: 4,
                    },
                  ]}>
                  {I18n.t('auth.login.create_an_account')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
