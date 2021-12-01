import { StackScreenProps } from '@react-navigation/stack';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import I18n from 'internationalization';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { handleAuthErrors } from 'utils/utils';

type Props = StackScreenProps<RootStackParamsList, 'Login'>;
const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mail, setMail] = React.useState<string>('jeanne.dupont@gmail.com');
  const [password, setPassword] = React.useState<string>('password');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
              {I18n.t('auth.login.title')}
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
                style={styles.logPasswordInput}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ marginHorizontal: WINDOW_WIDTH * 0.02 }}>
                <Image
                  source={
                    showPassword
                      ? require('../../assets/img/Password_show.png')
                      : require('../../assets/img/Password_hide.png')
                  }
                  resizeMode="contain"
                  style={{
                    width: WINDOW_WIDTH * 0.08,
                    height: WINDOW_WIDTH * 0.08,
                    tintColor: COLORS.black,
                  }}
                />
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
              <Text
                style={[styles.logTexts, { textDecorationLine: 'underline' }]}>
                {I18n.t('auth.login.forgot_password')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => login()}
              style={[
                styles.logButtons,
                mail.length === 0 || password.length === 0
                  ? styles.disabled
                  : styles.logButtons,
                styles.containerMargin,
              ]}
              disabled={mail.length === 0 || password.length === 0}>
              <Text style={styles.userTypeTextConductrice}>
                {I18n.t('auth.login.login')}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignSelf: 'center',
                marginVertical: WINDOW_HEIGHT * 0.03,
              }}>
              <Text style={styles.logTexts}>
                {I18n.t('auth.login.login_with')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <TouchableOpacity>
                  <Image
                    source={require('../../assets/img/google.png')}
                    resizeMode="contain"
                    style={{
                      width: WINDOW_WIDTH * 0.07,
                      height: WINDOW_WIDTH * 0.07,
                      tintColor: COLORS.bluePrimary,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../assets/img/facebook.png')}
                    resizeMode="contain"
                    style={{
                      width: WINDOW_WIDTH * 0.07,
                      height: WINDOW_WIDTH * 0.07,
                      tintColor: COLORS.bluePrimary,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../assets/img/twitter.png')}
                    resizeMode="contain"
                    style={{
                      width: WINDOW_WIDTH * 0.07,
                      height: WINDOW_WIDTH * 0.07,
                      tintColor: COLORS.bluePrimary,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.container,
                { alignItems: 'center', justifyContent: 'center' },
              ]}>
              <Text style={styles.logTexts}>
                {I18n.t('auth.login.no_account')}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('UserType')}>
                <Text
                  style={[
                    styles.logTexts,
                    {
                      color: COLORS.peach,
                      textDecorationLine: 'underline',
                      fontSize: WINDOW_WIDTH * 0.055,
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
