import { StackScreenProps } from '@react-navigation/stack';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import Map from 'components/Map';
import { COLORS, WINDOW_WIDTH } from 'constants/Constants';
import { useFirestore } from 'contexts/FirestoreContext';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Region } from 'react-native-maps';

type Props = StackScreenProps<RootStackParamsList, 'DriverConfirm'>;

const DriverConfirmScreen: React.FC<Props> = ({ navigation }) => {
  const firestore = useFirestore();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [region, setRegion] = React.useState<Region>({
    latitude: 43.604652,
    longitude: 1.444209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  React.useEffect(() => {
    if (firestore.actualPath != undefined) {
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
        <Overlay isVisible={modalVisible} fullScreen animationType="slide">
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
              <Icon
                name="arrow-down-circle"
                type="ionicon"
                size={WINDOW_WIDTH * 0.1}
                color="#52ad8d"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Overlay>
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
              Trajet en cours... {'\n'}
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
              Départ :
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
              Arrivée :
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

          {firestore.actualPath?.state == 'STARTED' && (
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
                  En attente de la validation de{' '}
                  {firestore.actualPath?.userFirstname}{' '}
                  {firestore.actualPath?.userLastname}
                </Text>
              </View>
              <ActivityIndicator
                color="#52ad8d"
                style={{ marginTop: 50 }}
                size="large"
              />
            </>
          )}
          {firestore.actualPath?.state == 'DONE' && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home');
                firestore.resetActualPathId();
              }}
              style={[styles.logButtons, styles.containerMargin]}>
              <Text style={[styles.userTypeTextConductrice, { color: '#fff' }]}>
                Trouver un passager
              </Text>
            </TouchableOpacity>
          )}

          <Icon
            name="arrow-up-circle"
            type="ionicon"
            size={WINDOW_WIDTH * 0.1}
            color="#52ad8d"
            style={{ marginTop: 50 }}
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>
    </>
  );
};

export default DriverConfirmScreen;
