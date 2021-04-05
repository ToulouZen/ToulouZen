import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants';
import { useFirestore } from '../contexts/FirestoreContext';
import { styles } from '../styles/styles';
import { Checkpoint } from '../types/types';

type Props = {
    handleRegion: (checkpoint: Checkpoint) => void,
    goTo: (checkpoint: Checkpoint) => void,
    distance?: number,
    duration?: number
}

const TIMES = ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00"];

const NavigationComponent: React.FC<Props> = ({ handleRegion, goTo, distance, duration }) => {
    const [departureDestination, setDepartureDestination] = React.useState<string>('Votre position')
    const [arrivalDestination, setArrivalDestination] = React.useState<Checkpoint>()
    const [isVisible, setIsVisible] = React.useState<boolean>(false)
    const [isPosition, setIsPosition] = React.useState<boolean>(false)
    const [isTime, setIsTime] = React.useState<boolean>(false)
    const [timeDeparture, setTimeDeparture] = React.useState<string>('Maintenant')
    const [driverFound, setDriverFound] = React.useState<boolean>(false)
    const refDepartureDestination = React.createRef<TextInput>()
    const refArrivalDestination = React.createRef<TextInput>()

    const firestore = useFirestore()

    React.useEffect(() => {
        if (arrivalDestination != undefined) {
            handleRegion(arrivalDestination)
        }
    }, [arrivalDestination])

    React.useEffect(() => {
        refArrivalDestination.current?.blur()
    }, [isVisible])

    return (
        <View style={{ position: 'absolute', bottom: 0, width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.4, backgroundColor: '#fff', borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>
            <Overlay isVisible={isVisible} >
                <>
                    {
                        isPosition &&
                        <Picker
                            style={{ width: WINDOW_WIDTH * 0.9 }}
                            selectedValue={arrivalDestination?.name}
                            onValueChange={(itemValue) => {
                                const index = firestore.checkPoints.findIndex((checkpoint) => checkpoint.name == itemValue)
                                goTo(firestore.checkPoints[index])
                                setArrivalDestination(firestore.checkPoints[index])

                            }
                            }>
                            <Picker.Item key="Aucune" label="Aucune" value="Aucune" />
                            {
                                firestore.checkPoints.map((checkpoint: Checkpoint) => <Picker.Item key={checkpoint.name} label={checkpoint.name} value={checkpoint.name} />)
                            }
                        </Picker>
                    }
                    {
                        isTime &&
                        <Picker
                            style={{ width: WINDOW_WIDTH * 0.9 }}
                            selectedValue={timeDeparture}
                            onValueChange={(itemValue) => {
                                setTimeDeparture(itemValue)
                            }
                            }>
                            <Picker.Item key="Maintenant" label="Maintenant" value="Maintenant" />
                            {
                                TIMES.map((value: string) => <Picker.Item key={value} label={value} value={value} />)
                            }
                        </Picker>
                    }
                    <Icon onPress={() => {
                        if (isPosition) {
                            refArrivalDestination.current?.blur()
                            setIsPosition(false)
                        }
                        if (isTime) {
                            setIsTime(false)
                        }
                        setIsVisible(false)
                    }}
                        name="checkmark-circle" type="ionicon" size={WINDOW_WIDTH * 0.1} color="#00A3D8" />
                </>
            </Overlay>
            <View style={[styles.shadowContainer, { backgroundColor: '#fff', paddingVertical: WINDOW_WIDTH * 0.06, borderTopRightRadius: 15, borderTopLeftRadius: 15 }]}>
                <View style={{ flexDirection: "column", alignItems: "center", height: WINDOW_WIDTH * 0.16, width: WINDOW_WIDTH * 0.10, position: "absolute", paddingTop: WINDOW_WIDTH * 0.08 }}>
                    { /* icon + divider + point */}
                    <Image source={require('../img/localisation_itineraire.png')} resizeMode="contain" style={{ width: WINDOW_WIDTH * 0.06, height: WINDOW_WIDTH * 0.06, tintColor: COLORS.peach }} />
                    <View style={{ height: 30, width: 1, backgroundColor: COLORS.peach }} />
                    <Icon type="entypo" name="circle" size={WINDOW_WIDTH * 0.03} color={COLORS.green} />
                </View>
                <View>
                    <TextInput ref={refDepartureDestination} style={[styles.containerMargin, styles.containerPadding, styles.inputAddress]} placeholder="Votre position" value={departureDestination} onChangeText={value => setDepartureDestination(value)} />
                    <TextInput ref={refArrivalDestination} onFocus={() => {
                        setIsPosition(true)
                        setIsVisible(true)
                    }}
                        style={[styles.containerMargin, styles.containerPadding, styles.inputAddress]} placeholder="Où souhaitez-vous aller" value={arrivalDestination?.name} />
                    <View style={{ width: WINDOW_WIDTH * 0.7, alignSelf: 'center' }}>
                        <TouchableOpacity style={[styles.containerMargin, styles.startButton, { padding: WINDOW_WIDTH * 0.01 }]} onPress={() => {
                            setIsTime(true)
                            setIsVisible(true)
                        }}>
                            <Icon type="evilicon" name="clock" size={WINDOW_WIDTH * 0.06} color={COLORS.peach} />
                            <Text style={{ color: COLORS.peach, fontSize: WINDOW_WIDTH * 0.04 }}>{timeDeparture}</Text>
                            <Image source={require('../img/arrow.png')} resizeMode="contain" style={{ width: WINDOW_WIDTH * 0.06, height: WINDOW_WIDTH * 0.06, tintColor: COLORS.peach, transform: [{ rotate: '90deg' }] }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => firestore.createPath({ latitude: 43.604652, longitude: 1.444209, name: "Position du passager" }, arrivalDestination!, timeDeparture, distance!, duration!)}
                        style={[styles.logButtons, styles.containerMargin]}>
                        <Text style={styles.userTypeTextPassagere}>Trouver ma chauffeuse</Text>
                    </TouchableOpacity>
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