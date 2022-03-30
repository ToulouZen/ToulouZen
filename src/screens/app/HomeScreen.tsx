import BottomSheet from '@gorhom/bottom-sheet';
import { DrawerScreenProps } from '@react-navigation/drawer';
import BubbleToulouzenLogo from 'assets/img/bubble-logo-toulouzen.svg';
import HappyFace from 'assets/img/happy-face.svg';
import { styles } from 'common/styles/styles';
import { Checkpoint, Path, RootStackParamsList } from 'common/types/types';
import HeaderMap from 'components/HeaderMap';
import Map from 'components/Map';
import NavigationComponent from 'components/NavigationComponent';
import PathsComponent from 'components/PathsComponent';
import {
  COLORS,
  DONE,
  DRIVER,
  PASSENGER,
  WINDOW_WIDTH,
} from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import I18n from 'internationalization';
import moment from 'moment';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Keyboard, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = DrawerScreenProps<RootStackParamsList, 'Home'>;

const HomeScreen: FC<Props> = ({ navigation }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [checkpointSelected, setCheckpointSelected] = useState<Checkpoint>();
  const [showCheckpointCard, setShowCheckpointCard] = useState<boolean>(false);
  const [isHeaderVisible, setHeaderVisible] = useState<boolean>(true);
  const [checkpointToGo, setCheckpointToGo] = useState<Checkpoint>();
  const [showDriver, setShowDriver] = useState<GeoJSON.Position[]>([]);
  const [durationPath, setDurationPath] = useState<number>(0);
  const [distancePath, setDistancePath] = useState<number>(0);
  const [passengerPosition, setPassengerPosition] = useState<Checkpoint>();
  const [showConfirmRide, setShowConfirmRide] = useState<boolean>(false);
  const [followDriver, setFollowDriver] = useState<boolean>(false);

  const snapPoints = useMemo(() => ['35%', '50%', '100%'], []);

  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      bottomSheetRef.current?.expand();
    });

    return () => {
      showSubscription.remove();
    };
  }, []);

  useEffect(() => {
    firestore.getAllCheckpoints();
    if (auth?.userInfo?.userType == PASSENGER) {
      firestore.getPassengerPaths();
    }
    if (auth?.userInfo?.userType == DRIVER) {
      firestore.getDriverPaths();
      firestore.getPaths();
    }
  }, [auth?.userInfo?.userType]);

  useEffect(() => {
    if (
      auth?.userInfo?.userType == DRIVER &&
      firestore?.actualPath?.state != DONE
    ) {
      navigation.navigate('DriverConfirm');
    }
  }, [firestore.actualPath, auth?.userInfo?.userType]);

  const handleCard = (checkpoint: Checkpoint) => {
    setCheckpointSelected(checkpoint);
    setShowCheckpointCard(true);
  };
  const closeCard = () => {
    setCheckpointSelected(undefined);
    setShowCheckpointCard(false);
  };

  const goTo = (checkpoint: Checkpoint) => {
    bottomSheetRef.current?.snapToIndex(1);
    setCheckpointToGo(checkpoint);
    setShowDriver([
      [1.4169, 43.6103],
      [1.4373, 43.6041],
    ]);
  };

  const getInfoPath = (distance: number, duration: number) => {
    setDistancePath(distance);
    setDurationPath(duration);
  };

  const handlePath = (path: Path) => {
    setCheckpointToGo(path.arrivalDestination);
    setPassengerPosition(path.departureDestination);
  };

  const handleOnAnimate = useCallback((fromIndex: number, toIndex: number) => {
    setHeaderVisible(!(fromIndex === 0 && toIndex === 2));
  }, []);

  const handleSheetChanges = (index: number) => {
    setHeaderVisible(index !== 2);
  };

  return (
    <View style={styles.container}>
      {isHeaderVisible ? (
        <View style={{ position: 'absolute', top: 0 }}>
          <HeaderMap navigation={navigation} />
        </View>
      ) : null}
      <Map
        handleCard={handleCard}
        closeCard={closeCard}
        destination={checkpointToGo}
        getInfoPath={getInfoPath}
        passengerPosition={passengerPosition}
        showDriver={showDriver}
        shouldShowRouteFromDriverToDeparture={followDriver}
      />
      {auth?.userInfo?.userType === PASSENGER && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onAnimate={handleOnAnimate}
          onChange={handleSheetChanges}>
          {!showDriver.length ? (
            <NavigationComponent
              goTo={goTo}
              distance={distancePath}
              duration={durationPath}
            />
          ) : showConfirmRide ? (
            <ConfirmRide
              followDriver={() => {
                setFollowDriver(true);
                bottomSheetRef.current?.close();
              }}
            />
          ) : (
            <Driver
              reset={() => {
                setShowDriver([]);
              }}
              confirmRide={() => {
                setShowConfirmRide(true);
                bottomSheetRef.current?.expand();
              }}
            />
          )}
        </BottomSheet>
      )}
      {auth?.userInfo?.userType === DRIVER && (
        <PathsComponent handlePath={handlePath} navigation={navigation} />
      )}
    </View>
  );
};

