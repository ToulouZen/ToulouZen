import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Alert, Image, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { COLORS, WINDOW_WIDTH } from '../../constants/Constants';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/styles';
import { RootStackParamsList } from '../../types/types';


type Props = StackScreenProps<RootStackParamsList, 'Login'>

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {

    const [mail, setMail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [switched, setSwitched] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (switched) {
            setToken()
        }
    }, [switched])

    const auth = useAuth()

    const setToken = async () => {
        await AsyncStorage.setItem('ToulouzenToken', 'autolog')
    }
    const resetPassword = () => { }

    const reset = () => {
        setMail('')
        setPassword('')
    }

    const login = async () => {
        try {
            await auth.signIn(mail, password)

            navigation.navigate('App')
            reset()
        } catch (e) {
            // e.code = "auth/user-not-found"
            // e.message = "There is no user record corresponding to this identifier. The user may have been deleted."
            if (e.code === "auth/user-not-found") {
                Alert.alert('Ce compte n\'existe pas')
            }
            else {
                Alert.alert(e.message)
            }
        }
    }

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../img/ToulouZenPink.png')} />
            <View style={[styles.container, { backgroundColor: COLORS.blackBackground }]}>
                <Input value={mail} onChangeText={mail => setMail(mail)} placeholder="jeanne_dupont@gmail.com"
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="Identifiant" labelStyle={[styles.logsInputLabel, { color: COLORS.white }]}
                />
                <Input value={password} onChangeText={password => setPassword(password)} secureTextEntry={true}
                    inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                    label="Mot de passe" labelStyle={[styles.logsInputLabel, { color: COLORS.white }]}
                />
            </View>
            <View style={[styles.container, { backgroundColor: COLORS.blackBackground, alignItems: 'center', justifyContent: 'center' }]}>
                <TouchableOpacity style={[{ marginBottom: WINDOW_WIDTH * 0.1 }]} onPress={() => resetPassword()}>
                    <Text style={[styles.logsButtonText, { fontFamily: 'Montserrat', textDecorationLine: 'underline', fontSize: WINDOW_WIDTH * 0.04, fontStyle: "italic" }]}>Mot de passe oublié</Text>
                </TouchableOpacity>
                <View style={styles.stayConnected}>
                    <Text style={[styles.stayConnectedText, { color: '#fff' }]}>Rester connectée</Text>
                    <Switch ios_backgroundColor="#fff" thumbColor={COLORS.blackBackground} trackColor={{ false: COLORS.black, true: COLORS.raspberry }} value={switched} onValueChange={switched => setSwitched(switched)} />
                </View>
            </View>
            <View style={[styles.container, { backgroundColor: COLORS.blackBackground, alignItems: 'center', justifyContent: 'center' }]}>
                <TouchableOpacity onPress={() => login()} style={[styles.logsButton, { marginBottom: WINDOW_WIDTH * 0.02 }]}>
                    <Text style={[styles.logsButtonText, { fontFamily: 'Montserrat' }]}>Connexion</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[styles.logsButton, { marginTop: WINDOW_WIDTH * 0.02 }]}>
                    <Text style={[styles.logsButtonText, { fontFamily: 'Montserrat' }]}>Inscription</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoginScreen