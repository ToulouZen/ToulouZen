import { StackScreenProps } from '@react-navigation/stack';
import ArrowDownCircle from 'assets/img/arrow-down-circle.svg';
import ArrowUpCircle from 'assets/img/arrow-up-circle.svg';
import ToulouZenLogo from 'assets/img/logo-toulouzen.svg';
import ToulouZenCurve from 'assets/img/toulouzen-curve.svg';
import { styles } from 'common/styles/styles';
import { Region, RootStackParamsList } from 'common/types/types';
import Map from 'components/Map';
import { COLORS, STARTED, WINDOW_WIDTH } from 'constants/Constants';
import { useFirestore } from 'contexts/FirestoreContext';
import I18n from 'internationalization';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

type Props = StackScreenProps<RootStackParamsList, 'DriverConfirm'>;

const DriverConfirmScreen: FC<Props> = ({ navigation }) => {
  const firestore = useFirestore();

  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 43.604652,
    longitude: 1.444209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (firestore.actualPath !== undefined) {
      setRegion({
        latitude: firestore.actualPath.arrivalDestination.latitude,
        longitude: firestore.actualPath.arrivalDestination.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [firestore.actualPath]);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: COLORS.white,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Modal
          // TODO: Must be fullscreen
          isVisible={modalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight">
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            <Map
              destination={firestore.actualPath?.arrivalDestination}
              region={region}
              passengerPosition={firestore.actualPath?.departureDestination}
            />
            <View style={{ position: 'absolute', bottom: 5 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ArrowDownCircle
                  height={WINDOW_WIDTH * 0.1}
                  width={WINDOW_WIDTH * 0.1}
                  fill="#52ad8d"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ToulouZenLogo
          width={WINDOW_WIDTH * 0.7}
          height={100}
          style={styles.logoHeader}
        />
        <ToulouZenCurve
          style={{ marginTop: -50 }}
          width={WINDOW_WIDTH}
          height={175}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={[styles.logTexts, { color: COLORS.peach }]}>
              {I18n.t('ride.ride_in_progress') + '\n'}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <Text
              style={[
                styles.logTexts,
                {
                  color: COLORS.peach,
                  textAlign: 'left',
                  width: '50%',
                  paddingLeft: 20,
                },
              ]}>
              {I18n.t('ride.departure', { departure: '' })}
            </Text>
            <Text
              style={[
                styles.logTexts,
                {
                  color: COLORS.blackBackground,
                  textAlign: 'left',
                  width: '50%',
                },
              ]}>
              {firestore.actualPath?.departureDestination.name}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <Text
              style={[
                styles.logTexts,
                {
                  color: COLORS.peach,
                  textAlign: 'left',
                  width: '50%',
                  paddingLeft: 20,
                },
              ]}>
              {I18n.t('ride.arrival', { arrival: '' })}
            </Text>
            <Text
              style={[
                styles.logTexts,
                {
                  color: COLORS.blackBackground,
                  textAlign: 'left',
                  width: '50%',
                },
              ]}>
              {firestore.actualPath?.arrivalDestination.name}
            </Text>
          </View>

          {firestore.actualPath?.state === STARTED && (
            <>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <Text
                  style={[
                    styles.logTexts,
                    { color: COLORS.peach, textAlign: 'center' },
                  ]}>
                  {I18n.t('driver_ride.wait_for_confirmation', {
                    firstName: firestore.actualPath?.userFirstname,
                    lastName: firestore.actualPath?.userLastname,
                  })}
                </Text>
              </View>
              <ActivityIndicator
                color="#52ad8d"
                style={{ marginTop: 50 }}
                size="large"
              />
            </>
          )}
          {firestore.actualPath?.state === 'DONE' && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home');
                firestore.resetActualPathId();
              }}
              style={[styles.logButtons, styles.containerMargin]}>
              <Text style={styles.userTypeTextConductrice}>
                {I18n.t('driver_ride.find_passenger')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ marginTop: 50 }}
            onPress={() => setModalVisible(true)}>
            <ArrowUpCircle
              height={WINDOW_WIDTH * 0.1}
              width={WINDOW_WIDTH * 0.1}
              fill="#52ad8d"
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default DriverConfirmScreen;
