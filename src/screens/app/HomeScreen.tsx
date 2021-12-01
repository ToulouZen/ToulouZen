import { useIsFocused } from '@react-navigation/core';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Region } from 'react-native-maps';
import CheckpointCard from 'components/CheckpointCard';
import HeaderMap from 'components/HeaderMap';
// Map
import Map from 'components/Map';
import NavigationComponent from 'components/NavigationComponent';
import PathsComponent from 'components/PathsComponent';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import { styles } from 'common/styles/styles';
import { Checkpoint, Path, RootStackParamsList } from 'common/types/types';
import { DONE, DRIVER, PASSENGER } from 'constants/Constants';

type Props = DrawerScreenProps<RootStackParamsList, 'Home'>;

const HomeScreen: FC<Props> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [checkpointSelected, setCheckpointSelected] = useState<Checkpoint>();
  const [showCheckpointCard, setShowCheckpointCard] = useState<boolean>(false);
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
  }, [isFocused, auth?.userInfo?.userType]);

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

  return (
    <View style={styles.container}>
      <Map
        handleCard={handleCard}
        closeCard={closeCard}
        destination={checkpointToGo}
        region={region}
        getInfoPath={getInfoPath}
        passengerPosition={passengerPosition}
      />
      <View style={{ position: 'absolute', top: 0 }}>
        <HeaderMap navigation={navigation} />
        {showCheckpointCard && (
          <CheckpointCard checkpoint={checkpointSelected!} goTo={goTo} />
        )}
      </View>
      {auth?.userInfo?.userType === PASSENGER && (
        <NavigationComponent
          handleRegion={handleRegion}
          goTo={goTo}
          distance={distancePath}
          duration={durationPath}
        />
      )}
      {auth?.userInfo?.userType === DRIVER && (
        <PathsComponent handlePath={handlePath} navigation={navigation} />
      )}
    </View>
  );
};

export default HomeScreen;
