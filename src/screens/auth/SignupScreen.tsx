import { StackScreenProps } from '@react-navigation/stack';
import PasswordHide from 'assets/img/password-hide.svg';
import PasswordShow from 'assets/img/password-show.svg';
import ToulouZenCurve from 'assets/img/toulouzen-sign-up-curve.svg';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { WINDOW_WIDTH } from 'constants/Constants';
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
import { handleAuthErrors } from 'utils/utils';

type Props = StackScreenProps<RootStackParamsList, 'Signup'>;

const SignupScreen: FC<Props> = ({ navigation, route }) => {
  const [firstname, setFirstname] = useState<string>('Angèle');
  const [lastname, setLastname] = useState<string>('Mazio');
  const [mail, setMail] = useState<string>('angele.mazio@gmail.com');
  const [password, setPassword] = useState<string>('passwordSpe');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState<string>('passwordSpe');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);

  const auth = useAuth();

  const signup = async () => {
    auth
      .register(mail, password, firstname, lastname, route.params.userType)
      .then(() => {
        auth.getUserInfo();
      })
      .then(() => {
        Alert.alert(
          I18n.t('auth.register.created_account_dialog.title'),
          I18n.t('auth.register.created_account_dialog.description'),
          [
            {
              text: I18n.t(
                'auth.register.created_account_dialog.positive_button',
              ),
              onPress: () => {
                navigation.navigate('LoggedApp');
              },
            },
          ],
        );
      })
      .catch(e => {
        handleAuthErrors(e);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <ToulouZenCurve
          style={{ position: 'absolute' }}
          width={WINDOW_WIDTH * 1.15}
          height={165}
        />
        <View style={[styles.authViewContainer, { marginTop: RFValue(48) }]}>
          <Text style={[styles.logTitle, styles.containerMargin]}>
            {I18n.t('auth.register.title')?.toUpperCase()}
          </Text>
        </View>
        <TextInput
          value={lastname}
          onChangeText={value => setLastname(value)}
          placeholder={I18n.t('auth.lastName')}
          style={[
            styles.logInputs,
            styles.logInputText,
            styles.containerMargin,
            { padding: RFValue(8) },
          ]}
        />
        <TextInput
          value={firstname}
          onChangeText={value => setFirstname(value)}
          placeholder={I18n.t('auth.firstName')}
          style={[
            styles.logInputs,
            styles.logInputText,
            styles.containerMargin,
            { padding: RFValue(8) },
          ]}
        />
        <TextInput
          value={mail}
          onChangeText={value => setMail(value)}
          placeholder={I18n.t('auth.email')}
          style={[
            styles.logInputs,
            styles.logInputText,
            styles.containerMargin,
            { padding: RFValue(8) },
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
            placeholder={I18n.t('auth.password')}
            style={[styles.logInputText, { padding: RFValue(8) }]}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ marginHorizontal: RFValue(8) }}>
            {showPassword ? (
              <PasswordHide width={RFValue(28)} height={RFValue(28)} />
            ) : (
              <PasswordShow width={RFValue(28)} height={RFValue(28)} />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.logInputs,
            styles.containerMargin,
            styles.horizontalContent,
          ]}>
          <TextInput
            value={passwordConfirmation}
            secureTextEntry={!showPasswordConfirm}
            onChangeText={value => setPasswordConfirmation(value)}
            placeholder={I18n.t('auth.confirm_password')}
            style={[styles.logInputText, { padding: RFValue(8) }]}
          />
          <TouchableOpacity
            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
            style={{ marginHorizontal: RFValue(8) }}>
            {showPasswordConfirm ? (
              <PasswordHide width={RFValue(28)} height={RFValue(28)} />
            ) : (
              <PasswordShow width={RFValue(28)} height={RFValue(28)} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => signup()}
            style={styles.userTypeButton}>
            <Text style={styles.userTypeTextButton}>
              {I18n.t('auth.register.action')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
