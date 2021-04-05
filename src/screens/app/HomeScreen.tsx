import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants/Constants';
import { styles } from '../../styles/styles';
import { Icon } from 'react-native-elements';
// Map
import Map from '../../components/Map';
import HeaderMap from '../../components/HeaderMap';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Checkpoint, Path, RootStackParamsList } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import NavigationComponent from '../../components/NavigationComponent';
import CheckpointCard from '../../components/CheckpointCard';
import { Region } from 'react-native-maps';
import PathsComponent from '../../components/PathsComponent';

type Props = DrawerScreenProps<RootStackParamsList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {

    const [checkpointSelected, setCheckpointSelected] = React.useState<Checkpoint>()
    const [showCheckpointCard, setShowCheckpointCard] = React.useState<boolean>(false)
    const [checkpointToGo, setCheckpointToGo] = React.useState<Checkpoint>()
    const [region, setRegion] = React.useState<Region>({ latitude: 43.604652, longitude: 1.444209, latitudeDelta: 0.0922, longitudeDelta: 0.0421 })
    const [durationPath, setDurationPath] = React.useState<number>(0)
    const [distancePath, setDistancePath] = React.useState<number>(0)
    const [passengerPosition, setPassengerPosition] = React.useState<Checkpoint>()

    const auth = useAuth()

    const handleCard = (checkpoint: Checkpoint) => {
        setCheckpointSelected(checkpoint)
        setShowCheckpointCard(true)
    }
    const closeCard = () => {
        setCheckpointSelected(undefined)
        setShowCheckpointCard(false)
    }

    const handleRegion = (checkpoint: Checkpoint) => {
        setRegion({ latitude: checkpoint.latitude, longitude: checkpoint.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 })
    }

    const goTo = (checkpoint: Checkpoint) => {
        setCheckpointToGo(checkpoint)
    }

    const getInfoPath = (distance: number, duration: number) => {
        setDistancePath(distance)
        setDurationPath(duration)
    }

    const handlePath = (path: Path) => {
        setCheckpointToGo(path.arrivalDestination)
        setPassengerPosition(path.departureDestination)
    }

    return (
        <>
            <View style={styles.container}>
                <Map handleCard={handleCard} closeCard={closeCard} destination={checkpointToGo} region={region} getInfoPath={getInfoPath} passengerPosition={passengerPosition} />
                <View style={{ position: 'absolute', top: 0, }}>
                    <HeaderMap navigation={navigation} />
                    {showCheckpointCard &&
                        <CheckpointCard checkpoint={checkpointSelected!} goTo={goTo} />
                    }
                </View>
                {
                    auth.userInfo?.userType == "passenger" &&
                    <NavigationComponent handleRegion={handleRegion} goTo={goTo} distance={distancePath} duration={durationPath} />
                }
                {
                    auth.userInfo?.userType == "driver" &&
                    <PathsComponent handlePath={handlePath} />
                }
            </View>
        </>
    )
}

export default HomeScreen