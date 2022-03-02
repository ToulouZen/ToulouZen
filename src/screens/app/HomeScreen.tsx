import BottomSheet from '@gorhom/bottom-sheet';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { styles } from 'common/styles/styles';
import {
  Checkpoint,
  Path,
  Region,
  RootStackParamsList,
} from 'common/types/types';
import HeaderMap from 'components/HeaderMap';
import Map from 'components/Map';
import NavigationComponent from 'components/NavigationComponent';
import PathsComponent from 'components/PathsComponent';
import { DONE, DRIVER, PASSENGER } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';

type Props = DrawerScreenProps<RootStackParamsList, 'Home'>;

const HomeScreen: FC<Props> = ({ navigation }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [checkpointSelected, setCheckpointSelected] = useState<Checkpoint>();
  const [showCheckpointCard, setShowCheckpointCard] = useState<boolean>(false);
  const [isHeaderVisible, setHeaderVisible] = useState<boolean>(true);
  const [checkpointToGo, setCheckpointToGo] = useState<Checkpoint>();
  const [region, setRegion] = useState<Region>({
    latitude: 43.604652,
    longitude: 1.444209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [durationPath, setDurationPath] = useState<number>(0);
  const [distancePath, setDistancePath] = useState<number>(0);
  const [passengerPosition, setPassengerPosition] = useState<Checkpoint>();

  const snapPoints = useMemo(() => ['35%', '100%'], []);

  const auth = useAuth();
  const firestore = useFirestore();

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

  const handleRegion = (checkpoint: Checkpoint) => {
    setRegion({
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const goTo = (checkpoint: Checkpoint) => {
    console.log('Go to :', checkpoint);
    setCheckpointToGo(checkpoint);
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
    setHeaderVisible(!(fromIndex === 0 && toIndex === 1));
  }, []);

  const handleSheetChanges = (index: number) => {
    setHeaderVisible(index !== 1);
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
        region={region}
        getInfoPath={getInfoPath}
        passengerPosition={passengerPosition}
      />
      {auth?.userInfo?.userType === PASSENGER && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onAnimate={handleOnAnimate}
          onChange={handleSheetChanges}>
          <NavigationComponent
            handleRegion={handleRegion}
            goTo={goTo}
            distance={distancePath}
            duration={durationPath}
          />
        </BottomSheet>
      )}
      {auth?.userInfo?.userType === DRIVER && (
        <PathsComponent handlePath={handlePath} navigation={navigation} />
      )}
    </View>
  );
};

export default HomeScreen;
