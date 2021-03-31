import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants/Constants';
import { styles } from '../../styles/styles';
import { Icon } from 'react-native-elements';
// Map
import Map from '../../components/Map';
import HeaderMap from '../../components/HeaderMap';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Checkpoint, RootStackParamsList } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import NavigationComponent from '../../components/NavigationComponent';
import CheckpointCard from '../../components/CheckpointCard';

type Props = DrawerScreenProps<RootStackParamsList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {

    const [checkpointSelected, setCheckpointSelected] = React.useState<Checkpoint>()
    const [showCheckpointCard, setShowCheckpointCard] = React.useState<boolean>(false)

    const handleCard = (checkpoint: Checkpoint) => {
        setCheckpointSelected(checkpoint)
        setShowCheckpointCard(true)
    }
    const closeCard = () => {
        setCheckpointSelected(undefined)
        setShowCheckpointCard(false)
    }

    return (
        <>
            <View style={styles.container}>
                <Map handleCard={handleCard} closeCard={closeCard} />
                <View style={{ position: 'absolute', top: 0, }}>
                    <HeaderMap navigation={navigation} />
                    {showCheckpointCard &&
                        <CheckpointCard checkpoint={checkpointSelected!} />
                    }
                </View>
                <NavigationComponent />
            </View>
        </>
    )
}

export default HomeScreen