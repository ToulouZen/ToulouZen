import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants';
import { styles } from '../styles/styles';

const NavigationComponent = () => {
    const [departureDestination, setDepartureDestination] = React.useState<string>('')
    const [arrivalDestination, setArrivalDestination] = React.useState<string>('')


    return (
        <View style={{ position: 'absolute', bottom: 0, width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.4, backgroundColor: '#fff' }}>
            <View style={[styles.shadowContainer, { backgroundColor: '#fff', paddingVertical: WINDOW_WIDTH * 0.06 }]}>
                <View style={{flexDirection: "column", alignItems: "center", height: WINDOW_WIDTH * 0.16, width: WINDOW_WIDTH * 0.10, position: "absolute", paddingTop: WINDOW_WIDTH * 0.08}}>
                    { /* icon + divider + point */}
                    <Image source={require('../img/localisation_itineraire.png')} resizeMode="contain" style={{ width: WINDOW_WIDTH * 0.06, height: WINDOW_WIDTH * 0.06, tintColor: COLORS.peach}} />
                    <View style={{ height : 30, width: 1, backgroundColor: COLORS.peach }} />
                    <Icon type="entypo" name="circle" size={WINDOW_WIDTH * 0.03} color={COLORS.green} />
                </View>
                <View>
                    <TextInput style={[styles.containerMargin, styles.containerPadding, styles.inputAddress]} placeholder="Votre position" value={departureDestination} onChangeText={value => setDepartureDestination(value)} />
                    <TextInput style={[styles.containerMargin, styles.containerPadding, styles.inputAddress]} placeholder="Où souhaitez-vous aller" value={arrivalDestination} onChangeText={value => setArrivalDestination(value)} />
                    <View style={{ width: WINDOW_WIDTH * 0.7, alignSelf: 'center' }}>
                        <TouchableOpacity style={[styles.containerMargin, styles.startButton, { padding: WINDOW_WIDTH * 0.01 }]}>
                            <Icon type="evilicon" name="clock" size={WINDOW_WIDTH * 0.06} color={COLORS.peach} />
                            <Text style={{ color: COLORS.peach, fontSize: WINDOW_WIDTH * 0.04 }}>Maintenant</Text>
                            <Image source={require('../img/arrow.png')} resizeMode="contain" style={{ width: WINDOW_WIDTH * 0.06, height: WINDOW_WIDTH * 0.06, tintColor: COLORS.peach, transform: [{ rotate: '90deg' }] }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={[styles.containerPadding, { backgroundColor: 'rgba(230,230,230,0.5)', flex: 1 }]}>
                <TouchableOpacity style={[styles.containerPadding, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Image source={require('../img/Favori.png')} resizeMode="contain" style={{ width: WINDOW_WIDTH * 0.08, height: WINDOW_WIDTH * 0.08, tintColor: COLORS.bluePrimary }} />
                    <Text style={{ fontSize: WINDOW_WIDTH * 0.05, marginLeft: WINDOW_WIDTH * 0.05, color: COLORS.bluePrimary }}>Destinations enregistrées</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NavigationComponent