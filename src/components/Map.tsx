import React, { Component } from 'react'
import MapView from 'react-native-maps'
import { StyleSheet, Dimensions, View } from 'react-native'
import MapViewDirections from 'react-native-maps-directions';

let { height, width } = Dimensions.get('window');
const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

const Map = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey=""
        />
      </MapView>
    </View>
  )
}

export default Map;