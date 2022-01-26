import MapboxGL from '@react-native-mapbox-gl/maps';
import { Checkpoint, Region } from 'common/types/types';
import {
  IS_ANDROID,
  MAPBOX_PUBLIC_API_KEY,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import { defaultAppLocation, useLocationContext } from 'contexts/LocationContext';
import { getRoutesFromTwoCoordinates } from 'networking/routes';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GEOJSON_FAKER } from '../faker/geojson';

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

type Props = {
  handleCard?: (checkpoint: Checkpoint) => void;
  closeCard?: () => void;
  destination?: Checkpoint;
  passengerPosition?: Checkpoint;
  region: Region;
  getInfoPath?: (distance: number, duration: number) => void;
};

const Map: FC<Props> = ({
  handleCard,
  closeCard,
  destination,
  region,
  getInfoPath,
  passengerPosition,
}) => {
  const { userLocation, updateUserLocation } = useLocationContext();
  const [isLocationPermission, setLocationPermission] = useState<
    boolean | undefined
  >();
  const [routeFromDepartureToArrival, setRouteFromDepartureToArrival] =
    useState<GeoJSON.Geometry | null>();

  const firestore = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    MapboxGL.setAccessToken(MAPBOX_PUBLIC_API_KEY);
    askAndroidPermission();
  }, []);

  useEffect(() => {
    if (destination) {
      getRoutesFromTwoCoordinates({
        departureLocation: userLocation,
        arrivalLocation: destination,
        overview: 'full',
      }).then(routes => {
        setRouteFromDepartureToArrival(routes?.geometry);
      });
    }
  }, [destination]);

  const askAndroidPermission = async () => {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      setLocationPermission(isGranted);
      console.log('Is location permission granted :', isGranted);
    }
  };

  return (
    <View style={stylesCustom.container}>
      <MapboxGL.MapView
        onPress={() => (closeCard !== undefined ? closeCard() : undefined)}
        style={stylesCustom.map}
        compassEnabled={false}>
        {routeFromDepartureToArrival ? (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={routeFromDepartureToArrival}>
            <MapboxGL.LineLayer
              id="routeFill"
              style={{ lineColor: 'black', lineWidth: 2 }}
            />
          </MapboxGL.ShapeSource>
        ) : null}
        {isLocationPermission ? (
          <MapboxGL.UserLocation
            visible
            onUpdate={location => {
              console.log(location);
              updateUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }}
          />
        ) : null}
        {userLocation !== defaultAppLocation ? (
          <MapboxGL.Camera
            allowUpdates={false}
            followUserLocation={false}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={3000}
            centerCoordinate={[userLocation.longitude, userLocation.latitude]}
          />
        ) : null}
        {/* {firestore.checkPoints.map(checkpoint => {
          return (
            <Marker
              key={checkpoint.name}
              onPress={() =>
                handleCard !== undefined &&
                auth.userInfo?.userType === PASSENGER
                  ? handleCard(checkpoint)
                  : undefined
              }
              coordinate={{
                latitude: checkpoint.latitude,
                longitude: checkpoint.longitude,
              }}>
              <Image
                source={
                  checkpoint.latitude === destination?.latitude &&
                  checkpoint.longitude === destination?.longitude &&
                  checkpoint.name === destination?.name
                    ? require('../assets/img/Flag.png')
                    : require('../assets/img/checkpointMarker.png')
                }
                resizeMode="contain"
                style={{
                  width: WINDOW_WIDTH * 0.1,
                  height: WINDOW_WIDTH * 0.1,
                  tintColor:
                    checkpoint.latitude === destination?.latitude &&
                    checkpoint.longitude === destination.longitude &&
                    checkpoint.name === destination.name
                      ? COLORS.blue
                      : undefined,
                }}
              />
            </Marker>
          );
        })} */}
        {/* {auth.userInfo?.userType === PASSENGER &&
          destination !== undefined &&
          userLocation !== undefined && (
            <MapViewDirections
              origin={userLocation}
              destination={destination}
              strokeColor="red"
              strokeWidth={3}
              apikey={
                Platform.OS === 'android'
                  ? GOOGLE_MAPS_API_KEY_ANDROID
                  : GOOGLE_MAPS_API_KEY_IOS
              }
              onReady={({ distance, duration }) =>
                getInfoPath !== undefined
                  ? getInfoPath(distance, duration)
                  : undefined
              }
            />
          )} */}
        {/* {auth.userInfo?.userType === DRIVER &&
          destination !== undefined &&
          passengerPosition !== undefined && (
            <MapViewDirections
              origin={passengerPosition}
              destination={destination}
              strokeColor="red"
              strokeWidth={3}
              apikey={
                Platform.OS === 'android'
                  ? GOOGLE_MAPS_API_KEY_ANDROID
                  : GOOGLE_MAPS_API_KEY_IOS
              }
              onReady={({ distance, duration }) =>
                getInfoPath !== undefined
                  ? getInfoPath(distance, duration)
                  : undefined
              }
            />
          )} */}
      </MapboxGL.MapView>
    </View>
  );
};

export default Map;
