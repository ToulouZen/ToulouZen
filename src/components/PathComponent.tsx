import { styles } from 'common/styles/styles';
import { Path } from 'common/types/types';
import { COLORS, DONE, WINDOW_WIDTH } from 'constants/Constants';
import { useFirestore } from 'contexts/FirestoreContext';
import I18n from 'internationalization';
import moment from 'moment';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Icon } from 'react-native-elements';

type Props = {
  path: Path;
  index: number;
  isPassenger?: boolean;
  pathPicked?: Path;
};

const PathComponent: React.FC<Props> = ({ path, isPassenger, pathPicked }) => {
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);

  const firestore = useFirestore();

  const date = moment().format('YYYY-MM-DD');

  const deletePath = () => {
    Alert.alert(
      I18n.t('ride.cancel_ride_dialog.title'),
      I18n.t('ride.cancel_ride_dialog.description'),
      [
        {
          text: I18n.t('common.yes_cancel'),
          onPress: () => firestore.deletePath(path.id),
        },
        {
          text: I18n.t('common.no'),
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.containerPadding,
        styles.shadowContainer,
        styles.containerMargin,
        {
          backgroundColor: '#fff',
          borderRadius: 15,
          borderColor: path === pathPicked ? COLORS.peach : undefined,
          borderWidth: path === pathPicked ? 2 : undefined,
        },
      ]}>
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.container, styles.containerPadding]}>
          <Text style={{ fontSize: WINDOW_WIDTH * 0.06, fontWeight: 'bold' }}>
            {isPassenger ? I18n.t('common.me') : path.userFirstname}
          </Text>
          <Text
            style={{
              fontSize: WINDOW_WIDTH * 0.05,
              fontWeight: '500',
              color: COLORS.bluePrimary,
            }}>
            {path.dateDeparture !== date
              ? I18n.t('ride.ride_datetime', {
                  date: moment(path.dateDeparture).format('DD/MM/YYYY'),
                  time: moment(path.timeDeparture).format('HH:mm'),
                })
              : I18n.t('ride.ride_time', {
                  time: moment(path.timeDeparture).format('HH:mm'),
                })}
          </Text>
        </View>
        <View
          style={[
            styles.containerPadding,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          {isPassenger &&
            path.state !== DONE &&
            path.dateDeparture === moment().format('YYYY-MM-DD') && (
              <TouchableOpacity
                onPress={() => deletePath()}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="close"
                  type="ionicon"
                  size={WINDOW_WIDTH * 0.08}
                  color={COLORS.peach}
                />
                <Text
                  style={{
                    fontSize: WINDOW_WIDTH * 0.04,
                    fontWeight: '400',
                    color: COLORS.peach,
                  }}>
                  {I18n.t('common.cancel')}
                </Text>
              </TouchableOpacity>
            )}
          <Text style={{ fontSize: WINDOW_WIDTH * 0.06, fontWeight: 'bold' }}>
            {(path.distance * 1.05).toFixed(2)} €
          </Text>
        </View>
      </View>
      {isPassenger && (
        <>
          <Collapsible collapsed={isCollapsed}>
            <View style={styles.containerPadding}>
              <Text
                style={{ fontSize: WINDOW_WIDTH * 0.05, fontWeight: '500' }}>
                {I18n.t('ride.departure', {
                  departure: isPassenger
                    ? I18n.t('ride.my_current_location')
                    : path.departureDestination.name,
                })}
              </Text>
              <Text
                style={{ fontSize: WINDOW_WIDTH * 0.05, fontWeight: '500' }}>
                {I18n.t('ride.arrival', {
                  arrival:
                    path.arrivalDestination != null
                      ? path.arrivalDestination.name
                      : 'Narnia',
                })}
              </Text>
            </View>
          </Collapsible>
          <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
            <Icon
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              type="ionicon"
              size={WINDOW_WIDTH * 0.08}
              color={COLORS.peach}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PathComponent;
