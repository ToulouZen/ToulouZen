import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Image, Platform, StyleSheet, View } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from 'constants/Constants';
import GetLocation from 'react-native-get-location';
import { useFirestore } from 'contexts/FirestoreContext';
import { Checkpoint } from 'common/types/types';
import { useAuth } from 'contexts/AuthContext';

const stylesCustom = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    justifyContent: 'space-between',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const GOOGLE_MAPS_API_KEY_IOS = 'AIzaSyCE-KihYba5ky6xGMyIidiT9p_jvDDEVV0';
const GOOGLE_MAPS_API_KEY_ANDROID = 'AIzaSyDQtHXsHSB3bclc637t5T6i3hTTZo44jAc';

type Props = {
  handleCard?: (checkpoint: Checkpoint) => void;
  closeCard?: () => void;
  destination?: Checkpoint;
  passengerPosition?: Checkpoint;
  region: Region;
  getInfoPath?: (distance: number, duration: number) => void;
};

const Map: React.FC<Props> = ({
  handleCard,
  closeCard,
  destination,
  region,
  getInfoPath,
  passengerPosition,
}) => {
  const [userLocation, setUserLocation] =
    React.useState<{ latitude: number; longitude: number }>();
  const [userLocationFound, setUserLocationFound] =
    React.useState<boolean>(false);

  const firestore = useFirestore();
  const auth = useAuth();

  React.useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        setUserLocationFound(true);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });
  };

  return (
    <View style={stylesCustom.container}>
      <MapView
        onPanDrag={() => (closeCard != undefined ? closeCard() : undefined)}
        showsPointsOfInterest={false}
        provider={PROVIDER_GOOGLE}
        style={stylesCustom.map}
        region={region}>
        {userLocationFound && (
          <Marker
            coordinate={{
              latitude: userLocation!.latitude,
              longitude: userLocation!.longitude,
            }}>
            <Image
              source={require('../assets/img/Localisation.png')}
              resizeMode="contain"
              style={{
                width: WINDOW_WIDTH * 0.1,
                height: WINDOW_WIDTH * 0.1,
                tintColor: COLORS.peach,
              }}
            />
          </Marker>
        )}
        {passengerPosition != undefined && (
          <Marker
            coordinate={{
              latitude: passengerPosition.latitude,
              longitude: passengerPosition.longitude,
            }}>
            <Image
              source={require('../assets/img/Localisation.png')}
              resizeMode="contain"
              style={{
                width: WINDOW_WIDTH * 0.1,
                height: WINDOW_WIDTH * 0.1,
                tintColor: COLORS.bluePrimary,
              }}
            />
          </Marker>
        )}
        {firestore.checkPoints.map(checkpoint => {
          return (
            <Marker
              key={checkpoint.name}
              onPress={() =>
                handleCard != undefined &&
                auth.userInfo?.userType == 'passenger'
                  ? handleCard(checkpoint)
                  : undefined
              }
              coordinate={{
                latitude: checkpoint.latitude,
                longitude: checkpoint.longitude,
              }}>
              <Image
                source={
                  checkpoint.latitude == destination?.latitude &&
                  checkpoint.longitude == destination?.longitude &&
                  checkpoint.name == destination?.name
                    ? require('../assets/img/Flag.png')
                    : require('../assets/img/checkpointMarker.png')
                }
                resizeMode="contain"
                style={{
                  width: WINDOW_WIDTH * 0.1,
                  height: WINDOW_WIDTH * 0.1,
                  tintColor:
                    checkpoint.latitude == destination?.latitude &&
                    checkpoint.longitude == destination.longitude &&
                    checkpoint.name == destination.name
                      ? COLORS.blue
                      : undefined,
                }}
              />
            </Marker>
          );
        })}
        {auth.userInfo?.userType == 'passenger' &&
          destination != undefined &&
          userLocation != undefined && (
            <MapViewDirections
              origin={userLocation}
              destination={destination}
              strokeColor="red"
              strokeWidth={3}
              apikey={
                Platform.OS == 'android'
                  ? GOOGLE_MAPS_API_KEY_ANDROID
                  : GOOGLE_MAPS_API_KEY_IOS
              }
              onReady={({ distance, duration }) =>
                getInfoPath != undefined
                  ? getInfoPath(distance, duration)
                  : undefined
              }
            />
          )}
        {auth.userInfo?.userType == 'driver' &&
          destination != undefined &&
          passengerPosition != undefined && (
            <MapViewDirections
              origin={passengerPosition}
              destination={destination}
              strokeColor="red"
              strokeWidth={3}
              apikey={
                Platform.OS == 'android'
                  ? GOOGLE_MAPS_API_KEY_ANDROID
                  : GOOGLE_MAPS_API_KEY_IOS
              }
              onReady={({ distance, duration }) =>
                getInfoPath != undefined
                  ? getInfoPath(distance, duration)
                  : undefined
              }
            />
          )}
      </MapView>
    </View>
  );
};

export default Map;
