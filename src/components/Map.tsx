import MapboxGL from '@react-native-mapbox-gl/maps';
import Driver from 'assets/img/driver.svg';
import Flag from 'assets/img/flag-fill.svg';
import { Checkpoint } from 'common/types/types';
import {
  IS_ANDROID,
  MAPBOX_PUBLIC_API_KEY,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from 'constants/Constants';
import {
  defaultAppLocation,
  useLocationContext,
} from 'contexts/LocationContext';
import { getRoutesFromTwoCoordinates } from 'networking/routes';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

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
  showDriver: GeoJSON.Position[];
  getInfoPath?: (distance: number, duration: number) => void;
  shouldShowRouteFromDriverToDeparture: boolean;
};

const Map: FC<Props> = ({
  closeCard,
  destination,
  showDriver,
  shouldShowRouteFromDriverToDeparture,
}) => {
  const { userLocation, updateUserLocation } = useLocationContext();
  const [isLocationPermission, setLocationPermission] = useState<
    boolean | undefined
  >();
  const [routeFromDepartureToArrival, setRouteFromDepartureToArrival] =
    useState<GeoJSON.Geometry | null>();
  const [routeFromDriverToDeparture, setRouteFromDriverToDeparture] =
    useState<GeoJSON.Geometry | null>();

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

  useEffect(() => {
    if (shouldShowRouteFromDriverToDeparture) {
      if (destination) {
        getRoutesFromTwoCoordinates({
          departureLocation: {
            latitude: showDriver[0][1],
            longitude: showDriver[0][0],
          },
          arrivalLocation: userLocation,
          overview: 'full',
        }).then(routes => {
          setRouteFromDriverToDeparture(routes?.geometry);
        });
      }
    }
  }, [shouldShowRouteFromDriverToDeparture]);

  const askAndroidPermission = async () => {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      setLocationPermission(isGranted);
      console.log('Is location permission granted :', isGranted);
    }
  };

  const onLocationUpdate = (location: {
    coords: { latitude: any; longitude: any };
  }) => {
    console.log('Update location (MapboxGL.UserLocation)', location);
    updateUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const renderAnnotation = (coordinate: GeoJSON.Position, counter: number) => {
    const id = `pointAnnotation${counter}`;

    return (
      <MapboxGL.PointAnnotation key={id} id={id} coordinate={coordinate}>
        <Driver
          style={{
            flex: 1,
            width: 25,
            height: 25,
          }}
        />
      </MapboxGL.PointAnnotation>
    );
  };

  const renderAnnotations = () => {
    const items = [];

    for (let i = 0; i < showDriver.length; i++) {
      console.log('showDriver', showDriver[i]);
      items.push(renderAnnotation(showDriver[i], i));
    }

    return items;
  };

  return (
    <View style={stylesCustom.container}>
      <MapboxGL.MapView
        onPress={() => (closeCard !== undefined ? closeCard() : undefined)}
        style={stylesCustom.map}
        compassEnabled={false}>
        {routeFromDepartureToArrival ? (
          <MapboxGL.ShapeSource
            id="routeSourceDepartureToArrival"
            shape={routeFromDepartureToArrival}>
            <MapboxGL.LineLayer
              id="routeFillDepartureToArrival"
              style={{
                lineColor: shouldShowRouteFromDriverToDeparture
                  ? '#1E262554'
                  : 'black',
                lineWidth: 2,
              }}
            />
          </MapboxGL.ShapeSource>
        ) : null}
        {routeFromDepartureToArrival ? (
          <MapboxGL.PointAnnotation
            key="arrivalPin"
            id="arrivalPin"
            coordinate={[destination!.longitude, destination!.latitude]}>
            <Flag
              style={{
                width: 25,
                height: 25,
              }}
            />
          </MapboxGL.PointAnnotation>
        ) : null}
        {routeFromDriverToDeparture ? (
          <MapboxGL.ShapeSource
            id="routeSourceDriverToDeparture"
            shape={routeFromDriverToDeparture}>
            <MapboxGL.LineLayer
              id="routeFillDriverToDeparture"
              style={{ lineColor: '#F9BE90', lineWidth: 2 }}
            />
          </MapboxGL.ShapeSource>
        ) : null}
        {isLocationPermission ? (
          <MapboxGL.UserLocation
            visible
            androidRenderMode="normal"
            renderMode="native"
            showsUserHeadingIndicator
            onUpdate={onLocationUpdate}
          />
        ) : null}
        {userLocation !== defaultAppLocation ? (
          <MapboxGL.Camera
            allowUpdates={false}
            followUserLocation={false}
            zoomLevel={13}
            animationMode="flyTo"
            animationDuration={1000}
            centerCoordinate={[userLocation.longitude, userLocation.latitude]}
          />
        ) : null}
        {renderAnnotations()}
      </MapboxGL.MapView>
    </View>
  );
};

export default Map;
