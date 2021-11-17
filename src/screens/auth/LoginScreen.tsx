import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/core';
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
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { RootStackParamsList } from 'common/types/types';

type PropsView = {
  nav: StackScreenProps<RootStackParamsList, 'Login'>;
  focused: boolean;
};

const LoginScreenView: React.FC<PropsView> = ({ nav: { navigation } }) => {
  const [mail, setMail] = React.useState<string>('jeanne.dupont@gmail.com');
  const [password, setPassword] = React.useState<string>('password');
  const [switched, setSwitched] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const auth = useAuth();

  React.useEffect(() => {
    if (switched) {
      setToken();
    }
  }, [switched]);

  const setToken = async () => {
    await AsyncStorage.setItem('ToulouzenToken', 'autolog');
  };

  const reset = () => {
    setMail('');
    setPassword('');
  };

  const login = async () => {
    auth
      .signIn(mail, password)
      .then(() => {
        auth.getUserInfo();
      })
      .then(() => {
        navigation.navigate('App');
        reset();
      })
      .catch(e => {
        if (e.code == 'auth/user-not-found') {
          Alert.alert('Utilisateur', "Ce compte n'existe pas !");
        }
        if (e.code == 'auth/wrong-password') {
          Alert.alert('Mot de passe', 'Le mot de passe est incorrecte !');
        }
        if (e.code == 'auth/email-already-in-use') {
          Alert.alert(
            'Adresse e-mail',
            'Cette adresse e-mail est déjà utilisée !',
          );
        }
        if (e.code == 'auth/invalid-email') {
          Alert.alert('Adresse e-mail', 'Cette adresse e-mail est invalide !');
        }
        if (e.code == 'auth/weak-password') {
          Alert.alert(
            'Mot de passe',
            'Le mot de passe utilisé est trop faible, privilégiez 8 caractères au minimum, en ajoutant des chiffres, majuscules et caractères spéciaux',
          );
        }
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
          <View style={{ width: WINDOW_WIDTH * 0.85, alignSelf: 'center' }}>
            <Text style={[styles.logTitle, styles.containerMargin]}>
              Connexion
            </Text>
          </View>
          <View style={styles.container}>
            <TextInput
              value={mail}
              keyboardType="email-address"
              onChangeText={mail => setMail(mail)}
              placeholder="E-mail"
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
                { flexDirection: 'row' },
              ]}>
              <TextInput
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={password => setPassword(password)}
                placeholder="Mot de passe"
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
                Mot de passe oublié
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => login()}
              style={[
                styles.logButtons,
                mail.length == 0 || password.length == 0
                  ? styles.disabled
                  : styles.logButtons,
                styles.containerMargin,
              ]}
              disabled={mail.length == 0 || password.length == 0}>
              <Text style={[styles.userTypeTextConductrice, { color: '#fff' }]}>
                Me connecter
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignSelf: 'center',
                marginVertical: WINDOW_HEIGHT * 0.03,
              }}>
              <Text style={styles.logTexts}>ou me connecter avec</Text>
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
              <Text style={styles.logTexts}>Je n'ai pas de compte</Text>
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
                  {' '}
                  Je souhaite m'inscrire
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

type Props = StackScreenProps<RootStackParamsList, 'Login'>;
const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  return <LoginScreenView nav={{ navigation, route }} focused={isFocused} />;
};

export default LoginScreen;