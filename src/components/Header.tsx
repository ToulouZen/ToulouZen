import ArrowBack from 'assets/img/arrow-left.svg';
import { styles } from 'common/styles/styles';
import { COLORS } from 'constants/Constants';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = {
  title: string;
  navigation: any;
};

export const Header: FC<Props> = ({ title, navigation }) => {
  const goBack = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home');

  return (
    <View
      style={{
        backgroundColor: COLORS.primaryColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: RFValue(18),
        paddingBottom: RFValue(18),
      }}>
      <TouchableOpacity onPress={goBack} activeOpacity={0.4}>
        <ArrowBack
          width={RFValue(24)}
          height={RFValue(24)}
          fill={COLORS.white}
          style={{
            marginLeft: RFValue(24),
          }}
        />
      </TouchableOpacity>
      <Text style={[styles.subTitle, { color: COLORS.white }]}>{title}</Text>
      <View
        style={{
          width: RFValue(24),
          height: RFValue(24),
          marginLeft: RFValue(24),
        }}
      />
    </View>
  );
};
