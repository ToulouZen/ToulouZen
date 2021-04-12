import React from 'react';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamsList, Path } from '../../types/types'
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { Region } from 'react-native-maps';
import { Icon, Overlay } from 'react-native-elements';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants/Constants';
import { styles } from '../../styles/styles';
// Map
import Map from '../../components/Map';

type Props = StackScreenProps<RootStackParamsList, 'DriverConfirm'>

const DriverConfirmScreen: React.FC<Props> = ({ navigation, route }) => {

    const [driverPath, setPath] = React.useState<Path>()
    const [modalVisible, setModalVisible] = React.useState(false);
    const [region, setRegion] = React.useState<Region>({ latitude: 43.604652, longitude: 1.444209, latitudeDelta: 0.0922, longitudeDelta: 0.0421 })

    React.useEffect(() => {
        const path = route.params?.path
        setPath(path)
      }, [])

    React.useEffect(() => {
        if(driverPath != undefined && driverPath != null)
        {
            setRegion({latitude: driverPath?.arrivalDestination.latitude, longitude: driverPath?.arrivalDestination.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 })
        }
    }, [])  
    
    return (
        <>
            <View style={[styles.container, {backgroundColor: COLORS.white, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}]}>
            <Overlay isVisible={modalVisible} fullScreen animationType="slide">
                <View style={{flex : 1, backgroundColor: "transparent", justifyContent:'center', alignItems: 'center', flexDirection: 'column'}}> 
                    <Map handleCard={() => {}} closeCard={() => {}} getInfoPath={() => {}} destination={driverPath?.arrivalDestination} region={region} passengerPosition={driverPath?.departureDestination} />
                    <View style={{position: 'absolute', bottom: 5 }}>
                        <Icon name="arrow-down-circle" type="ionicon" size={WINDOW_WIDTH * 0.1} color="#52ad8d" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Overlay>
                <Image
                    style={styles.logoHeader}
                    source={require('../../img/logo_toulouzen.png')}
                    resizeMode="contain"
                />
                <Image
                    style={{ width: WINDOW_WIDTH }}
                    source={require('../../img/Courbe.png')}
                    resizeMode="contain"
                />
                <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                    <View style={{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={[styles.logTexts, {color: COLORS.peach}]}>
                            Trajet en cours... {'\n'}
                        </Text>
                    </View>
                    <View style={{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 20}}>
                        <Text style={[styles.logTexts, {color: COLORS.peach, textAlign: 'left', width: '50%', paddingLeft: 20}]}>
                            Départ :  
                        </Text>
                        <Text style={[styles.logTexts, {color: COLORS.blackBackground, textAlign: 'left', width: '50%'}]}>
                           {driverPath?.departureDestination.name}
                        </Text>
                    </View>
                    <View style={{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' , marginTop: 20}}>
                        <Text style={[styles.logTexts, {color: COLORS.peach, textAlign: 'left', width: '50%', paddingLeft: 20}]}>
                            Arrivée :
                        </Text>
                        <Text style={[styles.logTexts, {color: COLORS.blackBackground, textAlign: 'left', width: '50%'}]}>
                            {driverPath?.arrivalDestination.name}
                        </Text>
                    </View>
                    <View style={{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 20}}>
                        <Text style={[styles.logTexts, {color: COLORS.peach, textAlign: 'center'}]}>
                            En attente de la validation de {driverPath?.userFirstname} {driverPath?.userLastname}
                        </Text>
                        
                    </View>
                    {
                        true ? (
                            <ActivityIndicator animating={true} color="#52ad8d" style={{marginTop: 50}} size="large" />
                        )
                        :
                        (
                            <Icon name="checkmark-circle" type="ionicon" size={WINDOW_WIDTH * 0.1} color="#52ad8d" style={{marginTop: 50}} />
                        )
                    }

                    <Icon name="arrow-up-circle" type="ionicon" size={WINDOW_WIDTH * 0.1} color="#52ad8d" style={{marginTop: 50}} onPress={() => setModalVisible(true)} />
                </View>
            </View>
        </>
    )
}

export default DriverConfirmScreen