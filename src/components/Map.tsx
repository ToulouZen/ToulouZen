import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Image, Platform, StyleSheet, View } from 'react-native'
import MapViewDirections from 'react-native-maps-directions';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants';
import GetLocation from 'react-native-get-location'
import { useFirestore } from '../contexts/FirestoreContext';

const origin = { latitude: 43.604652, longitude: 1.444209 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };
const stylesCustom = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    justifyContent: 'space-between'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

const GOOGLE_MAPS_API_KEY_IOS = "AIzaSyCE-KihYba5ky6xGMyIidiT9p_jvDDEVV0"
const GOOGLE_MAPS_API_KEY_ANDROID = "AIzaSyDQtHXsHSB3bclc637t5T6i3hTTZo44jAc"

const Map = () => {

  const [userLocation, setUserLocation] = React.useState<{ latitude: number, longitude: number }>()
  const [userLocationFound, setUserLocationFound] = React.useState<boolean>(false)

  const firestore = useFirestore()

  React.useEffect(() => {
    console.log(firestore.checkPoints)
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location)
        setUserLocation({ latitude: location.latitude, longitude: location.longitude })
        setUserLocationFound(true)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  return (
    <View style={stylesCustom.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={stylesCustom.map}
        initialRegion={{
          latitude: 43.604652,
          longitude: 1.444209,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {
          userLocationFound &&
          <Marker coordinate={{ latitude: userLocation!.latitude, longitude: userLocation!.longitude }}>
            <Image source={require('../img/Localisation.png')} resizeMode="contain"
              style={{ width: WINDOW_WIDTH * 0.1, height: WINDOW_WIDTH * 0.1, tintColor: COLORS.peach }} />
          </Marker>
        }
        {
          firestore.checkPoints.map((checkpoint) => {
            return (
              <Marker key={checkpoint.name} 
                coordinate={{ latitude: checkpoint.latitude, longitude: checkpoint.longitude }}>
                <Image source={require('../img/checkpointMarker.png')} resizeMode="contain"
                  style={{ width: WINDOW_WIDTH * 0.1, height: WINDOW_WIDTH * 0.1 }} />
              </Marker>
            )
          })
        }
        {/* <MapViewDirections
          origin={origin}
          destination={destination}
          strokeColor="red"
          strokeWidth={5}
          apikey={Platform.OS == "android" ? GOOGLE_MAPS_API_KEY_ANDROID : GOOGLE_MAPS_API_KEY_IOS}
        /> */}
      </MapView>
    </View>
  )
}

export default Map;