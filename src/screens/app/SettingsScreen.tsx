import { DrawerScreenProps } from '@react-navigation/drawer';
import PasswordHide from 'assets/img/password-hide.svg';
import PasswordShow from 'assets/img/password-show.svg';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { Header } from 'components/Header';
import { WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import I18n from 'internationalization';
import React, { FC, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = DrawerScreenProps<RootStackParamsList, 'Settings'>;

const SettingsScreen: FC<Props> = ({ navigation }) => {
  const auth = useAuth();

  const [firstnameText, setFirstnameText] = useState<string>(
    auth.userInfo!.firstname!,
  );
  const [lastnameText, setLastnameText] = useState<string>(
    auth.userInfo!.lastname!,
  );
  const [mailText, setMailText] = useState<string>(auth.userInfo!.mail!);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const [buttonTitle, setButtonTitle] = useState<string>(I18n.t('common.save'));
  const [disableButton, setDisableButton] = useState<boolean>(true);

  useEffect(() => {
    getButtonTitle();
  }, [firstnameText, lastnameText, mailText, auth.userInfo, password]);

  const getButtonTitle = () => {
    const { firstname, lastname, mail } = auth.userInfo!;
    setDisableButton(true);
    if (
      firstname !== firstnameText ||
      lastname !== lastnameText ||
      mail !== mailText ||
      password !== ''
    ) {
      setButtonTitle(I18n.t('common.save'));
      setDisableButton(false);
    }
  };

  const updateUser = () => {
    auth.updateUser(
      mailText,
      firstnameText,
      lastnameText,
      auth.userInfo!.userType!,
      password
    );
  };

  const onLastnameChange = (lastname: string) => setLastnameText(lastname);

  const onFirstNameChange = (firstName: string) => setFirstnameText(firstName);

  const onEmailChange = (email: string) => setMailText(email);

  return (
    <View style={styles.container}>
      <Header
        title={I18n.t('general.drawer_menu.personnal_info')}
        navigation={navigation}
      />
      <ScrollView style={styles.container} bounces={false}>
        <View style={[styles.container, { marginTop: RFValue(48) }]}>
          <TextInput
            value={lastnameText}
            onChangeText={onLastnameChange}
            placeholder={I18n.t('auth.lastName')}
            style={[
              styles.logInputs,
              styles.logInputText,
              styles.containerMargin,
              { padding: RFValue(14) },
            ]}
          />
          <TextInput
            value={firstnameText}
            onChangeText={onFirstNameChange}
            placeholder={I18n.t('auth.firstName')}
            style={[
              styles.logInputs,
              styles.logInputText,
              styles.containerMargin,
              { padding: RFValue(14) },
            ]}
          />
          <TextInput
            value={mailText}
            keyboardType="email-address"
            onChangeText={onEmailChange}
            placeholder={I18n.t('auth.email')}
            style={[
              styles.logInputs,
              styles.logInputText,
              styles.containerMargin,
              { padding: RFValue(14) },
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
              style={{ marginHorizontal: RFValue(8) }}>
              {showPassword ? (
                <PasswordHide width={RFValue(28)} height={RFValue(28)} />
              ) : (
                <PasswordShow width={RFValue(28)} height={RFValue(28)} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: RFValue(48) }}>
            <TouchableOpacity
              onPress={updateUser}
              style={[
                styles.logButtons,
                disableButton ? styles.disabled : styles.logButtons,
                styles.containerMargin,
                {
                  height: 56,
                },
              ]}
              disabled={disableButton}>
              <Text style={[styles.buttonText, { textAlign: 'center' }]}>
                {buttonTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
