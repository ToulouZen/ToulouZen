import ChevronRight from 'assets/img/chevron-right.svg';
import { styles } from 'common/styles/styles';
import { Path } from 'common/types/types';
import { WINDOW_WIDTH } from 'constants/Constants';
import I18n from 'internationalization';
import moment from 'moment';
import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = {
  path: Path;
};

const PathComponent: FC<Props> = ({ path }) => {
  const date = moment().format('YYYY-MM-DD');

  return (
    <View>
      <View
        style={{
          paddingVertical: RFValue(10),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{
              width: RFValue(56),
              height: RFValue(56),
              borderRadius: RFValue(56),
              marginLeft: RFValue(24),
              marginRight: RFValue(16),
            }}
            source={{
              uri: 'https://static.loungeup.com.loungeup.studio/20220317181343/img/people-icon.png',
            }}
          />

          <View>
            <Text style={[styles.subTitle, { paddingBottom: RFValue(8) }]}>
              {path.dateDeparture !== date
                ? I18n.t('ride.ride_datetime', {
                    date: moment(path.dateDeparture).format('DD/MM/YYYY'),
                    time: moment(path.timeDeparture).format('HH:mm'),
                  })
                : I18n.t('ride.ride_time', {
                    time: moment(path.timeDeparture).format('HH:mm'),
                  })}
            </Text>
            <Text style={[styles.text, { color: '#00000099' }]}>
              {I18n.t('ride.driver')}
              <Text
                style={
                  styles.text
                }>{`${path.pickedBy.userFirstname} ${path.pickedBy.userLastname}`}</Text>
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.subTitle}>
            {(path.distance * 1.05).toFixed(2)} €
          </Text>
          <ChevronRight
            style={{ marginHorizontal: RFValue(8), marginBottom: RFValue(4) }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: WINDOW_WIDTH,
          height: 0.5,
          backgroundColor: '#00000066',
        }}
      />
    </View>
  );
};

export default PathComponent;
