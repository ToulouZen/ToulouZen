import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { FC, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderMap from 'components/HeaderMap';
import { WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import I18n from 'internationalization';
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
  const [ageText, setAgeText] = useState<string>(
    auth.userInfo!.age!.toString(),
  );
  const [mailText, setMailText] = useState<string>(auth.userInfo!.mail!);
  const [userTypeText, setUserTypeText] = useState<string>(
    auth.userInfo!.userType!,
  );
  const [buttonTitle, setButtonTitle] = useState<string>(I18n.t('common.save'));
  const [disableButton, setDisableButton] = useState<boolean>(true);

  useEffect(() => {
    getButtonTitle();
  }, [firstnameText, lastnameText, ageText, mailText, auth.userInfo]);

  const getButtonTitle = () => {
    const { firstname, lastname, age, mail } = auth.userInfo!;
    setDisableButton(true);
    if (
      firstname != firstnameText ||
      lastname != lastnameText ||
      age!.toString() != ageText ||
      mail != mailText
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
      Number(ageText),
      userTypeText,
    );
  };

  return (
    <View style={styles.container}>
      <HeaderMap navigation={navigation} />
      <ScrollView style={styles.container} bounces={false}>
        <View style={styles.container}>
          <TextInput
            value={lastnameText}
            onChangeText={lastname => setLastnameText(lastname)}
            placeholder={I18n.t('auth.lastName')}
            style={[
              styles.logInputs,
              {
                padding: RFValue(14),
                marginVertical: RFValue(14),
              },
            ]}
          />
          <TextInput
            value={firstnameText}
            onChangeText={firstname => setFirstnameText(firstname)}
            placeholder={I18n.t('auth.firstName')}
            style={[
              styles.logInputs,
              {
                padding: RFValue(14),
                marginVertical: RFValue(14),
              },
            ]}
          />
          <TextInput
            value={ageText}
            onChangeText={age => setAgeText(age)}
            placeholder={I18n.t('auth.age')}
            style={[
              styles.logInputs,
              {
                padding: RFValue(14),
                marginVertical: RFValue(14),
              },
            ]}
            keyboardType="numeric"
          />
          <TextInput
            value={mailText}
            keyboardType="email-address"
            onChangeText={mail => setMailText(mail)}
            placeholder={I18n.t('auth.email')}
            style={[
              styles.logInputs,
              {
                padding: RFValue(14),
                marginVertical: RFValue(14),
              },
            ]}
          />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              disabled={disableButton}
              onPress={() => updateUser()}
              style={[
                styles.logButtons,
                disableButton ? styles.disabled : styles.logButtons,
                styles.containerMargin,
              ]}>
              <Text style={styles.userTypeTextConductrice}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
