import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants/Constants';
import { styles } from '../../styles/styles';
import { Icon } from 'react-native-elements';
// Map
import Map from '../../components/Map';
import HeaderMap from '../../components/HeaderMap';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamsList } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import NavigationComponent from '../../components/NavigationComponent';

type Props = DrawerScreenProps<RootStackParamsList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
   
    return (
        <>
            <View style={styles.container}>
                <Map />
                <HeaderMap navigation={navigation} />
                <NavigationComponent />
            </View>
        </>
    )
}

export default HomeScreen