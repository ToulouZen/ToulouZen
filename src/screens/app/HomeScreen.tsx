import React from 'react';
import { Text, View } from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import { styles } from '../../styles/styles';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <HeaderComponent />
            <Text>HomeScreen</Text>
        </View>
    )
}

export default HomeScreen