const ConfirmRide = ({ followDriver }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={styles.subTitle}>{I18n.t('ride.ride_validated')}</Text>
      <HappyFace
        style={{ marginVertical: RFValue(16) }}
        width={WINDOW_WIDTH * 0.5}
        height={WINDOW_WIDTH * 0.5}
      />
      <TouchableOpacity
        onPress={followDriver}
        style={[
          styles.logButtons,
          {
            backgroundColor: '#7DB1AF',
            marginTop: 24,
            alignSelf: 'center',
            justifyContent: 'center',
            width: WINDOW_WIDTH * 0.6,
            padding: RFValue(8),
            height: RFValue(56),
          },
        ]}>
        <Text
          style={[
            styles.userTypeTextButton,
            { textAlign: 'center', color: COLORS.whiteText },
          ]}>
          {I18n.t('ride.follow_my_driver')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Driver = ({ reset, confirmRide }) => {
  const [selectedDriver, setSelectedDriver] = useState(-1);
  const [selectedPrice, setSelectedPrice] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <Text
        style={[
          styles.subTitle,
          {
            textAlign: 'center',
            color: '#AEBFBD',
            fontSize: RFValue(12),
            marginBottom: RFValue(12),
          },
        ]}>
        Toulouzens proche de vous
      </Text>
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            setSelectedDriver(1);
            setSelectedPrice(6.6);
          }}>
          <DriverItem
            isSelected={1 === selectedDriver}
            price={6.6}
            arrivedAt={moment().add(18, 'minutes').format('HH:mm')}
            name="Sarah"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            setSelectedDriver(2);
            setSelectedPrice(7.3);
          }}>
          <DriverItem
            isSelected={2 === selectedDriver}
            price={7.3}
            arrivedAt={moment().add(24, 'minutes').format('HH:mm')}
            name="Natacha"
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={reset}
          style={[
            styles.userTypeButton,
            {
              width: WINDOW_WIDTH * 0.4,
              padding: RFValue(8),
              height: RFValue(56),
            },
          ]}>
          <Text style={styles.userTypeTextButton}>
            {I18n.t('common.cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              confirmRide();
            }, 10000);
          }}
          style={[
            styles.logButtons,
            selectedDriver === -1 ? styles.disabled : styles.logButtons,
            {
              marginTop: 24,
              alignSelf: 'center',
              justifyContent: 'center',
              width: WINDOW_WIDTH * 0.4,
              padding: RFValue(8),
              height: RFValue(56),
            },
          ]}
          disabled={selectedDriver === -1}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.whiteText} />
          ) : (
            <Text
              style={[
                styles.userTypeTextButton,
                { textAlign: 'center', color: COLORS.whiteText },
              ]}>
              {I18n.t('ride.confirm_ride', {
                price: selectedPrice === -1 ? '' : `\n${selectedPrice} €`,
              })}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DriverItem = ({ isSelected, price, arrivedAt, name }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: isSelected ? '#F0F0F0' : '#FFFFFF',
      }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <BubbleToulouzenLogo
          width={RFValue(48)}
          height={RFValue(48)}
          style={{
            marginLeft: RFValue(24),
            marginRight: RFValue(16),
            marginVertical: RFValue(8),
          }}
        />
        <View>
          <Text style={[styles.subTitle, { paddingBottom: RFValue(8) }]}>
            {name}
          </Text>
          <Text
            style={[
              styles.text,
              { color: '#7DB1AF' },
            ]}>{`Dépose à ${arrivedAt}`}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.subTitle,
          { marginRight: RFValue(16) },
        ]}>{`${price} €`}</Text>
    </View>
  );
};

export default HomeScreen;
