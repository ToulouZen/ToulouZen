import { DrawerScreenProps } from '@react-navigation/drawer';
import ArrowBack from 'assets/img/arrow-left.svg';
import BubbleToulouzenLogo from 'assets/img/bubble-logo-toulouzen.svg';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { COLORS } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import I18n from 'internationalization';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleAuthErrors } from 'utils/utils';

type Props = DrawerScreenProps<RootStackParamsList, 'Account'>;

export const AccountScreen: FC<Props> = ({ navigation }) => {
  const auth = useAuth();

  const goToPersonnalAccountSettings = () => navigation.navigate('Settings');
  const goToPreviousPaths = () => navigation.navigate('Paths');
  const goBack = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home');
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        auth.getUserInfo();
      })
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthApp' }],
        });
      })
      .catch(e => {
        handleAuthErrors(e);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'column',
          },
        ]}>
        <View
          style={{
            flex: 3.5,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity onPress={goBack} activeOpacity={0.4}>
            <ArrowBack
              width={RFValue(24)}
              height={RFValue(24)}
              style={{ marginLeft: RFValue(24), marginTop: RFValue(24) }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <BubbleToulouzenLogo
              width={RFValue(58)}
              height={RFValue(58)}
              style={{ marginLeft: RFValue(24), marginRight: RFValue(16) }}
            />
            <View>
              <Text style={[styles.text, { paddingBottom: RFValue(8) }]}>
                {`${auth?.userInfo?.firstname} ${auth?.userInfo?.lastname}`}
              </Text>
              <Text style={styles.text}>{auth?.userInfo?.mail}</Text>
            </View>
          </View>
          <View style={{ height: RFValue(72), marginBottom: RFValue(8) }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <CardMenu
                title="Informations personnelles"
                onPress={goToPersonnalAccountSettings}
              />
              <CardMenu title="Courses" onPress={goToPreviousPaths} />
              <CardMenu title="Favoris" />
              <CardMenu title="Moyens de paiement" />
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            flex: 5.5,
            backgroundColor: COLORS.backgroundSurface,
            paddingTop: RFValue(16),
          }}>
          <MenuItem title={I18n.t('general.drawer_menu.settings')} />
          <MenuItem title={'Aide'} />
          <MenuItem title={'À propos de Toulou’Zen'} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.backgroundSurface,
            justifyContent: 'center',
          }}>
          <TouchableOpacity activeOpacity={0.7} onPress={logout}>
            <Text
              style={[
                styles.subTitle,
                {
                  color: COLORS.primaryColor,
                  marginLeft: RFValue(48),
                },
              ]}>
              {I18n.t('common.logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const CardMenu = ({ title = '', onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: RFValue(16),
          backgroundColor: COLORS.primaryColor,
          borderRadius: 8,
          margin: RFValue(8),
          width: RFValue(124),
          justifyContent: 'center',
        }}>
        <Text
          style={[
            styles.text,
            { color: COLORS.whiteText, textAlign: 'center' },
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MenuItem = ({ title = '', onPress = () => {} }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={onPress}
      style={{
        paddingVertical: RFValue(16),
        borderBottomWidth: 0.5,
        borderBottomColor: '#00000066',
      }}>
      <Text style={[styles.subTitle, { marginLeft: RFValue(24) }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
