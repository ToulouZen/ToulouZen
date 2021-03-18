import React from 'react';
import { Text, View } from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import { styles } from '../../styles/styles';
// Map
import Map from '../../components/Map';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={{ color: '#fff' }}>HomeScreen</Text>
            <Map />
        </View>
    )
}

export default HomeScreen