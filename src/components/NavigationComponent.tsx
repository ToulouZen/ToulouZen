import { Picker } from '@react-native-picker/picker';
import ArrowDown from 'assets/img/arrow-down.svg';
import CheckmarkCircle from 'assets/img/checkmark-circle.svg';
import Circle from 'assets/img/circle.svg';
import Clock from 'assets/img/clock.svg';
import Marker from 'assets/img/marker.svg';
import Star from 'assets/img/star.svg';
import { styles } from 'common/styles/styles';
import { Checkpoint } from 'common/types/types';
import { COLORS, DONE, WINDOW_HEIGHT, WINDOW_WIDTH } from 'constants/Constants';
import { useFirestore } from 'contexts/FirestoreContext';
import { useLocationContext } from 'contexts/LocationContext';
import I18n from 'internationalization';
import { getCheckPointFromAddress } from 'networking/adressToLocation';
import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import AutoCompletePlace from './autoCompletePlace/AutoCompletePlace';

type Props = {
  handleRegion: (checkpoint: Checkpoint) => void;
  goTo: (checkpoint: Checkpoint) => void;
  distance?: number;
  duration?: number;
};

const TIMES = [
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
];

const NavigationComponent: FC<Props> = ({ goTo }) => {
  const firestore = useFirestore();
  const { userLocation } = useLocationContext();

  const [departureDestination, setDepartureDestination] = useState<Checkpoint>({
    name: I18n.t('ride.current_location'),
    ...userLocation,
  });
  const [arrivalDestination, setArrivalDestination] = useState<Checkpoint>({
    name: '',
    latitude: 43.635087,
    longitude: 1.39703,
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPosition, setIsPosition] = useState<boolean>(false);
  const [isTime, setIsTime] = useState<boolean>(false);
  const [timeDeparture, setTimeDeparture] = useState<string>(
    I18n.t('common.now'),
  );

  // useEffect(() => {
  //   if (arrivalDestination != undefined) {
  //     handleRegion(arrivalDestination);
  //   }
  // }, [arrivalDestination]);

  // useEffect(() => {
  //   reset();
  // }, [firestore.actualPath]);

  const reset = () => {
    setArrivalDestination({ name: '', latitude: 0, longitude: 0 });
    setTimeDeparture(I18n.t('common.now'));
  };

  const finishPath = () => {
    Alert.alert(
      I18n.t('ride.end_ride_dialog.title'),
      I18n.t('ride.end_ride_dialog.title'),
      [
        {
          text: I18n.t('ride.end_ride_dialog.positive_button'),
          onPress: () => firestore.endPath(),
        },
        {
          text: I18n.t('ride.end_ride_dialog.negative_button'),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={{
        width: WINDOW_WIDTH,
        height:
          firestore.actualPath === undefined ||
          firestore?.actualPath?.state === DONE
            ? WINDOW_HEIGHT * 0.4
            : WINDOW_HEIGHT * 0.2,
        backgroundColor: COLORS.white,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
      }}>
      <Modal isVisible={isVisible}>
        <View style={{ backgroundColor: COLORS.white, paddingVertical: 32 }}>
          {isPosition && (
            <Picker
              style={{ width: WINDOW_WIDTH * 0.9 }}
              selectedValue={arrivalDestination?.name}
              onValueChange={(itemValue: string) => {
                const index = firestore.checkPoints.findIndex(
                  checkpoint => checkpoint.name === itemValue,
                );
                goTo(firestore.checkPoints[index]);
                setArrivalDestination(firestore.checkPoints[index]);
              }}>
              <Picker.Item
                key={I18n.t('common.none')}
                label={I18n.t('common.none')}
                value={I18n.t('common.none')}
              />
              {firestore.checkPoints.map((checkpoint: Checkpoint) => (
                <Picker.Item
                  key={checkpoint.name}
                  label={checkpoint.name}
                  value={checkpoint.name}
                />
              ))}
            </Picker>
          )}
          {isTime && (
            <Picker
              style={{ width: WINDOW_WIDTH * 0.9 }}
              selectedValue={timeDeparture}
              onValueChange={(itemValue: string) => {
                setTimeDeparture(itemValue);
              }}>
              <Picker.Item
                key={I18n.t('common.now')}
                label={I18n.t('common.now')}
                value={I18n.t('common.now')}
              />
              {TIMES.map((value: string) => (
                <Picker.Item key={value} label={value} value={value} />
              ))}
            </Picker>
          )}
          <TouchableOpacity
            style={styles.center}
            onPress={() => {
              if (isPosition) {
                setIsPosition(false);
              }
              if (isTime) {
                setIsTime(false);
              }
              setIsVisible(false);
            }}>
            <CheckmarkCircle
              height={WINDOW_WIDTH * 0.1}
              width={WINDOW_WIDTH * 0.1}
              fill="#52ad8d"
            />
          </TouchableOpacity>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingTop: 8,
        }}>
        {firestore.actualPath === undefined ||
        firestore?.actualPath?.state === DONE ? (
          <>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                height: WINDOW_WIDTH * 0.16,
                width: WINDOW_WIDTH * 0.1,
                position: 'absolute',
                paddingTop: WINDOW_WIDTH * 0.08,
              }}>
              {/* icon + divider + point */}
              <Marker
                width={WINDOW_WIDTH * 0.06}
                height={WINDOW_WIDTH * 0.06}
              />
              <View
                style={{ height: 30, width: 1, backgroundColor: COLORS.peach }}
              />
              <Circle
                height={WINDOW_WIDTH * 0.03}
                width={WINDOW_WIDTH * 0.03}
                fill={COLORS.green}
              />
            </View>
            <View>
              <TextInput
                editable={false}
                style={[
                  styles.containerMargin,
                  styles.containerPadding,
                  styles.inputAddress,
                ]}
                placeholder={I18n.t('ride.current_location')}
                value={departureDestination.name}
                onChangeText={value =>
                  setDepartureDestination({
                    ...departureDestination,
                    name: value,
                  })
                }
              />
              <AutoCompletePlace
                style={[
                  styles.containerMargin,
                  styles.containerPadding,
                  styles.inputAddress,
                ]}
                placeholder={I18n.t('ride.end_ride_location')}
                value={arrivalDestination?.name}
                onChangeText={value =>
                  setArrivalDestination({
                    ...arrivalDestination,
                    name: value,
                  })
                }
              />
              <View style={{ width: WINDOW_WIDTH * 0.7, alignSelf: 'center' }}>
                <TouchableOpacity
                  style={[
                    styles.containerMargin,
                    styles.startButton,
                    { padding: WINDOW_WIDTH * 0.01 },
                  ]}
                  onPress={() => {
                    setIsTime(true);
                    setIsVisible(true);
                  }}>
                  <Clock
                    height={WINDOW_WIDTH * 0.06}
                    width={WINDOW_WIDTH * 0.06}
                    fill={COLORS.peach}
                  />
                  <Text
                    style={{
                      color: COLORS.peach,
                      fontSize: RFValue(14),
                    }}>
                    {timeDeparture}
                  </Text>
                  <ArrowDown
                    width={WINDOW_WIDTH * 0.06}
                    height={WINDOW_WIDTH * 0.06}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  const newArrivalDestination = await getCheckPointFromAddress({
                    address: arrivalDestination.name,
                  });
                  if (newArrivalDestination) {
                    setArrivalDestination(newArrivalDestination);
                    goTo(newArrivalDestination);
                  }
                }}
                style={[
                  styles.logButtons,
                  arrivalDestination === undefined ||
                  departureDestination === undefined
                    ? styles.disabled
                    : styles.logButtons,
                  styles.containerMargin,
                ]}
                disabled={
                  arrivalDestination === undefined ||
                  departureDestination === undefined
                    ? true
                    : false
                }>
                <Text style={styles.userTypeTextPassagere}>
                  {I18n.t('ride.find_my_driver')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : firestore.actualPath.pickedBy.userId == null ? (
          <View style={{ alignItems: 'center', height: WINDOW_HEIGHT * 0.2 }}>
            <Text
              style={[
                styles.containerMargin,
                {
                  color: COLORS.peach,
                  fontSize: WINDOW_WIDTH * 0.06,
                  fontWeight: 'bold',
                },
              ]}>
              {I18n.t('ride.wait_to_be_taken')}
            </Text>
            <ActivityIndicator size="large" style={styles.containerMargin} />
          </View>
        ) : (
          <View style={{ alignItems: 'center', height: WINDOW_HEIGHT * 0.2 }}>
            <Text
              style={{
                color: COLORS.peach,
                fontSize: WINDOW_WIDTH * 0.06,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {I18n.t('ride.is_on_the_way', {
                driver: firestore.actualPath.pickedBy.userFirstname,
              })}
            </Text>
            <TouchableOpacity
              onPress={() => finishPath()}
              style={[
                styles.logButtons,
                styles.containerMargin,
                {
                  backgroundColor: COLORS.bluePrimary,
                  borderColor: undefined,
                  borderWidth: undefined,
                },
              ]}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: WINDOW_WIDTH * 0.06,
                  fontWeight: 'bold',
                }}>
                {I18n.t('ride.end_ride')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {firestore.actualPath === undefined ||
        (firestore?.actualPath?.state === DONE && (
          <View
            style={[
              styles.containerPadding,
              { backgroundColor: 'rgba(230,230,230,0.5)', flex: 1 },
            ]}>
            <TouchableOpacity
              style={[
                styles.containerPadding,
                { flexDirection: 'row', alignItems: 'center' },
              ]}>
              <Star width={WINDOW_WIDTH * 0.08} height={WINDOW_WIDTH * 0.08} />
              <Text
                style={{
                  fontSize: WINDOW_WIDTH * 0.05,
                  marginLeft: WINDOW_WIDTH * 0.05,
                  color: COLORS.bluePrimary,
                }}>
                {I18n.t('ride.saved_destinations')}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
};

export default NavigationComponent;
