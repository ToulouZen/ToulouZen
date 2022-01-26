import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useState } from 'react';
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
import { COLORS, WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { RootStackParamsList } from 'common/types/types';
import { handleAuthErrors } from 'utils/utils';
import I18n from 'internationalization';

type Props = StackScreenProps<RootStackParamsList, 'Signup'>;

const SignupScreen: FC<Props> = ({ navigation, route }) => {
  const [firstname, setFirstname] = useState<string>('Angèle');
  const [lastname, setLastname] = useState<string>('Mazio');
  const [age, setAge] = useState<string>('27');
  const [mail, setMail] = useState<string>('angele.mazio@gmail.com');
  const [password, setPassword] = useState<string>('passwordSpe');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState<string>('passwordSpe');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const auth = useAuth();

  const signup = async () => {
    auth
      .register(
        mail,
        password,
        firstname,
        lastname,
        Number(age),
        route.params.userType,
      )
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
        <Image
          style={{ width: WINDOW_WIDTH }}
          source={require('../../assets/img/Courbe.png')}
          resizeMode="contain"
        />
        <View style={styles.authViewContainer}>
          <Text style={[styles.logTitle, styles.containerMargin]}>
            {I18n.t('auth.register.title')}
          </Text>
        </View>
        <TextInput
          value={lastname}
          onChangeText={value => setLastname(value)}
          placeholder={I18n.t('auth.lastName')}
          style={[
            styles.logInputs,
            styles.containerMargin,
            { padding: WINDOW_WIDTH * 0.04 },
          ]}
        />
        <TextInput
          value={firstname}
          onChangeText={value => setFirstname(value)}
          placeholder={I18n.t('auth.firstName')}
          style={[
            styles.logInputs,
            styles.containerMargin,
            { padding: WINDOW_WIDTH * 0.04 },
          ]}
        />
        <TextInput
          value={age}
          onChangeText={value => setAge(value)}
          placeholder={I18n.t('auth.age')}
          style={[
            styles.logInputs,
            styles.containerMargin,
            { padding: WINDOW_WIDTH * 0.04 },
          ]}
          keyboardType="numeric"
        />
        <TextInput
          value={mail}
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
            placeholder={I18n.t('auth.password')}
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
        <View
          style={[
            styles.logInputs,
            styles.containerMargin,
            styles.horizontalContent,
          ]}>
          <TextInput
            value={passwordConfirmation}
            secureTextEntry={!showPassword}
            onChangeText={value => setPasswordConfirmation(value)}
            placeholder={I18n.t('auth.confirm_password')}
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
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => signup()}
            style={[styles.logButtons, styles.containerMargin]}>
            <Text style={styles.userTypeTextConductrice}>
              {I18n.t('auth.register.action')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
