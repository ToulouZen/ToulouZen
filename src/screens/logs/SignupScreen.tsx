import React from 'react';
import { Alert, Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Input, Icon } from 'react-native-elements';
import { COLORS, WINDOW_WIDTH } from '../../constants/Constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { styles } from '../../styles/styles';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../../types/types';

type Props = StackScreenProps<RootStackParamsList, 'Signup'>

const SignupScreen: React.FC<Props> = ({ navigation, route }) => {
    const [firstname, setFirstname] = React.useState<string>('Jeanne')
    const [lastname, setLastname] = React.useState<string>('Dupont')
    const [age, setAge] = React.useState<string>('21')
    const [mail, setMail] = React.useState<string>('jeanne_dupont@gmail.com')
    const [password, setPassword] = React.useState<string>('password')
    const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>('password')
    const [switched, setSwitched] = React.useState<boolean>(false)

    const auth = useAuth()
    // avatar: {},
    React.useEffect(() => {
        if (switched) {
            setToken()
        }
    }, [switched])


    const setToken = async () => {
        await AsyncStorage.setItem('MoneyTrackToken', 'autolog')
    }

    const signup = async () => {
        try {
            await auth.register(mail, password, firstname, lastname, Number(age))
            Alert.alert("Votre espace personnalisé a été créée", "Nous vous souhaitons la bienvenue dans la famille Toulou'Zen !", [
                {
                    text: 'Super !',
                    onPress: () => {
                        navigation.navigate('App')
                    }
                }
            ])
        } catch (e) {
            console.log(e);
            Alert.alert(e)

        }
    }

    return (
        <View style={[styles.container, { backgroundColor: COLORS.nude }]}>
            <Avatar
                containerStyle={styles.avatar}
                icon={{ type: "simple-line-icon", name: "user-female", size: WINDOW_WIDTH * 0.25, color: COLORS.white }}
                size="large"
                activeOpacity={0}
            >
                <View style={[styles.avatarEdit, { position: 'absolute', bottom: 0 }]}>
                    <MaterialIcons name="mode-edit" color={COLORS.white} size={WINDOW_WIDTH * 0.05} />
                </View>
            </Avatar>
            <ScrollView style={[styles.container, { backgroundColor: COLORS.nude }]}>
                <Input value={firstname} onChangeText={firstname => setFirstname(firstname)} placeholder="Jeanne"
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="Prénom" labelStyle={styles.logsInputLabel}
                />
                <Input value={lastname} onChangeText={lastname => setLastname(lastname)} placeholder="Dupont"
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="Nom" labelStyle={styles.logsInputLabel}
                />
                <Input value={age} keyboardType="numeric" onChangeText={age => setAge(age)} placeholder="18"
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="Age" labelStyle={styles.logsInputLabel}
                />
                <Input value={mail} onChangeText={mail => setMail(mail)} placeholder="jeanne_dupont@gmail.com"
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="E-mail" labelStyle={styles.logsInputLabel}
                />
                <Input value={password} onChangeText={password => setPassword(password)} secureTextEntry
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="Mot de passe" labelStyle={styles.logsInputLabel}
                />
                <Input value={passwordConfirmation} onChangeText={passwordConfirmation => setPasswordConfirmation(passwordConfirmation)} secureTextEntry
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="Confirmation du mot de passe" labelStyle={styles.logsInputLabel}
                />
            </ScrollView>
            <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                <View style={styles.stayConnected}>
                    <Text style={styles.stayConnectedText}>Rester connectée</Text>
                    <Switch ios_backgroundColor="#fff" thumbColor={COLORS.blackBackground} trackColor={{ false: COLORS.black, true: COLORS.raspberry }} value={switched} onValueChange={switched => setSwitched(switched)} />
                </View>
                <TouchableOpacity style={[styles.logsButton, { marginBottom: WINDOW_WIDTH * 0.02 }]} onPress={() => signup()}>
                    <Text style={styles.logsButtonText}>Valider</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default SignupScreen